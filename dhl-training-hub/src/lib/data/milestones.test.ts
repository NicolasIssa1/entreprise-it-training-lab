import { test } from "node:test";
import assert from "node:assert/strict";
import { milestoneDefinitions, isMilestoneEligible, getEligibleMilestoneIds } from "./milestones.ts";
import type { MilestoneEvaluationContext } from "./milestones.ts";
import type { SkillProgress } from "../types.ts";

function skill(overall: number): SkillProgress {
  return {
    skill: { id: "itsm", name: "IT Service Management", description: "" },
    overall,
    level: "Not Started",
    evidence: {
      learning: { completed: 0, total: 1, percentage: 0 },
      knowledge: { attempted: 0, total: 1, percentage: 0 },
      practical: { completed: 0, total: 1, percentage: 0 },
    },
  };
}

const emptyContext: MilestoneEvaluationContext = {
  topicsCompletedCount: 0,
  quizzesPassedCount: 0,
  investigationsResolvedCount: 0,
  automationBuildsCompletedCount: 0,
  enterpriseProjectsCompletedCount: 0,
  pathsCompletedCount: 0,
  assignmentsCompletedCount: 0,
  skillProgresses: [],
  totalActivityCount: 0,
};

test("every milestone definition has a matching eligibility rule (no silently-dead milestone)", () => {
  for (const milestone of milestoneDefinitions) {
    // Should never throw / should resolve to a boolean, not undefined-coerced-falsy-by-accident.
    assert.equal(typeof isMilestoneEligible(milestone.id, emptyContext), "boolean");
  }
});

test("an empty evaluation context makes no milestone eligible (no false positives)", () => {
  assert.deepEqual(getEligibleMilestoneIds(emptyContext), []);
});

test("first-topic-completed unlocks only once a topic is completed", () => {
  assert.equal(isMilestoneEligible("first-topic-completed", emptyContext), false);
  assert.equal(isMilestoneEligible("first-topic-completed", { ...emptyContext, topicsCompletedCount: 1 }), true);
});

test("well-rounded-foundation requires every skill at 25+, not just one", () => {
  const mixed = { ...emptyContext, skillProgresses: [skill(30), skill(10)] };
  assert.equal(isMilestoneEligible("well-rounded-foundation", mixed), false);
  const allAbove = { ...emptyContext, skillProgresses: [skill(30), skill(25)] };
  assert.equal(isMilestoneEligible("well-rounded-foundation", allAbove), true);
});

test("well-rounded-foundation is not eligible with zero skills recorded", () => {
  assert.equal(isMilestoneEligible("well-rounded-foundation", emptyContext), false);
});

test("strong-foundation-skill unlocks once any single skill reaches 75", () => {
  assert.equal(isMilestoneEligible("strong-foundation-skill", { ...emptyContext, skillProgresses: [skill(74)] }), false);
  assert.equal(isMilestoneEligible("strong-foundation-skill", { ...emptyContext, skillProgresses: [skill(75)] }), true);
});

test("consistently-engaged requires at least 10 recorded activities", () => {
  assert.equal(isMilestoneEligible("consistently-engaged", { ...emptyContext, totalActivityCount: 9 }), false);
  assert.equal(isMilestoneEligible("consistently-engaged", { ...emptyContext, totalActivityCount: 10 }), true);
});

test("an unknown milestone id is never eligible", () => {
  assert.equal(isMilestoneEligible("not-a-real-milestone", emptyContext), false);
});
