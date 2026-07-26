/**
 * Generates a tiny base64 blur data URL for use as a next/image placeholder.
 *
 * This creates a 1x1 pixel SVG with a light gray fill, encoded as a data URL.
 * While not a true blur of the actual image, it provides a smooth loading
 * experience without requiring per-image blur data generation at build time.
 *
 * For true per-image blur placeholders, use `placeholder="blur"` with
 * statically imported images (next/image generates blur data automatically).
 *
 * @see https://nextjs.org/docs/app/api-reference/components/image#placeholder
 */
export const BLUR_DATA_URL =
  "data:image/svg+xml;base64," +
  "PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxIiBoZWlnaHQ9IjEiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEiIGZpbGw9IiNlMmU4ZjAiLz48L3N2Zz4=";
