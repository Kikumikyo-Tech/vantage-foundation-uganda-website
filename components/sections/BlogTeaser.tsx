import { Newspaper } from "lucide-react";
import { getPublishedBlogPosts } from "@/content/blog";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { BlogCard } from "@/components/shared/BlogCard";
import { Button } from "@/components/ui/Button";

export function BlogTeaser() {
  const posts = getPublishedBlogPosts().slice(0, 3);

  return (
    <section className="bg-surface py-16 md:py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="From the Blog"
          title="Latest from the Blog"
          description="Updates, research and reflections from our health, education and humanitarian work."
        />

        {posts.length > 0 ? (
          <>
            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button href="/blog" variant="outline">
                Visit the Blog
              </Button>
            </div>
          </>
        ) : (
          <div className="mx-auto mt-12 max-w-md text-center">
            <Newspaper className="mx-auto h-8 w-8 text-muted-foreground" aria-hidden="true" />
            <p className="mt-3 text-muted-foreground">
              Our first posts are on the way.
            </p>
            <Button href="/blog" variant="outline" className="mt-6">
              Visit the Blog
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
