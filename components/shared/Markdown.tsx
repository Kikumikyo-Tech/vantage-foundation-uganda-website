import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownProps {
  children: string;
  className?: string;
  variant?: "default" | "article";
  pullQuoteAttribution?: string;
}

export function Markdown({
  children,
  className,
  variant = "default",
  pullQuoteAttribution,
}: MarkdownProps) {
  const isArticle = variant === "article";

  return (
    <div
      className={[
        isArticle
          ? "article-prose text-[1.0625rem] leading-[1.75] text-slate-700 sm:text-lg md:text-[1.1875rem]"
          : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          p({ children }) {
            return (
              <p
                className={
                  isArticle
                    ? "mb-[1.25em] last:mb-0"
                    : "leading-relaxed text-muted-foreground"
                }
              >
                {children}
              </p>
            );
          },
          h2({ children }) {
            return (
              <h2
                className={
                  isArticle
                    ? "mb-5 mt-12 text-[1.625rem] font-bold leading-[1.2] tracking-[-0.015em] text-foreground first:mt-0 sm:text-[1.75rem] md:mt-16 md:text-[2rem]"
                    : "mt-8 text-2xl font-bold text-foreground first:mt-0"
                }
              >
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3
                className={
                  isArticle
                    ? "mb-4 mt-10 text-[1.375rem] font-semibold leading-[1.3] text-foreground md:text-2xl"
                    : "mt-6 text-xl font-semibold text-foreground"
                }
              >
                {children}
              </h3>
            );
          },
          ul({ children }) {
            return (
              <ul
                className={
                  isArticle
                    ? "mb-[1.25em] list-disc space-y-2 pl-6"
                    : "mt-4 list-disc space-y-2 pl-5"
                }
              >
                {children}
              </ul>
            );
          },
          ol({ children }) {
            return (
              <ol
                className={
                  isArticle
                    ? "mb-[1.25em] list-decimal space-y-2 pl-6"
                    : "mt-4 list-decimal space-y-2 pl-5"
                }
              >
                {children}
              </ol>
            );
          },
          li({ children }) {
            return (
              <li className={isArticle ? "" : "text-muted-foreground"}>
                {children}
              </li>
            );
          },
          blockquote({ children }) {
            return (
              <blockquote
                className={
                  isArticle
                    ? "my-10 rounded-2xl border-l-4 border-primary bg-primary-light/70 px-6 py-7 text-[1.25rem] font-medium leading-[1.55] text-foreground [&_p]:mb-0 sm:my-12 sm:px-8 sm:py-8 sm:text-[1.5rem] md:text-[1.625rem]"
                    : "my-6 border-l-4 border-primary pl-5 italic text-muted-foreground"
                }
              >
                {children}
                {isArticle && pullQuoteAttribution && (
                  <cite className="mt-5 block text-sm font-semibold not-italic tracking-normal text-primary sm:text-base">
                    {pullQuoteAttribution}
                  </cite>
                )}
              </blockquote>
            );
          },
          a({ href, children }) {
            return (
              <a
                href={href}
                className="rounded-sm font-medium text-primary underline decoration-primary/40 underline-offset-4 hover:decoration-primary"
              >
                {children}
              </a>
            );
          },
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
