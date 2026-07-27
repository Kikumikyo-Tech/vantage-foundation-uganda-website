import { neon } from "@neondatabase/serverless";

/**
 * Database queries for the `blog_posts` table.
 *
 * Mirrors the conventions of lib/db/media.ts: a single getSql() helper,
 * plain async functions, and a row mapper that converts snake_case columns
 * to camelCase fields. Soft-deleted rows (deleted_at IS NOT NULL) are
 * excluded from list/get queries but retained for audit.
 */

export type BlogConsent = "none" | "verified" | "pending" | "group-consent";

export type BlogCategory =
  | "Health"
  | "Education"
  | "Humanitarian Action"
  | "Community Stories"
  | "Foundation News"
  | "Research & Learning"
  | "Accountability";

export interface BlogPostInput {
  slug: string;
  title: string;
  category: BlogCategory;
  summary: string;
  body: string;
  author?: string;
  /** ISO date string (YYYY-MM-DD). Defaults to today if omitted. */
  publishedAt?: string;
  readingTimeMinutes?: number;
  /** R2 object key (vantage/blog/...), not a signed URL. */
  heroImageKey?: string;
  heroImageAlt?: string;
  consentClassification?: BlogConsent;
  seoTitle?: string;
  seoDescription?: string;
  published?: boolean;
}

export interface BlogPostRow
  extends Required<
    Omit<
      BlogPostInput,
      | "author"
      | "readingTimeMinutes"
      | "heroImageKey"
      | "heroImageAlt"
      | "seoTitle"
      | "seoDescription"
    >
  > {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  author: string | null;
  readingTimeMinutes: number | null;
  heroImageKey: string | null;
  heroImageAlt: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  deletedAt: Date | null;
}

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not configured");
  }
  return neon(url);
}

/** Inserts a new blog_posts row. Defaults to an unpublished draft. */
export async function createBlogPost(input: BlogPostInput): Promise<BlogPostRow> {
  const sql = getSql();
  const rows = await sql`
    INSERT INTO blog_posts (
      slug, title, category, summary, body, author, published_at,
      reading_time_minutes, hero_image_key, hero_image_alt,
      consent_classification, seo_title, seo_description, published
    ) VALUES (
      ${input.slug}, ${input.title}, ${input.category}, ${input.summary},
      ${input.body}, ${input.author ?? null},
      ${input.publishedAt ?? new Date().toISOString().slice(0, 10)},
      ${input.readingTimeMinutes ?? null}, ${input.heroImageKey ?? null},
      ${input.heroImageAlt ?? null}, ${input.consentClassification ?? "none"},
      ${input.seoTitle ?? null}, ${input.seoDescription ?? null},
      ${input.published ?? false}
    )
    RETURNING *
  `;
  return mapRow(rows[0]);
}

/**
 * Returns all non-deleted posts, newest published-date first. Optional
 * filters by category or published state.
 */
export async function getBlogPosts(options?: {
  category?: string;
  published?: boolean;
}): Promise<BlogPostRow[]> {
  const sql = getSql();
  const category = options?.category;
  const published = options?.published;

  if (published === true && category) {
    const rows = await sql`
      SELECT * FROM blog_posts
      WHERE deleted_at IS NULL AND published = true AND category = ${category}
      ORDER BY published_at DESC
    `;
    return rows.map(mapRow);
  }
  if (published === true) {
    const rows = await sql`
      SELECT * FROM blog_posts
      WHERE deleted_at IS NULL AND published = true
      ORDER BY published_at DESC
    `;
    return rows.map(mapRow);
  }
  if (category) {
    const rows = await sql`
      SELECT * FROM blog_posts
      WHERE deleted_at IS NULL AND category = ${category}
      ORDER BY published_at DESC
    `;
    return rows.map(mapRow);
  }
  const rows = await sql`
    SELECT * FROM blog_posts
    WHERE deleted_at IS NULL
    ORDER BY published_at DESC
  `;
  return rows.map(mapRow);
}

