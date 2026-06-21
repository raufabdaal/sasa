/**
 * Simple in-memory rate limiter.
 *
 * Limit: 5 requests / 60 seconds per identifier (usually IP).
 * Resets when the server restarts. Sufficient for v0 traffic.
 *
 * In production with multiple Vercel serverless instances each will have its
 * own counter, so the effective limit is ~5 × N (where N = warm instances).
 * That's fine for our scale. Upgrade to Upstash if traffic grows.
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS = 5;

type Entry = { count: number; resetAt: number };
const buckets = new Map<string, Entry>();

export type RateLimitResult =
  | { allowed: true; remaining: number; resetIn: number }
  | { allowed: false; remaining: 0; resetIn: number };

export function rateLimit(identifier: string): RateLimitResult {
  const now = Date.now();
  const entry = buckets.get(identifier);

  if (!entry || entry.resetAt < now) {
    buckets.set(identifier, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_REQUESTS - 1, resetIn: WINDOW_MS };
  }

  if (entry.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0, resetIn: entry.resetAt - now };
  }

  entry.count += 1;
  return {
    allowed: true,
    remaining: MAX_REQUESTS - entry.count,
    resetIn: entry.resetAt - now,
  };
}

/** Extract a reasonable identifier from a Next.js request. */
export function identifierFromRequest(req: Request): string {
  const fwd = req.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
