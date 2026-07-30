import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Vantage Foundation Uganda logo component.
 *
 * Supports three lockup variants (primary/stacked, horizontal, symbol-only)
 * and light/dark background themes. Uses true vector SVG assets.
 *
 * SVGs are always served with `unoptimized` to bypass the Next.js image
 * optimizer (`/_next/image?…svg`). The optimizer can fail or produce
 * unexpected results for SVGs — serving them directly from /public is
 * reliable, faster, and preserves vector fidelity.
 *
 * Variant + theme selects the correct file:
 *   - primary / light  → vantage-logo-primary.svg (full colour on white)
 *   - primary / dark   → vantage-logo-primary-dark.svg (full colour on dark)
 *   - horizontal / light → vantage-logo-horizontal.svg
 *   - horizontal / dark  → vantage-logo-horizontal-light.svg (for dark bg)
 *   - symbol            → vantage-symbol.svg (theme-independent)
 *
 * See docs/brand/logo-guidelines.md for usage rules, clear-space, and misuse.
 */

type LogoVariant = "primary" | "horizontal" | "symbol";
type LogoTheme = "light" | "dark";

const logoSrc: Record<LogoVariant, Record<LogoTheme, string>> = {
  primary: {
    light: "/brand/logos/vantage-logo-primary.svg",
    dark: "/brand/logos/vantage-logo-primary-dark.svg",
  },
  horizontal: {
    light: "/brand/logos/vantage-logo-horizontal.svg",
    dark: "/brand/logos/vantage-logo-horizontal-light.svg",
  },
  symbol: {
    light: "/brand/logos/vantage-symbol.svg",
    dark: "/brand/logos/vantage-symbol.svg",
  },
};

// Intrinsic dimensions from the SVG viewBoxes (for aspect-ratio preservation).
const logoDims: Record<LogoVariant, { w: number; h: number }> = {
  primary: { w: 1448, h: 1086 },
  horizontal: { w: 1721, h: 914 },
  symbol: { w: 1000, h: 1000 },
};

export interface LogoProps {
  variant?: LogoVariant;
  theme?: LogoTheme;
  /** Render height in pixels. Width scales to preserve aspect ratio. */
  height?: number;
  /** Wrap the logo in a link to the homepage. */
  href?: string;
  /** Alt text. Defaults to the organisation name. */
  alt?: string;
  className?: string;
  /** Skip the next/image wrapper (used by OG image generation which needs a plain img). */
  unoptimized?: boolean;
}

const orgName = "Vantage Foundation Uganda";

export function Logo({
  variant = "horizontal",
  theme = "light",
  height = 40,
  href,
  alt = orgName,
  className,
  unoptimized = false,
}: LogoProps) {
  const dims = logoDims[variant];
  const width = Math.round((dims.w / dims.h) * height);
  const src = logoSrc[variant][theme];

  const img = unoptimized ? (
    // Plain <img> for contexts where next/image is unavailable (e.g. OG gen).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      height={height}
      width={width}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        aspectRatio: `${dims.w} / ${dims.h}`,
      }}
      className={cn("block max-w-none shrink-0", className)}
    />
  ) : (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      preload={variant === "horizontal" && href === "/"}
      unoptimized
      style={{
        width: `${width}px`,
        height: `${height}px`,
        aspectRatio: `${dims.w} / ${dims.h}`,
      }}
      className={cn("block max-w-none shrink-0", className)}
    />
  );

  const content = (
    <>
      {img}
      <span className="sr-only">{orgName}</span>
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        aria-label={alt}
        className="inline-flex shrink-0 items-center"
      >
        {content}
      </Link>
    );
  }

  return content;
}

export { orgName as LOGO_ORG_NAME };
