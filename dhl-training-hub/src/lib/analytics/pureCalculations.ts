/**
 * Zero-dependency pure math kernels shared by the analytics derivation layer
 * (quizAnalytics.ts, activityTimeline.ts, investigationAnalytics.ts).
 * Deliberately has NO imports at all — including no "@/" path-aliased
 * imports — so it can be unit-tested directly with Node's built-in test
 * runner the same way lib/mergeCloudState.ts already is (Next.js's bundler
 * resolves "@/" for the app itself, but plain `node --test` can't, so any
 * function we want genuinely unit-tested needs to live in an alias-free
 * module like this one).
 */

/** Small sample sizes should never be overinterpreted (see Phase 8 brief) —
 * fewer than 2 attempts can't show any trend, and fewer than 3 only ever
 * reports "steady" rather than reading noise as an improvement/decline. A
 * >=10 percentage-point move between the first and last attempt is treated
 * as a real trend; anything smaller is "steady". */
export function trendDirectionForPercentages(percentages: number[]): "improving" | "declining" | "steady" | "insufficient-data" {
  if (percentages.length < 2) return "insufficient-data";
  if (percentages.length < 3) return "steady";
  const delta = percentages[percentages.length - 1] - percentages[0];
  if (delta >= 10) return "improving";
  if (delta <= -10) return "declining";
  return "steady";
}

/** Monday (UTC) of the ISO week containing `isoTimestamp`, as an ISO date
 * string — used to bucket activity by week without a date library. */
export function isoWeekStart(isoTimestamp: string): string {
  const date = new Date(isoTimestamp);
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7; // Sunday (0) -> 7, so Monday is always day 1
  if (day !== 1) d.setUTCDate(d.getUTCDate() - (day - 1));
  return d.toISOString().slice(0, 10);
}

/** Buckets a list of ISO timestamps into {weekStart, count}, sorted
 * chronologically. An empty input returns an empty array — never a
 * fabricated flat line of zero-weeks. */
export function bucketTimestampsByWeek(timestamps: string[]): { weekStart: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const ts of timestamps) {
    const weekStart = isoWeekStart(ts);
    counts.set(weekStart, (counts.get(weekStart) ?? 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => a[0].localeCompare(b[0])).map(([weekStart, count]) => ({ weekStart, count }));
}

/** Rounded mean of a non-empty number array. Callers are responsible for
 * guarding the empty case (an empty-array mean is undefined, not 0). */
export function average(scores: number[]): number {
  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
}
