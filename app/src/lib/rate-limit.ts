// Lightweight in-memory rate limiter.
//
// Serverless caveat: each Vercel function instance has its own memory, so
// this is per-instance, not global. A burst attack distributed across
// instances will partially evade it. That's acceptable for the beta — the
// goal is to discourage trivial brute-force probing, not to prevent
// determined DDoS. If we need global counters later, swap in Upstash Redis
// or @upstash/ratelimit; the call sites use a stable shape that lets us
// drop in a Promise-returning impl with no caller changes.

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

// Periodic cleanup so the map doesn't grow unbounded under varied keys.
// Runs at most every 60 s, lazily on the next call.
let lastSweep = 0;
function maybeSweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [k, v] of buckets) {
    if (v.resetAt <= now) buckets.delete(k);
  }
}

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  resetAt: number;
};

/**
 * Check whether a key (typically `${endpoint}:${ip}`) has exceeded its
 * budget within the given window. Increments on every call regardless of
 * the result so repeat offenders keep accumulating.
 */
export function rateLimit(
  key: string,
  max: number,
  windowSec: number
): RateLimitResult {
  const now = Date.now();
  maybeSweep(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    const fresh = { count: 1, resetAt: now + windowSec * 1000 };
    buckets.set(key, fresh);
    return { allowed: true, remaining: max - 1, resetAt: fresh.resetAt };
  }

  existing.count += 1;
  return {
    allowed: existing.count <= max,
    remaining: Math.max(0, max - existing.count),
    resetAt: existing.resetAt,
  };
}

/**
 * Extract the client IP from a request — Vercel forwards via x-forwarded-for
 * with the client as the first entry. Falls back to x-real-ip and finally to
 * a literal "unknown" so the limiter still has a key.
 */
export function clientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return request.headers.get("x-real-ip") || "unknown";
}
