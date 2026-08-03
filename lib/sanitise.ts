/**
 * Input sanitization helpers for user-submitted form data.
 *
 * Used before data is stored or sent via email to prevent injection attacks
 * (e.g. email header injection via CR/LF or other control characters).
 */

/**
 * Strips control characters (including CR, LF, tab, and the full 0x00–0x1f
 * range) and limits length to prevent email header injection and oversized
 * payloads. Returns an empty string for null/undefined input.
 */
export function sanitiseValue(value: unknown): string {
  if (value == null) return "";
  return String(value)
    .replace(/[\r\n\t]/g, " ") // strip line breaks and tabs
    .replace(/[\x00-\x1f]/g, " ") // strip remaining control chars (VT, FF, etc.)
    .substring(0, 1000); // limit length
}

/**
 * HTML-escapes a value for safe insertion into HTML email templates.
 * Prevents user-controlled content from injecting markup into the email
 * body (email clients strip scripts, but HTML injection can still mislead
 * recipients or break layout).
 */
export function escapeHtml(value: unknown): string {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
