import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ArticleContainerWidth = "page" | "wide" | "reading";

const widthClasses: Record<ArticleContainerWidth, string> = {
  page: "max-w-[1200px]",
  wide: "max-w-[1040px]",
  reading: "max-w-[760px]",
};

interface ArticleContainerProps {
  children: ReactNode;
  width?: ArticleContainerWidth;
  className?: string;
}

export function ArticleContainer({
  children,
  width = "page",
  className,
}: ArticleContainerProps) {
  return (
    <div className="w-full px-5 sm:px-6 lg:px-8">
      <div className={cn("mx-auto w-full", widthClasses[width], className)}>
        {children}
      </div>
    </div>
  );
}
