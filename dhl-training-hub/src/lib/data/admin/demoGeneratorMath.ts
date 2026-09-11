/**
 * Pure math kernels for the Phase 12 fictional demo-data generator —
 * deliberately zero `@/`-aliased imports, same testability pattern as
 * lib/analytics/pureCalculations.ts. lib/data/admin/demoDataGenerator.ts
 * builds on top of these with real content (learning topics, quizzes,
 * scenarios), which isn't independently unit-testable the same way (same
 * precedent as lib/data/skills.ts/assignments.ts) — but the arithmetic that
 * actually determines how "strong" vs. "struggling" demo learners differ is
 * tested here directly.
 */

/** Deterministic PRNG (mulberry32) — same seed always produces the same
 * sequence, so demo data is stable/reproducible across renders and safe to
 * assert on in tests, unlike Math.random(). */
export function mulberry32(seed: number): () => number {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Small string hash (djb2-style) — turns a learner id into a stable numeric
 * PRNG seed, so the same learner id always generates the same fictional
 * evidence. */
export function hashSeed(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (Math.imul(h, 31) + id.charCodeAt(i)) | 0;
  return h;
}

/** Inclusive random integer in [min, max] using the given PRNG. */
export function pickInt(rng: () => number, [min, max]: [number, number]): number {
  if (max <= min) return min;
  return min + Math.floor(rng() * (max - min + 1));
}

/** Random float in [min, max), rounded to a whole percentage-style number. */
export function pickScore(rng: () => number, [min, max]: [number, number]): number {
  if (max <= min) return min;
  return Math.round(min + rng() * (max - min));
}

export type DemoPerformanceCategory = "Excellent" | "Strong" | "Developing" | "Needs Review";

/** Mirrors investigationScoring.ts's overallCategoryFor bands exactly
 * (85/70/50) — duplicated here because that function isn't exported, and
 * duplicating four numeric thresholds is simpler and more testable than
 * exporting an internal helper just for demo-data generation. Keep these in
 * sync if the real bands ever change. */
export function categoryForScore(score: number): DemoPerformanceCategory {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong";
  if (score >= 50) return "Developing";
  return "Needs Review";
}

/** Given a total question count and a target percentage, returns how many
 * questions should be marked correct — the building block for generating an
 * internally-consistent fictional QuizAttempt.answers array. */
export function correctCountForPercentage(totalQuestions: number, percentage: number): number {
  return Math.max(0, Math.min(totalQuestions, Math.round((percentage / 100) * totalQuestions)));
}
