import { getPublishedBlogPosts } from "@/content/blog";
import { Container } from "@/components/shared/Container";
import { SectionHeader } from "@/components/shared/SectionHeader";
import { BlogCard } from "@/components/shared/BlogCard";
import { Button } from "@/components/ui/Button";

export function BlogTeaser() {
  const posts = getPublishedBlogPosts().slice(0, 3);

  if (posts.length === 0) return null;

  return (
    <section className="bg-surface py-16 md:py-24 lg:py-32">
      <Container>
        <SectionHeader
          eyebrow="From the Blog"
          title="Latest from the Blog"
          description="Updates, research and reflections from our health, education and humanitarian work."
        />

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
      </Container>
    </section>
  );
}
