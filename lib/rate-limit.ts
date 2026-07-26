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
 */
export function getClientIp(headers: Headers): string {
  // Vercel and most reverse proxies set x-forwarded-for with the client IP first.
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const ip = xff.split(",")[0]?.trim();
    if (ip) return ip;
  }
  // Fallback for some hosting providers.
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "unknown";
}
