import { test } from "node:test";
import assert from "node:assert/strict";
import { classifySkillGap, buildReadinessProfile, summarizeRecentMomentum } from "./readiness.ts";
import type { SkillProgress, TrainingActivityEvent } from "./types.ts";

function skill(id: string, overall: number): SkillProgress {
  return {
    skill: { id: id as SkillProgress["skill"]["id"], name: id, description: "" },
    overall,
    level: "Not Started",
    evidence: {
      learning: { completed: 0, total: 1, percentage: 0 },
      knowledge: { attempted: 0, total: 1, percentage: 0 },
      practical: { completed: 0, total: 1, percentage: 0 },
    },
  };
}

test("classifySkillGap: strength >= 65, gap <= 25, developing in between", () => {
  assert.equal(classifySkillGap(skill("a", 0)), "gap");
  assert.equal(classifySkillGap(skill("a", 25)), "gap");
  assert.equal(classifySkillGap(skill("a", 26)), "developing");
  assert.equal(classifySkillGap(skill("a", 64)), "developing");
  assert.equal(classifySkillGap(skill("a", 65)), "strength");
  assert.equal(classifySkillGap(skill("a", 100)), "strength");
});

test("buildReadinessProfile: hasSufficientData is false when literally zero evidence exists anywhere", () => {
  const noEvidence: SkillProgress = {
    ...skill("a", 0),
    evidence: {
      learning: { completed: 0, total: 5, percentage: 0 },
      knowledge: { attempted: 0, total: 5, percentage: 0 },
      practical: { completed: 0, total: 5, percentage: 0 },
    },
  };
  const profile = buildReadinessProfile([noEvidence], 0, []);
  assert.equal(profile.hasSufficientData, false);
});

test("buildReadinessProfile: hasSufficientData is true once any evidence exists, even with a low overall score", () => {
  const someEvidence: SkillProgress = {
    ...skill("a", 5),
    evidence: {
      learning: { completed: 1, total: 5, percentage: 20 },
      knowledge: { attempted: 0, total: 5, percentage: 0 },
      practical: { completed: 0, total: 5, percentage: 0 },
    },
  };
  const profile = buildReadinessProfile([someEvidence], 5, []);
  assert.equal(profile.hasSufficientData, true);
});

test("buildReadinessProfile: groups skills into strengths/developing/gaps correctly", () => {
  const profile = buildReadinessProfile([skill("weak", 10), skill("mid", 40), skill("strong", 80)], 43, []);
  assert.equal(profile.gaps.length, 1);
  assert.equal(profile.developing.length, 1);
  assert.equal(profile.strengths.length, 1);
  assert.equal(profile.gaps[0].progress.skill.id, "weak");
  assert.equal(profile.strengths[0].progress.skill.id, "strong");
});

test("summarizeRecentMomentum: counts only events within the last 30 days", () => {
  const now = Date.now();
  const events: TrainingActivityEvent[] = [
    { id: "1", type: "quiz-attempt", timestamp: new Date(now).toISOString(), title: "t", description: "d", href: "/x" },
    { id: "2", type: "quiz-attempt", timestamp: new Date(now - 10 * 24 * 60 * 60 * 1000).toISOString(), title: "t", description: "d", href: "/x" },
    { id: "3", type: "quiz-attempt", timestamp: new Date(now - 45 * 24 * 60 * 60 * 1000).toISOString(), title: "t", description: "d", href: "/x" },
  ];
  const momentum = summarizeRecentMomentum(events);
  assert.equal(momentum.activityCount30d, 2);
});

test("summarizeRecentMomentum: zero recent activity produces an honest 'no activity' description", () => {
  const momentum = summarizeRecentMomentum([]);
  assert.equal(momentum.activityCount30d, 0);
  assert.match(momentum.description, /no recorded training activity/i);
});
