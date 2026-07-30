import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ImageOrPlaceholder } from "./ImageOrPlaceholder";
import type { ImagePreset } from "@/lib/image-presets";

/**
 * Full-bleed photo with a translucent overlay and content on top — used for
 * the hero, core-area panels, the impact story, and the get-involved
 * section. Darkens/lightens with a gradient over the photo rather than
 * permanently editing the source image, so the real photograph is always
 * recoverable underneath.
 */
type OverlayVariant =
  | "dark" // even dark scrim — small text blocks over any photo
  | "dark-gradient" // fades in from the bottom — hero/panel captions
  | "light" // even white/soft-white scrim — light-on-photo panels
  | "none";

interface ImageWithOverlayProps {
  src?: string;
  alt: string;
  children?: ReactNode;
  overlay?: OverlayVariant;
  preset?: ImagePreset;
  preload?: boolean;
  className?: string;
  containerClassName?: string;
  contentClassName?: string;
}

const overlayClasses: Record<OverlayVariant, string> = {
  dark: "bg-black/50",
  "dark-gradient": "bg-gradient-to-t from-black/80 via-black/30 to-transparent",
  light: "bg-white/70",
  none: "",
};

export function ImageWithOverlay({
  src,
  alt,
  children,
  overlay = "dark-gradient",
  preset = "card",
  preload,
  className,
  containerClassName,
  contentClassName,
}: ImageWithOverlayProps) {
  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <ImageOrPlaceholder
        src={src}
        alt={alt}
        fill
        preload={preload}
        preset={preset}
        className={className}
        containerClassName="h-full w-full"
      />
      {overlay !== "none" && (
        <div className={cn("absolute inset-0", overlayClasses[overlay])} aria-hidden="true" />
      )}
      {children && (
        <div className={cn("relative", contentClassName)}>{children}</div>
      )}
    </div>
  );
}
