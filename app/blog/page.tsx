import type { Metadata } from "next";
import Link from "next/link";
import { Newspaper } from "lucide-react";
import { getPublishedBlogPosts } from "@/content/blog";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { BlogCard } from "@/components/shared/BlogCard";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Updates, research and reflections from Vantage Foundation Uganda's health, education and humanitarian programmes.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  const posts = getPublishedBlogPosts();

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
