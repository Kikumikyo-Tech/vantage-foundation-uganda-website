import { createHmac, timingSafeEqual, randomBytes } from "crypto";

/**
 * Signed session token utilities for admin authentication.
 *
 * Instead of storing the raw ADMIN_SECRET in a cookie, we issue a signed
 * session token: a random session ID + an HMAC signature. The secret is
 * never exposed in the cookie value.
 *
 * Token format: `{sessionId}.{hmac}`
 * - sessionId: 32 random bytes, hex-encoded (64 chars)
 * - hmac: HMAC-SHA256 of sessionId using ADMIN_SECRET as key (64 chars)
 */

const SESSION_COOKIE_NAME = "vantage_admin";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24; // 1 day

function getSecret(): string {
  const secret = process.env.ADMIN_SECRET;
  if (!secret) {
    throw new Error("ADMIN_SECRET is not configured");
  }
  return secret;
}

/**
 * Creates a signed session token.
 * Returns `{ token, maxAge }` for setting as a cookie.
 */
export function createSessionToken(): { token: string; maxAge: number } {
  const secret = getSecret();
  const sessionId = randomBytes(32).toString("hex");
  const hmac = createHmac("sha256", secret).update(sessionId).digest("hex");
  return {
    token: `${sessionId}.${hmac}`,
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}

/**
 * Verifies a signed session token.
 * Returns true if the token is valid (correct format + valid HMAC).
 */
export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false;

  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [sessionId, signature] = parts;

  // Validate format to prevent injection.
  if (!/^[a-f0-9]{64}$/.test(sessionId) || !/^[a-f0-9]{64}$/.test(signature)) {
    return false;
  }

  try {
    const secret = getSecret();
    const expectedHmac = createHmac("sha256", secret).update(sessionId).digest("hex");

    // Timing-safe comparison to prevent timing attacks.
    const a = Buffer.from(signature, "hex");
    const b = Buffer.from(expectedHmac, "hex");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export const sessionCookieName = SESSION_COOKIE_NAME;
export const sessionMaxAge = SESSION_MAX_AGE_SECONDS;
