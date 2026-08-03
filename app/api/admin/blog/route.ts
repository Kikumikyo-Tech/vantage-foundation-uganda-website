import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { verifySessionToken, sessionCookieName, BOOTSTRAP_ACTOR_ID } from "@/lib/session";
import { validateCsrf, validateCsrfHeader, CSRF_HEADER_NAME } from "@/lib/csrf";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { logWarn, logInfo, logError } from "@/lib/logger";
import { appendAuditLog } from "@/lib/db/audit";
import {
  createBlogPost,
  getBlogPosts,
  getBlogPostById,
  getBlogPostBySlug,
  updateBlogPost,
  softDeleteBlogPost,
  BlogCategory,
  BlogConsent,
} from "@/lib/db/blog";
import { headR2Object, deleteR2Object } from "@/lib/storage/r2-client";

const BLOG_CATEGORIES = [
  "Health",
  "Education",
  "Humanitarian Action",
  "Community Stories",
  "Foundation News",
  "Research & Learning",
  "Accountability",
] as const;

const CONSENT_VALUES = ["none", "verified", "pending", "group-consent"] as const;

// ---------------------------------------------------------------------------
// Shared auth + CSRF + rate-limit guard (mirrors app/api/admin/media/route.ts).
// ---------------------------------------------------------------------------

async function guard(
  request: Request
): Promise<{ ok: true; ip: string; actorId: string } | { ok: false; response: NextResponse }> {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(sessionCookieName)?.value);
  if (!session) {
    logWarn("blog_api_unauthorized", {});
    return { ok: false, response: NextResponse.json({ error: "unauthorized" }, { status: 401 }) };
  }
  const ip = getClientIp(request.headers);
  if (!rateLimit({ key: `blog-api:${ip}`, limit: 60, windowMs: 60_000 })) {
    logWarn("blog_api_rate_limited", { ip });
    return { ok: false, response: NextResponse.json({ error: "rate-limited" }, { status: 429 }) };
  }
  return { ok: true, ip, actorId: session.actorId };
}

async function readBody(request: Request, cookieStore: Awaited<ReturnType<typeof cookies>>) {
  const contentType = request.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    const csrfOk = validateCsrfHeader(cookieStore, request.headers.get(CSRF_HEADER_NAME));
    return { body: await request.json(), csrfOk };
  }
  const formData = await request.formData();
  const csrfOk = validateCsrf(cookieStore, formData);
  return { body: Object.fromEntries(formData.entries()), csrfOk };
}

// ---------------------------------------------------------------------------
// GET /api/admin/blog — list posts (optionally filtered), including drafts.
// ---------------------------------------------------------------------------

