import { cn } from "@/lib/utils";

type PatternVariant = "dots" | "waves" | "grid" | "topographic";

interface BrandPatternProps {
  variant?: PatternVariant;
  className?: string;
  color?: string;
  opacity?: number;
}

const patterns: Record<PatternVariant, string> = {
  dots: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='currentColor'/%3E%3C/svg%3E")`,
  waves: `url("data:image/svg+xml,%3Csvg width='60' height='20' viewBox='0 0 60 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 10 Q15 0 30 10 T60 10' stroke='currentColor' fill='none' stroke-width='1'/%3E%3C/svg%3E")`,
  grid: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v40' stroke='currentColor' fill='none' stroke-width='0.5'/%3E%3C/svg%3E")`,
  topographic: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='currentColor' stroke-width='0.6'%3E%3Cpath d='M0 40 Q20 20 40 40 T80 40'/%3E%3Cpath d='M0 50 Q20 30 40 50 T80 50'/%3E%3Cpath d='M0 30 Q20 10 40 30 T80 30'/%3E%3Cpath d='M0 60 Q20 40 40 60 T80 60'/%3E%3C/g%3E%3C/svg%3E")`,
};

export function BrandPattern({
  variant = "topographic",
  className,
  color = "var(--deep-teal)",
  opacity = 0.06,
}: BrandPatternProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("pointer-events-none absolute inset-0", className)}
      style={{
        backgroundImage: patterns[variant],
        backgroundSize: variant === "dots" ? "20px 20px" : variant === "waves" ? "60px 20px" : variant === "grid" ? "40px 40px" : "80px 80px",
        color,
        opacity,
      }}
    />
  );
}
