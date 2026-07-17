import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

interface MarkdownProps {
  children: string;
  className?: string;
}

export function Markdown({ children, className }: MarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeSanitize]}
        components={{
          p({ children }) {
            return <p className="leading-relaxed text-muted-foreground">{children}</p>;
          },
          h2({ children }) {
            return (
              <h2 className="mt-8 text-2xl font-bold text-foreground first:mt-0">
                {children}
              </h2>
            );
          },
          h3({ children }) {
            return (
              <h3 className="mt-6 text-xl font-semibold text-foreground">{children}</h3>
            );
          },
          ul({ children }) {
            return <ul className="mt-4 list-disc space-y-2 pl-5">{children}</ul>;
          },
          li({ children }) {
            return <li className="text-muted-foreground">{children}</li>;
          },
          a({ href, children }) {
            return (
              <a href={href} className="font-medium text-primary hover:underline">
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