export async function GET(request: Request) {
  const guardResult = await guard(request);
  if (!guardResult.ok) return guardResult.response;
  const { ip } = guardResult;

  const url = new URL(request.url);
  const category = url.searchParams.get("category") ?? undefined;
  const publishedParam = url.searchParams.get("published");
  const published =
    publishedParam === "true" ? true : publishedParam === "false" ? false : undefined;

  try {
    const rows = await getBlogPosts({ category, published });
    logInfo("blog_list_ok", { count: rows.length, ip });
    return NextResponse.json({ items: rows });
  } catch (err) {
    logError("blog_list_failed", {
      error: (err instanceof Error ? err.message : String(err)).substring(0, 200),
    });
    return NextResponse.json({ error: "db" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// POST /api/admin/blog — create a new post (draft by default).
//
// If heroImageKey is supplied, it must already exist in R2 (uploaded via the
// existing /api/admin/media/presign flow with folder="blog") — confirmed via
// HEAD before the row is written, same integrity check media_objects uses.
// ---------------------------------------------------------------------------

const createSchema = z.object({
  slug: z
    .string()
    .min(1)
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "must be a lowercase slug"),
  title: z.string().min(1).max(200),
  category: z.enum(BLOG_CATEGORIES),
  summary: z.string().min(1).max(500),
  body: z.string().min(1),
  author: z.string().max(150).optional(),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  readingTimeMinutes: z.coerce.number().int().positive().optional(),
  heroImageKey: z.string().max(500).optional(),
  heroImageAlt: z.string().max(500).optional(),
  consentClassification: z.enum(CONSENT_VALUES).optional().default("none"),
  seoTitle: z.string().max(200).optional(),
  seoDescription: z.string().max(300).optional(),
  published: z.coerce.boolean().optional().default(false),
  csrf_token: z.string().optional(),
});

export async function POST(request: Request) {
  const guardResult = await guard(request);
  if (!guardResult.ok) return guardResult.response;
  const { ip, actorId } = guardResult;

  const cookieStore = await cookies();
  const { body, csrfOk } = await readBody(request, cookieStore);
  if (!csrfOk) {
    logWarn("blog_create_csrf_failed", { ip });
    return NextResponse.json({ error: "csrf" }, { status: 403 });
  }

  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    logWarn("blog_create_validation_failed", { issues: parsed.error.issues.length });
    return NextResponse.json(
      { error: "invalid", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }
  const input = parsed.data;

  const existing = await getBlogPostBySlug(input.slug);
  if (existing) {
    return NextResponse.json({ error: "duplicate", id: existing.id }, { status: 409 });
  }

  if (input.heroImageKey) {
    const head = await headR2Object(input.heroImageKey);
    if (!head) {
      logWarn("blog_create_hero_missing", { objectKey: input.heroImageKey });
      return NextResponse.json({ error: "object-not-found" }, { status: 404 });
    }
  }

  try {
    const row = await createBlogPost({
      slug: input.slug,
      title: input.title,
      category: input.category as BlogCategory,
      summary: input.summary,
      body: input.body,
      author: input.author,
      publishedAt: input.publishedAt,
      readingTimeMinutes: input.readingTimeMinutes,
      heroImageKey: input.heroImageKey,
      heroImageAlt: input.heroImageAlt,
      consentClassification: input.consentClassification as BlogConsent,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      published: input.published,
    });
    logInfo("blog_created", { id: row.id, slug: row.slug, ip });
    await appendAuditLog({
      actorId,
      actorKind: actorId === BOOTSTRAP_ACTOR_ID ? "bootstrap" : "admin",
      action: "blog.created",
      resourceType: "blog_post",
      resourceId: row.id,
      after: { slug: row.slug, title: row.title, category: row.category, published: row.published },
      ip,
    });
    return NextResponse.json({ item: row }, { status: 201 });
  } catch (err) {
    logError("blog_create_failed", {
      error: (err instanceof Error ? err.message : String(err)).substring(0, 200),
    });
    return NextResponse.json({ error: "db" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// PATCH /api/admin/blog — update editable fields on a post.
// ---------------------------------------------------------------------------

const updateSchema = z.object({
  id: z.coerce.number().int().positive(),
  title: z.string().min(1).max(200).optional(),
  category: z.enum(BLOG_CATEGORIES).optional(),
  summary: z.string().min(1).max(500).optional(),
  body: z.string().min(1).optional(),
  author: z.string().max(150).nullable().optional(),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  readingTimeMinutes: z.coerce.number().int().positive().nullable().optional(),
  heroImageKey: z.string().max(500).nullable().optional(),
  heroImageAlt: z.string().max(500).nullable().optional(),
  consentClassification: z.enum(CONSENT_VALUES).optional(),
  seoTitle: z.string().max(200).nullable().optional(),
  seoDescription: z.string().max(300).nullable().optional(),
  published: z.coerce.boolean().optional(),
  csrf_token: z.string().optional(),
});

export async function PATCH(request: Request) {
  const guardResult = await guard(request);
  if (!guardResult.ok) return guardResult.response;
  const { ip, actorId } = guardResult;

  const cookieStore = await cookies();
  const { body, csrfOk } = await readBody(request, cookieStore);
  if (!csrfOk) {
    logWarn("blog_update_csrf_failed", { ip });
    return NextResponse.json({ error: "csrf" }, { status: 403 });
  }

  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  const { id, ...update } = parsed.data;

  if (update.heroImageKey) {
    const head = await headR2Object(update.heroImageKey);
    if (!head) {
      return NextResponse.json({ error: "object-not-found" }, { status: 404 });
    }
  }

  try {
    const before = await getBlogPostById(id);
    const row = await updateBlogPost(id, update as Parameters<typeof updateBlogPost>[1]);
    if (!row) {
      return NextResponse.json({ error: "not-found" }, { status: 404 });
    }
    logInfo("blog_updated", { id, ip });
    await appendAuditLog({
      actorId,
      actorKind: actorId === BOOTSTRAP_ACTOR_ID ? "bootstrap" : "admin",
      action: "blog.updated",
      resourceType: "blog_post",
      resourceId: id,
      before: before ? { title: before.title, published: before.published, category: before.category } : null,
      after: { title: row.title, published: row.published, category: row.category },
      ip,
    });
    return NextResponse.json({ item: row });
  } catch (err) {
    logError("blog_update_failed", {
      id,
      error: (err instanceof Error ? err.message : String(err)).substring(0, 200),
    });
    return NextResponse.json({ error: "db" }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// DELETE /api/admin/blog — soft-delete the post (and its R2 hero image, if any).
// ---------------------------------------------------------------------------

const deleteSchema = z.object({
  id: z.coerce.number().int().positive(),
  csrf_token: z.string().optional(),
});

export async function DELETE(request: Request) {
  const guardResult = await guard(request);
  if (!guardResult.ok) return guardResult.response;
  const { ip, actorId } = guardResult;

  const cookieStore = await cookies();
  const { body, csrfOk } = await readBody(request, cookieStore);
  if (!csrfOk) {
    logWarn("blog_delete_csrf_failed", { ip });
    return NextResponse.json({ error: "csrf" }, { status: 403 });
  }

  const parsed = deleteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  const { id } = parsed.data;
  const row = await getBlogPostById(id);
  if (!row) {
    return NextResponse.json({ error: "not-found" }, { status: 404 });
  }

  if (row.heroImageKey) {
    const deleted = await deleteR2Object(row.heroImageKey);
    if (!deleted) {
      logWarn("blog_delete_r2_failed", { id, objectKey: row.heroImageKey });
    }
  }
  await softDeleteBlogPost(id);
  logInfo("blog_deleted", { id, slug: row.slug, ip });
  await appendAuditLog({
    actorId,
    actorKind: actorId === BOOTSTRAP_ACTOR_ID ? "bootstrap" : "admin",
    action: "blog.deleted",
    resourceType: "blog_post",
    resourceId: id,
    before: { slug: row.slug, title: row.title, published: row.published },
    ip,
  });
  return NextResponse.json({ ok: true });
}