/** Returns a single non-deleted post by id, or null if not found. */
export async function getBlogPostById(id: number): Promise<BlogPostRow | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM blog_posts WHERE id = ${id} AND deleted_at IS NULL
  `;
  if (rows.length === 0) return null;
  return mapRow(rows[0]);
}

/** Returns a single non-deleted post by slug, or null if not found. */
export async function getBlogPostBySlug(slug: string): Promise<BlogPostRow | null> {
  const sql = getSql();
  const rows = await sql`
    SELECT * FROM blog_posts WHERE slug = ${slug} AND deleted_at IS NULL
  `;
  if (rows.length === 0) return null;
  return mapRow(rows[0]);
}

export interface BlogPostUpdate {
  title?: string;
  category?: BlogCategory;
  summary?: string;
  body?: string;
  author?: string | null;
  publishedAt?: string;
  readingTimeMinutes?: number | null;
  heroImageKey?: string | null;
  heroImageAlt?: string | null;
  consentClassification?: BlogConsent;
  seoTitle?: string | null;
  seoDescription?: string | null;
  published?: boolean;
}

/**
 * Updates editable fields on a blog post. Only the supplied fields are
 * written; omitted fields are left untouched. Returns the updated row, or
 * null if the id was not found or was soft-deleted.
 *
 * Implementation: fetch the current row, merge the supplied update fields,
 * then write all updatable fields back in a single UPDATE — avoids dynamic
 * SQL construction (see lib/db/media.ts for the same pattern).
 */
export async function updateBlogPost(
  id: number,
  update: BlogPostUpdate
): Promise<BlogPostRow | null> {
  const current = await getBlogPostById(id);
  if (!current) return null;

  const sql = getSql();
  const next = {
    title: update.title ?? current.title,
    category: update.category ?? current.category,
    summary: update.summary ?? current.summary,
    body: update.body ?? current.body,
    author: update.author === undefined ? current.author : update.author,
    publishedAt: update.publishedAt ?? current.publishedAt,
    readingTimeMinutes:
      update.readingTimeMinutes === undefined
        ? current.readingTimeMinutes
        : update.readingTimeMinutes,
    heroImageKey:
      update.heroImageKey === undefined ? current.heroImageKey : update.heroImageKey,
    heroImageAlt:
      update.heroImageAlt === undefined ? current.heroImageAlt : update.heroImageAlt,
    consentClassification: update.consentClassification ?? current.consentClassification,
    seoTitle: update.seoTitle === undefined ? current.seoTitle : update.seoTitle,
    seoDescription:
      update.seoDescription === undefined ? current.seoDescription : update.seoDescription,
    published: update.published ?? current.published,
  };

  const rows = await sql`
    UPDATE blog_posts SET
      title = ${next.title},
      category = ${next.category},
      summary = ${next.summary},
      body = ${next.body},
      author = ${next.author},
      published_at = ${next.publishedAt},
      reading_time_minutes = ${next.readingTimeMinutes},
      hero_image_key = ${next.heroImageKey},
      hero_image_alt = ${next.heroImageAlt},
      consent_classification = ${next.consentClassification},
      seo_title = ${next.seoTitle},
      seo_description = ${next.seoDescription},
      published = ${next.published},
      updated_at = CURRENT_TIMESTAMP
    WHERE id = ${id} AND deleted_at IS NULL
    RETURNING *
  `;
  if (rows.length === 0) return null;
  return mapRow(rows[0]);
}

/** Soft-deletes a blog post by setting deleted_at. */
export async function softDeleteBlogPost(id: number): Promise<void> {
  const sql = getSql();
  await sql`
    UPDATE blog_posts SET deleted_at = CURRENT_TIMESTAMP
    WHERE id = ${id} AND deleted_at IS NULL
  `;
}

function mapRow(row: Record<string, unknown>): BlogPostRow {
  const publishedAt = row.published_at as Date | string;
  return {
    id: row.id as number,
    createdAt: row.created_at as Date,
    updatedAt: row.updated_at as Date,
    slug: row.slug as string,
    title: row.title as string,
    category: row.category as BlogCategory,
    summary: row.summary as string,
    body: row.body as string,
    author: (row.author as string | null) ?? null,
    publishedAt:
      publishedAt instanceof Date ? publishedAt.toISOString().slice(0, 10) : String(publishedAt),
    readingTimeMinutes: (row.reading_time_minutes as number | null) ?? null,
    heroImageKey: (row.hero_image_key as string | null) ?? null,
    heroImageAlt: (row.hero_image_alt as string | null) ?? null,
    consentClassification: row.consent_classification as BlogConsent,
    seoTitle: (row.seo_title as string | null) ?? null,
    seoDescription: (row.seo_description as string | null) ?? null,
    published: (row.published as boolean) ?? false,
    deletedAt: row.deleted_at ? (row.deleted_at as Date) : null,
  };
}
