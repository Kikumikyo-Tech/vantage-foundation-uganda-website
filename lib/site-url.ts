export const CANONICAL_SITE_URL = "https://www.vantagefoundationuganda.com";

export function toCanonicalUrl(path = "/"): string {
  return new URL(path, `${CANONICAL_SITE_URL}/`).toString();
}
