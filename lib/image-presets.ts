/**
 * Image size presets for the Vantage Foundation Uganda website.
 *
 * These presets define the `sizes` attribute for next/image based on the
 * layout context. The `sizes` attribute tells the browser what width the
 * image will be displayed at different breakpoints, so it can choose the
 * optimal source from the srcset.
 *
 * @see https://nextjs.org/docs/app/api-reference/components/image#sizes
 */

export const imagePresets = {
  /** Hero images: full-width on mobile, full-width on desktop. */
  hero: "(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px",

  /** Detail page hero: full-width on all breakpoints. */
  detailHero: "(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 1200px",

  /** Card grids (3 columns on desktop, 2 on tablet, 1 on mobile). */
  card: "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",

  /** Two-column layouts (about teaser, partners). */
  half: "(max-width: 768px) 100vw, 50vw",

  /** Team member photos (smaller, in a grid). */
  team: "(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw",

  /** Full-width banner/CTA images. */
  banner: "100vw",
} as const;

export type ImagePreset = keyof typeof imagePresets;

/**
 * Default preset used when no sizes prop is provided.
 * Falls back to the card preset (most common use case).
 */
export const DEFAULT_IMAGE_PRESET: ImagePreset = "card";
