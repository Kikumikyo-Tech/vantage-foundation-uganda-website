import Image from "next/image";
import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageOrPlaceholderProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
}

export function ImageOrPlaceholder({
  src,
  alt,
  width,
  height,
  fill,
  className,
  containerClassName,
  priority,
}: ImageOrPlaceholderProps) {
  const isPlaceholder = !src || src.includes("placeholder");

  if (isPlaceholder) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-slate-100 text-slate-400",
          containerClassName
        )}
      >
        <div className="text-center">
          <ImageIcon className="mx-auto h-8 w-8" aria-hidden="true" />
          <span className="mt-1 block text-xs">Image coming soon</span>
        </div>
      </div>
    );
  }

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority={priority}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width || 800}
      height={height || 600}
      className={cn("object-cover", className)}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={priority}
    />
  );
}
