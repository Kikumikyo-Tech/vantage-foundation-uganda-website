import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "outline" | "accent" | "success" | "warning" | "destructive";
  className?: string;
}

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold",
        variant === "default" && "bg-primary/10 text-primary",
        variant === "outline" && "border border-current text-foreground",
        variant === "accent" && "bg-accent/10 text-accent",
        variant === "success" && "bg-success-bg text-success-fg",
        variant === "warning" && "bg-warning-bg text-warning-fg",
        variant === "destructive" && "bg-destructive-bg text-destructive-fg",
        className
      )}
    >
      {children}
    </span>
  );
}
