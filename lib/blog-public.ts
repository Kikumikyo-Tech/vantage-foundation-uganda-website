import "server-only";

import {
  getBlogPosts,
  getBlogPostBySlug as getDbRowBySlug,
  type BlogPostRow,
} from "@/lib/db/blog";
import { createPresignedGetUrl } from "@/lib/storage/r2-client";
import type { BlogPost } from "@/types";

/**
 * Resolves published /admin/blog posts into the same BlogPost shape
 * content/blog.ts uses, so /blog and /blog/[slug] can merge admin-written
 * posts with that (normally empty) static manifest without knowing the
 * difference.
 *
 * Fails soft (empty list/null) if the database or R2 aren't reachable or
 * configured — this is supplementary content, not a hard dependency.
 *
 * TTL note: callers must set `export const revalidate = 3600;` (a literal —
 * see lib/media-public.ts for why) so the page refreshes well within the
 * 24h presigned URL TTL below.
 */
const PUBLIC_URL_TTL_SECONDS = 24 * 60 * 60; // 24 hours

async function toBlogPost(row: BlogPostRow): Promise<BlogPost> {
  const heroImage = row.heroImageKey
    ? await createPresignedGetUrl({
        objectKey: row.heroImageKey,
        ttlSeconds: PUBLIC_URL_TTL_SECONDS,
      })
    : undefined;

  return {
    id: `db-${row.id}`,
    slug: row.slug,
    title: row.title,
    category: row.category,
    summary: row.summary,
    body: row.body,
    author: row.author ?? undefined,
    publishedAt: row.publishedAt,
    readingTimeMinutes: row.readingTimeMinutes ?? undefined,
    heroImage,
    heroImageAlt: row.heroImageAlt ?? undefined,
    consentClassification: row.consentClassification,
    seo:
      row.seoTitle || row.seoDescription
        ? { title: row.seoTitle ?? undefined, description: row.seoDescription ?? undefined }
        : undefined,
    published: row.published,
  };
}

/** Published posts from /admin/blog, newest first. */
export async function getPublishedDbBlogPosts(): Promise<BlogPost[]> {
  try {
    const rows = await getBlogPosts({ published: true });
    return await Promise.all(rows.map(toBlogPost));
  } catch {
    return [];
  }
}

/** A single published post by slug, or null if not found/unreachable. */
export async function getDbBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const row = await getDbRowBySlug(slug);
    if (!row || !row.published) return null;
    return await toBlogPost(row);
  } catch {
    return null;
  }
}

/** Slugs of all published posts, for generateStaticParams/sitemap. */
export async function getDbBlogSlugs(): Promise<string[]> {
  try {
    const rows = await getBlogPosts({ published: true });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
}
