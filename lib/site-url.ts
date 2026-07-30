export const DEFAULT_SITE_URL =
  "https://www.vantagefoundationuganda.com";

export const CANONICAL_SITE_URL = DEFAULT_SITE_URL;

export function resolveSiteUrl(value = process.env.NEXT_PUBLIC_SITE_URL) {
  if (!value) return DEFAULT_SITE_URL;

  try {
    const url = new URL(value.trim());
    const hasWebProtocol = url.protocol === "http:" || url.protocol === "https:";
    const hasValidHostname =
      url.hostname === "localhost" || url.hostname.includes(".");

    if (!hasWebProtocol || !hasValidHostname) return DEFAULT_SITE_URL;

    return url.origin;
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function toCanonicalUrl(path = "/"): string {
  return new URL(path, `${CANONICAL_SITE_URL}/`).toString();
}
