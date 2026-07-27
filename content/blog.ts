import { BlogPost } from "@/types";

// No posts have been written yet. Do not add placeholder/fabricated
// articles here — /blog ships with an honest "coming soon" empty state
// until real posts exist. Add real entries as drafts (published: false)
// for editorial review before flipping them to published: true.
export const blogPosts: BlogPost[] = [];

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getBlogSlugs(): string[] {
  return getPublishedBlogPosts().map((p) => p.slug);
}

/**
 * Returns published posts, newest first. In development, unpublished
 * drafts are included too so they can be previewed.
 */
export function getPublishedBlogPosts(): BlogPost[] {
  const isDev = process.env.NODE_ENV === "development";
  return blogPosts
    .filter((p) => isDev || p.published !== false)
    .sort((a, b) => (a.publishedAt < b.publishedAt ? 1 : -1));
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  return getPublishedBlogPosts().filter((p) => p.category === category);
}
