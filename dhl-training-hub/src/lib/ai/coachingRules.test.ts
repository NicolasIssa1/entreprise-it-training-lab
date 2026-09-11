import { test } from "node:test";
import assert from "node:assert/strict";
import { pickStrongestSkillIds, pickWeakestSkillIds, nextQuizMeDifficulty, INTERVIEW_RUBRIC_DIMENSIONS, INTERVIEW_RUBRIC_RATINGS, modeInstructions } from "./coachingRules.ts";
import { TUTOR_MODES } from "../types.ts";

function skill(id: string, overall: number, hasEvidence = true) {
  return {
    skill: { id },
    overall,
    evidence: {
      learning: { completed: hasEvidence ? 1 : 0 },
      knowledge: { attempted: 0 },
      practical: { completed: 0 },
    },
  };
}

test("pickStrongestSkillIds: only strength-tier skills, sorted highest first, capped", () => {
  const skills = [skill("a", 40), skill("b", 90), skill("c", 70), skill("d", 66)];
  assert.deepEqual(pickStrongestSkillIds(skills, 2), ["b", "c"]);
});

test("pickStrongestSkillIds: empty when nobody is strong yet", () => {
  assert.deepEqual(pickStrongestSkillIds([skill("a", 10), skill("b", 40)]), []);
});

test("pickWeakestSkillIds: only gap-tier skills WITH evidence, sorted lowest first", () => {
  const skills = [skill("a", 10), skill("b", 5), skill("c", 0, false), skill("d", 50)];
  // "c" is excluded: gap-tier but zero evidence (not started, not a weakness).
  assert.deepEqual(pickWeakestSkillIds(skills, 2), ["b", "a"]);
});

test("pickWeakestSkillIds: a skill with no evidence at all is never flagged as a weakness", () => {
  assert.deepEqual(pickWeakestSkillIds([skill("a", 0, false)]), []);
});

test("nextQuizMeDifficulty: steps down immediately on a miss, never below foundation", () => {
  assert.equal(nextQuizMeDifficulty("intermediate", false, 0), "foundation");
  assert.equal(nextQuizMeDifficulty("foundation", false, 0), "foundation");
});

test("nextQuizMeDifficulty: steps up only after a 2+ correct streak, never above challenging", () => {
  assert.equal(nextQuizMeDifficulty("foundation", true, 1), "foundation");
  assert.equal(nextQuizMeDifficulty("foundation", true, 2), "intermediate");
  assert.equal(nextQuizMeDifficulty("challenging", true, 3), "challenging");
});

test("nextQuizMeDifficulty: a single correct answer (streak 1) holds steady", () => {
  assert.equal(nextQuizMeDifficulty("intermediate", true, 1), "intermediate");
});

test("interview rubric: exactly 4 dimensions and 3 ratings, never a fabricated hiring probability", () => {
  assert.equal(INTERVIEW_RUBRIC_DIMENSIONS.length, 4);
  assert.equal(INTERVIEW_RUBRIC_RATINGS.length, 3);
  const allText = [...INTERVIEW_RUBRIC_DIMENSIONS, ...INTERVIEW_RUBRIC_RATINGS].join(" ").toLowerCase();
  assert.ok(!allText.includes("probability"));
  assert.ok(!allText.includes("chance of"));
  assert.ok(!allText.includes("%"));
});

test("modeInstructions: every TutorMode has a non-empty instruction (no silently-dead mode)", () => {
  for (const mode of TUTOR_MODES) {
    const instructions = modeInstructions(mode);
    assert.equal(typeof instructions, "string");
    assert.ok(instructions.length > 20, `mode "${mode}" has a suspiciously short instruction`);
  }
});

test("modeInstructions: every coach-family mode explicitly forbids revealing the answer", () => {
  for (const mode of ["quiz-coach", "investigation-coach", "automation-coach", "coach"] as const) {
    const text = modeInstructions(mode).toLowerCase();
    assert.ok(text.includes("reveal") || text.includes("without") || text.includes("not"), `"${mode}" should state a non-disclosure rule`);
  }
});

test("modeInstructions: interview mode explicitly forbids hiring-probability language", () => {
  const text = modeInstructions("interview").toLowerCase();
  assert.ok(text.includes("never state or imply a hiring probability"));
});

test("modeInstructions: troubleshoot mode explicitly requires fictional content", () => {
  const text = modeInstructions("troubleshoot").toLowerCase();
  assert.ok(text.includes("fictional"));
  assert.ok(text.includes("never a real one"));
});

test("modeInstructions: project-mentor mode references the hint-level mechanism", () => {
  const text = modeInstructions("project-mentor").toLowerCase();
  assert.ok(text.includes("hint level"));
});
