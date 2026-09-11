import { test } from "node:test";
import assert from "node:assert/strict";
import { aggregateKpis } from "./adminKpiRules.ts";
import type { LearnerKpiInput } from "./adminKpiRules.ts";

function learner(overrides: Partial<LearnerKpiInput> = {}): LearnerKpiInput {
  return { hasProgramme: false, programmeComplete: false, overallReadiness: 0, isActive: false, enterpriseProjectsCompleted: 0, hasAttentionFlag: false, ...overrides };
}

test("empty roster produces zeroed KPIs, never NaN or a fabricated number", () => {
  const kpis = aggregateKpis([], 0);
  assert.deepEqual(kpis, {
    totalLearners: 0,
    activeLearners: 0,
    programmeCompletionPercent: 0,
    averageReadiness: 0,
    projectsCompleted: 0,
    learnersRequiringAttention: 0,
    overdueAssignments: 0,
  });
});

test("totalLearners and activeLearners count correctly", () => {
  const kpis = aggregateKpis([learner({ isActive: true }), learner({ isActive: true }), learner({ isActive: false })], 0);
  assert.equal(kpis.totalLearners, 3);
  assert.equal(kpis.activeLearners, 2);
});

test("programmeCompletionPercent only counts learners who actually have a programme assigned", () => {
  const kpis = aggregateKpis(
    [learner({ hasProgramme: true, programmeComplete: true }), learner({ hasProgramme: true, programmeComplete: false }), learner({ hasProgramme: false })],
    0,
  );
  // 1 of 2 WITH a programme completed it — the learner with no programme is excluded from the denominator.
  assert.equal(kpis.programmeCompletionPercent, 50);
});

test("programmeCompletionPercent is 0, not NaN, when nobody has a programme", () => {
  const kpis = aggregateKpis([learner(), learner()], 0);
  assert.equal(kpis.programmeCompletionPercent, 0);
});

test("averageReadiness is a real mean, rounded", () => {
  const kpis = aggregateKpis([learner({ overallReadiness: 40 }), learner({ overallReadiness: 60 }), learner({ overallReadiness: 61 })], 0);
  assert.equal(kpis.averageReadiness, 54); // (40+60+61)/3 = 53.67 -> 54
});

test("projectsCompleted sums across the whole roster", () => {
  const kpis = aggregateKpis([learner({ enterpriseProjectsCompleted: 2 }), learner({ enterpriseProjectsCompleted: 1 }), learner({ enterpriseProjectsCompleted: 0 })], 0);
  assert.equal(kpis.projectsCompleted, 3);
});

test("learnersRequiringAttention counts flagged learners, and overdueAssignments passes through unchanged", () => {
  const kpis = aggregateKpis([learner({ hasAttentionFlag: true }), learner({ hasAttentionFlag: false })], 5);
  assert.equal(kpis.learnersRequiringAttention, 1);
  assert.equal(kpis.overdueAssignments, 5);
});
