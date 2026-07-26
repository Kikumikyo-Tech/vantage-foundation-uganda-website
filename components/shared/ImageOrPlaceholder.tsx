import Image from "next/image";
import { ImageIcon } from "lucide-react";
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
  priority?: boolean;
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
  preset = DEFAULT_IMAGE_PRESET,
  sizes,
  objectPosition,
}: ImageOrPlaceholderProps) {
  // Placeholder convention: any src whose filename contains "placeholder"
  // renders the "Image coming soon" fallback instead of a real <Image>.
  // This avoids HTTP 400s from next/image when a file does not exist yet.
  // Real images must use filenames that do NOT contain "placeholder".
  const isPlaceholder = !src || src.includes("placeholder");

  if (isPlaceholder) {
    return (
      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden bg-slate-100 text-slate-500",
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
      priority={priority}
      placeholder="blur"
      blurDataURL={BLUR_DATA_URL}
    />
  );
}
