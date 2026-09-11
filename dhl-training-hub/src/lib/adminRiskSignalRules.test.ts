import { test } from "node:test";
import assert from "node:assert/strict";
import { computeAttentionFlags } from "./adminRiskSignalRules.ts";
import type { AttentionFlagInput } from "./adminRiskSignalRules.ts";

function baseInput(overrides: Partial<AttentionFlagInput> = {}): AttentionFlagInput {
  return {
    overdueAssignmentCount: 0,
    averageQuizScore: null,
    hasRepeatedLowScoringQuiz: false,
    daysSinceLastActivity: 2,
    joinedDaysAgo: 30,
    gapSkillCount: 0,
    ...overrides,
  };
}

test("a healthy, active, on-track learner gets no flags at all", () => {
  assert.deepEqual(computeAttentionFlags(baseInput({ averageQuizScore: 85 })), []);
});

test("overdue-assignment fires with a count-aware, human-readable reason", () => {
  const flags = computeAttentionFlags(baseInput({ overdueAssignmentCount: 2 }));
  assert.equal(flags.length, 1);
  assert.equal(flags[0].kind, "overdue-assignment");
  assert.match(flags[0].reason, /2 assignments are overdue/);
});

test("a brand-new learner with no activity yet is NOT flagged inactive (grace period)", () => {
  const flags = computeAttentionFlags(baseInput({ daysSinceLastActivity: null, joinedDaysAgo: 3 }));
  assert.equal(flags.some((f) => f.kind === "inactive"), false);
});

test("a learner who joined long ago with zero activity IS flagged inactive", () => {
  const flags = computeAttentionFlags(baseInput({ daysSinceLastActivity: null, joinedDaysAgo: 30 }));
  assert.equal(flags.some((f) => f.kind === "inactive"), true);
});

test("inactive fires past the 14-day threshold, not before it", () => {
  assert.equal(computeAttentionFlags(baseInput({ daysSinceLastActivity: 14 })).some((f) => f.kind === "inactive"), false);
  assert.equal(computeAttentionFlags(baseInput({ daysSinceLastActivity: 15 })).some((f) => f.kind === "inactive"), true);
});

test("low-quiz-performance only fires once quizzes were actually attempted (never for null)", () => {
  assert.equal(computeAttentionFlags(baseInput({ averageQuizScore: null })).some((f) => f.kind === "low-quiz-performance"), false);
  assert.equal(computeAttentionFlags(baseInput({ averageQuizScore: 49 })).some((f) => f.kind === "low-quiz-performance"), true);
  assert.equal(computeAttentionFlags(baseInput({ averageQuizScore: 50 })).some((f) => f.kind === "low-quiz-performance"), false);
});

test("repeated-unsuccessful-attempts and major-competency-gap fire independently with explanatory reasons", () => {
  const flags = computeAttentionFlags(baseInput({ hasRepeatedLowScoringQuiz: true, gapSkillCount: 2 }));
  const kinds = flags.map((f) => f.kind);
  assert.ok(kinds.includes("repeated-unsuccessful-attempts"));
  assert.ok(kinds.includes("major-competency-gap"));
  const gapFlag = flags.find((f) => f.kind === "major-competency-gap")!;
  assert.match(gapFlag.reason, /2 skill areas/);
});

test("every flag carries a non-empty, human-readable reason (never opaque)", () => {
  const flags = computeAttentionFlags(
    baseInput({ overdueAssignmentCount: 1, averageQuizScore: 30, hasRepeatedLowScoringQuiz: true, daysSinceLastActivity: 20, gapSkillCount: 1 }),
  );
  assert.equal(flags.length, 5);
  for (const flag of flags) {
    assert.ok(flag.reason.length > 0);
    assert.ok(["high", "medium"].includes(flag.severity));
  }
});
