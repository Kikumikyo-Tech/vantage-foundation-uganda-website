// In-memory sliding-window rate limiter.
//
// Suitable for a small site running on a single instance or a few serverless
// instances. Each instance keeps its own window, so the effective limit is
// multiplied by the number of warm instances. For stricter cross-instance
// limits, upgrade to Upstash Redis or Vercel KV in the future.
//
// Usage:
//   const ok = rateLimit({ key: `login:${ip}`, limit: 5, windowMs: 60_000 });
//   if (!ok) return new Response("Too many requests", { status: 429 });

const buckets = new Map<string, number[]>();

// Prune expired buckets periodically to avoid unbounded memory growth.
// Called opportunistically on every rateLimit() invocation.
const PRUNE_INTERVAL_MS = 60_000;
let lastPrune = Date.now();

function prune(now: number) {
  if (now - lastPrune < PRUNE_INTERVAL_MS) return;
  lastPrune = now;
  for (const [key, timestamps] of buckets) {
    // Keep only timestamps from the last hour (upper bound on any window).
    const cutoff = now - 3_600_000;
    const recent = timestamps.filter((t) => t > cutoff);
    if (recent.length === 0) {
      buckets.delete(key);
    } else if (recent.length !== timestamps.length) {
      buckets.set(key, recent);
    }
  }
}

interface RateLimitOptions {
  /** Unique key identifying the rate-limit bucket (e.g. `login:${ip}`). */
  key: string;
  /** Maximum number of requests allowed within the window. */
  limit: number;
  /** Sliding window duration in milliseconds. */
  windowMs: number;
}

/**
 * Returns `true` if the request is within the limit, `false` if it exceeds it.
 * Each call records a timestamp in the bucket.
 */
export function rateLimit({ key, limit, windowMs }: RateLimitOptions): boolean {
  const now = Date.now();
  prune(now);

  const cutoff = now - windowMs;
  const timestamps = (buckets.get(key) ?? []).filter((t) => t > cutoff);

  if (timestamps.length >= limit) {
    buckets.set(key, timestamps);
    return false;
  }

  timestamps.push(now);
  buckets.set(key, timestamps);
  return true;
}

/**
 * Extracts the client IP from standard proxy headers.
 * Returns "unknown" if no IP can be determined.
 *
 * Trust order (most-trusted first):
 *   1. `x-vercel-forwarded-for` — set by Vercel's edge with the real client IP.
 *      Preferred on Vercel deployments and harder to forge than the standard
 *      XFF header.
 *   2. `x-forwarded-for` — take the RIGHTMOST entry (added by the closest
 *      trusted proxy). The leftmost entry is the easiest to forge, so trusting
 *      it lets an attacker rotate arbitrary IPs to bypass rate limiting if the
 *      app is ever reached without a proxy that overwrites this header.
 *   3. `x-real-ip` — fallback for some hosting providers.
 *
 * Note: this assumes a single trusted proxy hop in front of the app. If the app
 * is ever deployed behind multiple chained proxies, the trust-hop count must be
 * adjusted (e.g. via a TRUSTED_PROXY_HOPS env var) to take the Nth-from-right
 * entry instead of the rightmost.
 */
export function getClientIp(headers: Headers): string {
  // Vercel sets this with the real client IP; prefer it on Vercel deployments.
  const vff = headers.get("x-vercel-forwarded-for");
  if (vff) {
    const ip = vff.split(",")[0]?.trim();
    if (ip) return ip;
  }
  // Standard XFF: trust the rightmost entry (added by the closest proxy),
  // not the leftmost (which is client-controlled and easy to forge).
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0) {
      const ip = parts[parts.length - 1];
      if (ip) return ip;
    }
  }
  // Fallback for some hosting providers.
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
