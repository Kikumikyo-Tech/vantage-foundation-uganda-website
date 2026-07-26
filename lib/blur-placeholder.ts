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
  Buffer.from(
    '<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="#e2e8f0"/></svg>'
  ).toString("base64");
