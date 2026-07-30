import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { getPublishedBlogPosts } from "@/content/blog";
import { getPublishedDbBlogPosts } from "@/lib/blog-public";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { BlogCard } from "@/components/shared/BlogCard";
import { createPublicMetadata } from "@/lib/metadata";

export const metadata: Metadata = createPublicMetadata({
  title: "Blog",
  description:
    "Updates, research and reflections from Vantage Foundation Uganda's health, education and humanitarian programmes.",
  path: "/blog",
});

// Lets an admin publish a post via /admin/blog without a code deploy —
// refreshes periodically well within the presigned hero-image URL TTL.
export const revalidate = 3600;

export default async function BlogPage() {
  const dbPosts = await getPublishedDbBlogPosts();
  const posts = [...dbPosts, ...getPublishedBlogPosts()].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1
  );

  return (
    <>
      <section className="bg-primary py-16 text-white md:py-24">
        <Container>
          <SectionHeader
            level="h1"
            title="Blog"
            description="Updates, research and reflections from our health, education and humanitarian work."
            light
          />
        </Container>
      </section>

      <section className="py-16 md:py-24">
        <Container>
          {posts.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          ) : (
            <div className="mx-auto max-w-md py-16 text-center">
              <Newspaper className="mx-auto h-10 w-10 text-muted-foreground" aria-hidden="true" />
              <h2 className="mt-4 text-xl font-semibold">
                Our first posts are on the way
              </h2>
              <p className="mt-2 text-muted-foreground">
                We&rsquo;re preparing updates, research and reflections from
                our programmes. Check back soon, or read our{" "}
                <Link href="/stories" className="text-primary hover:underline">
                  community stories
                </Link>{" "}
                in the meantime.
              </p>
            </div>
          )}
        </Container>
      </section>
    </>
  );
}
