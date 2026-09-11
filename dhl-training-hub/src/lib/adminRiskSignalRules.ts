/**
 * Pure attention/risk-flag rules (Phase 12) — zero `@/`-aliased imports, same
 * testability pattern as adminAssignmentStatusRules.ts. Every rule is a
 * simple, explainable threshold check — never an opaque AI-generated score.
 * lib/adminRiskSignals.ts computes the inputs below from a learner's real
 * evidence (skill progress, quiz attempts, assignment status) and calls
 * computeAttentionFlags; this file only decides which flags fire once those
 * numbers are already known, so the decision logic itself is unit-tested in
 * isolation.
 */
export type AttentionFlagKind = "overdue-assignment" | "low-quiz-performance" | "inactive" | "repeated-unsuccessful-attempts" | "major-competency-gap";

export interface AttentionFlagInput {
  overdueAssignmentCount: number;
  /** Mean of best-attempt percentages across quizzes the learner has
   * actually attempted — null when they haven't attempted any (that's an
   * "inactive" signal, not a "low performance" one, so it's kept separate). */
  averageQuizScore: number | null;
  hasRepeatedLowScoringQuiz: boolean;
  /** Days since the learner's last recorded activity — null when they have
   * never recorded any activity at all. */
  daysSinceLastActivity: number | null;
  joinedDaysAgo: number;
  gapSkillCount: number;
}

export interface AttentionFlagResult {
  kind: AttentionFlagKind;
  severity: "high" | "medium";
  reason: string;
}

const INACTIVITY_THRESHOLD_DAYS = 14;
/** A learner who joined within this many days and has no activity yet is
 * "new," not "inactive" — avoids flagging every brand-new signup as at-risk
 * on day one. */
const NEW_LEARNER_GRACE_DAYS = 7;
const LOW_QUIZ_THRESHOLD = 50;

export function computeAttentionFlags(input: AttentionFlagInput): AttentionFlagResult[] {
  const flags: AttentionFlagResult[] = [];

  if (input.overdueAssignmentCount > 0) {
    flags.push({
      kind: "overdue-assignment",
      severity: "high",
      reason: `${input.overdueAssignmentCount} assignment${input.overdueAssignmentCount === 1 ? " is" : "s are"} overdue.`,
    });
  }

  const isInactive =
    input.daysSinceLastActivity === null ? input.joinedDaysAgo > NEW_LEARNER_GRACE_DAYS : input.daysSinceLastActivity > INACTIVITY_THRESHOLD_DAYS;
  if (isInactive) {
    flags.push({
      kind: "inactive",
      severity: "medium",
      reason:
        input.daysSinceLastActivity === null
          ? `No recorded activity since joining ${input.joinedDaysAgo} days ago.`
          : `No recorded activity for ${input.daysSinceLastActivity} days.`,
    });
  }

  if (input.averageQuizScore !== null && input.averageQuizScore < LOW_QUIZ_THRESHOLD) {
    flags.push({
      kind: "low-quiz-performance",
      severity: "medium",
      reason: `Average quiz score is ${Math.round(input.averageQuizScore)}%, below the ${LOW_QUIZ_THRESHOLD}% review threshold.`,
    });
  }

  if (input.hasRepeatedLowScoringQuiz) {
    flags.push({
      kind: "repeated-unsuccessful-attempts",
      severity: "high",
      reason: "Multiple attempts recorded on the same assessment without reaching a passing score.",
    });
  }

  if (input.gapSkillCount > 0) {
    flags.push({
      kind: "major-competency-gap",
      severity: "medium",
      reason: `${input.gapSkillCount} skill area${input.gapSkillCount === 1 ? "" : "s"} at Getting Started level or below.`,
    });
  }

  return flags;
}
