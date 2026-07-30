import { cn } from "@/lib/utils";

export function Card({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-all hover:shadow-lg hover:-translate-y-0.5",
        className
      )}
      {...props}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary via-deep-teal to-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100" aria-hidden="true" />
      {children}
    </div>
  );
}