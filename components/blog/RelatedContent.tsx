import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { BlogPost } from "@/types";
import { BlogCard } from "@/components/shared/BlogCard";
import { ArticleContainer } from "./ArticleContainer";

interface RelatedContentProps {
  posts: BlogPost[];
}

export function RelatedContent({ posts }: RelatedContentProps) {
  if (posts.length === 0) {
    return (
      <ArticleContainer width="reading" className="mt-10">
        <nav aria-label="More Vantage stories">
          <Link
            href="/stories"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
          >
            View all stories
            <ArrowRight aria-hidden="true" size={18} />
          </Link>
        </nav>
      </ArticleContainer>
    );
  }

  return (
    <ArticleContainer width="page" className="mt-16">
      <section aria-labelledby="related-posts-heading">
        <h2
          id="related-posts-heading"
          className="text-2xl font-bold tracking-tight text-foreground md:text-3xl"
        >
          Related posts
        </h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.slice(0, 3).map((post) => (
            <BlogCard key={post.slug} post={post} />
          ))}
        </div>
      </section>
    </ArticleContainer>
  );
}
