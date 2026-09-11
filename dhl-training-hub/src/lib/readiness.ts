import type { ReadinessProfile, SkillGapEntry, SkillGapClassification, SkillProgress, TrainingActivityEvent } from "@/lib/types";

/**
 * The Readiness Score / Skill-Gap Engine (Phase 11). Every function here is
 * pure and reads only SkillProgress values that skillProgress.ts already
 * derives from the three existing evidence sources — no second, independently
 * stored competency score, per root CLAUDE.md's repeated rule. This module
 * only adds a classification (strength/developing/gap) and a momentum
 * summary on top of numbers that already exist.
 */

const STRENGTH_THRESHOLD = 65; // solidly into "Practicing" or above
const GAP_THRESHOLD = 25; // "Getting Started" or below

export function classifySkillGap(progress: SkillProgress): SkillGapClassification {
  if (progress.overall >= STRENGTH_THRESHOLD) return "strength";
  if (progress.overall <= GAP_THRESHOLD) return "gap";
  return "developing";
}

export function buildSkillGapEntries(skillProgresses: SkillProgress[]): SkillGapEntry[] {
  return skillProgresses.map((progress) => ({ progress, classification: classifySkillGap(progress) }));
}

/**
 * A "how recently active" indicator derived from genuinely timestamped
 * activity — the same TrainingActivityEvent list lib/analytics/activityTimeline.ts
 * already builds from real quiz-attempt/investigation-completion/automation-
 * lab-attempt records. Deliberately not a fabricated trend line or a second
 * stored score history — see root CLAUDE.md: readiness must reflect real
 * activity only, and "improvement over time" is only ever shown where real
 * timestamped data exists to support it.
 */
export function summarizeRecentMomentum(recentActivity: TrainingActivityEvent[]): { activityCount30d: number; description: string } {
  const cutoffMs = Date.now() - 30 * 24 * 60 * 60 * 1000;
  const activityCount30d = recentActivity.filter((e) => new Date(e.timestamp).getTime() >= cutoffMs).length;
  const description =
    activityCount30d === 0
      ? "No recorded training activity in the last 30 days."
      : `${activityCount30d} training ${activityCount30d === 1 ? "activity" : "activities"} recorded in the last 30 days.`;
  return { activityCount30d, description };
}

export function buildReadinessProfile(skillProgresses: SkillProgress[], overall: number, recentActivity: TrainingActivityEvent[]): ReadinessProfile {
  const skills = buildSkillGapEntries(skillProgresses);
  const hasSufficientData = skillProgresses.some(
    (s) => s.evidence.learning.completed > 0 || s.evidence.knowledge.attempted > 0 || s.evidence.practical.completed > 0,
  );

  return {
    overall,
    skills,
    strengths: skills.filter((s) => s.classification === "strength"),
    developing: skills.filter((s) => s.classification === "developing"),
    gaps: skills.filter((s) => s.classification === "gap"),
    hasSufficientData,
    recentMomentum: summarizeRecentMomentum(recentActivity),
  };
}
