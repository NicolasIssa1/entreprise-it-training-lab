/**
 * Best-effort, in-memory per-key sliding-window rate limit for /api/tutor
 * (Phase 6 Part T: basic abuse/cost protection appropriate for a prototype —
 * not enterprise billing/rate-limiting infrastructure). Keyed by client IP.
 *
 * Known limitation: this Map lives in a single server process's memory. It
 * resets on redeploy/restart and does not share state across multiple
 * server instances (e.g. serverless functions scaled horizontally) — see
 * docs/AI-TUTOR.md. Sufficient for a personal training prototype, not a
 * substitute for real infrastructure-level rate limiting in production.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS_PER_WINDOW = 20;

const buckets = new Map<string, number[]>();

export function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const recent = (buckets.get(key) ?? []).filter((t) => now - t < WINDOW_MS);

  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    buckets.set(key, recent);
    return false;
  }

  recent.push(now);
  buckets.set(key, recent);
  return true;
}
