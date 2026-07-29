import { Badge } from "@/components/ui/Badge";
import { Breadcrumbs } from "@/components/shared/Breadcrumbs";
import { formatContentDate } from "@/lib/content-date";

interface ArticleHeaderProps {
  title: string;
  category: string;
  summary: string;
  author?: string;
  publishedAt: string;
  readingTimeMinutes?: number;
}

export function ArticleHeader({
  title,
  category,
  summary,
  author,
  publishedAt,
  readingTimeMinutes,
}: ArticleHeaderProps) {
  return (
    <header>
      <Breadcrumbs
        truncateCurrent
        className="mb-6"
        items={[
          { label: "Home", href: "/" },
          { label: "Blog", href: "/blog" },
          { label: title },
        ]}
      />

      <Badge
        variant="accent"
        className="px-3 py-1 text-[0.6875rem] uppercase tracking-[0.08em]"
      >
        {category}
      </Badge>

      <h1 className="mt-4 max-w-[850px] text-balance text-[clamp(2.25rem,5.2vw,3.625rem)] font-bold leading-[1.07] tracking-[-0.035em] text-foreground">
        {title}
      </h1>

      <p className="mt-5 max-w-[800px] text-lg leading-relaxed text-muted-foreground sm:text-xl">
        {summary}
      </p>

      <div
        className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm font-medium text-muted-foreground"
        aria-label="Article details"
      >
        {author && <span>{author}</span>}
        {author && <span aria-hidden="true">·</span>}
        <time dateTime={publishedAt}>{formatContentDate(publishedAt)}</time>
        {readingTimeMinutes && (
          <>
            <span aria-hidden="true">·</span>
            <span>{readingTimeMinutes} min read</span>
          </>
        )}
      </div>
    </header>
  );
}
