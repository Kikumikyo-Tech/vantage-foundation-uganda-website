import Link from "next/link";
import { BlogPost } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ImageOrPlaceholder } from "./ImageOrPlaceholder";
import { formatContentDate } from "@/lib/content-date";

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden">
        <ImageOrPlaceholder
          src={post.heroImage}
          alt={post.heroImageAlt ?? post.title}
          fill
          containerClassName="h-full w-full"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <Badge variant="accent">{post.category}</Badge>
        <h3 className="mt-3 text-lg font-semibold leading-snug">
          <Link href={`/blog/${post.slug}`} className="hover:text-primary">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
          {post.summary}
        </p>
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <time dateTime={post.publishedAt}>
            {formatContentDate(post.publishedAt)}
          </time>
          {post.readingTimeMinutes && <span>{post.readingTimeMinutes} min read</span>}
        </div>
        <Link
          href={`/blog/${post.slug}`}
          className="mt-4 inline-flex text-sm font-semibold text-primary hover:underline"
        >
          Read More
        </Link>
      </div>
    </Card>
  );
}
