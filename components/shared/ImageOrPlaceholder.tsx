import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  imagePresets,
  DEFAULT_IMAGE_PRESET,
  type ImagePreset,
} from "@/lib/image-presets";
import { BLUR_DATA_URL } from "@/lib/blur-placeholder";

interface ImageOrPlaceholderProps {
  src?: string;
  alt: string;
  width?: number;
  height?: number;
  fill?: boolean;
  className?: string;
  containerClassName?: string;
  preload?: boolean;
  /**
   * Image size preset for the `sizes` attribute.
   * Controls which source the browser picks from the srcset at different
   * breakpoints. Defaults to "card" (3-column grid).
   */
  preset?: ImagePreset;
  /**
   * Custom sizes string. Overrides `preset` if provided.
   * Use this for one-off layouts that don't match any preset.
   */
  sizes?: string;
  /**
   * Focal point for object-position (e.g. "center top", "left center").
   * Defaults to "center".
   */
  objectPosition?: string;
  /** Priority loading for above-the-fold images (maps to next/image priority). */
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
  preload,
  preset = DEFAULT_IMAGE_PRESET,
  sizes,
  objectPosition,
  priority,
}: ImageOrPlaceholderProps) {
  // Missing media renders a quiet neutral surface instead of making a
  // publication claim or requesting a resource that does not exist.
  const isPlaceholder = !src || src.includes("placeholder");

  if (isPlaceholder) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-surface-strong",
          containerClassName
        )}
        aria-hidden="true"
      />
    );
  }

  const resolvedSizes = sizes || imagePresets[preset];
  const objectPositionStyle = objectPosition
    ? { objectPosition }
    : undefined;

  if (fill) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        className={cn("object-cover", className)}
        style={objectPositionStyle}
        sizes={resolvedSizes}
        preload={preload}
        priority={priority}
        placeholder="blur"
        blurDataURL={BLUR_DATA_URL}
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
      style={objectPositionStyle}
      sizes={resolvedSizes}
      preload={preload}
      priority={priority}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
    />
  );
}
