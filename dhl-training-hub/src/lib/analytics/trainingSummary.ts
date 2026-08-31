import { InvestigationCompletionRecord, TrainingSummary } from "@/lib/types";
import { QuizAttemptsMap } from "@/lib/quizAttempts";
import { computeTrainingOverview } from "@/lib/analytics/trainingOverview";
import { computeSkillAnalytics } from "@/lib/analytics/skillAnalytics";
import { computeActivityTimeline } from "@/lib/analytics/activityTimeline";

const RECENT_ACTIVITY_LIMIT = 8;

/**
 * The single computation both /analytics/summary and /manager-preview build
 * from (Phase 8 Part H/J) — one derivation, two presentations, so the numbers
 * a learner sees in their own summary always match what a "manager preview"
 * of the same data would show. Nothing here reads Daily Log, CV Achievement,
 * or Tutor conversation content — see docs/ANALYTICS.md.
 */
export function computeTrainingSummary(
  completedTopics: Record<string, boolean>,
  quizAttemptsMap: QuizAttemptsMap,
  investigationCompletions: InvestigationCompletionRecord[],
): TrainingSummary {
  const skills = computeSkillAnalytics(completedTopics, quizAttemptsMap, investigationCompletions);
  const overview = computeTrainingOverview(
    completedTopics,
    quizAttemptsMap,
    investigationCompletions,
    skills.map((s) => s.progress),
  );

  const sortedDesc = [...skills].sort((a, b) => b.progress.overall - a.progress.overall);
  const sortedAsc = [...skills].sort((a, b) => a.progress.overall - b.progress.overall);

  const strongest = sortedDesc.filter((s) => s.progress.overall > 0).slice(0, 3);
  const strongestIds = new Set(strongest.map((s) => s.progress.skill.id));
  const focus = sortedAsc.filter((s) => !strongestIds.has(s.progress.skill.id) && s.progress.overall < 75).slice(0, 3);

  const recentActivity = computeActivityTimeline(quizAttemptsMap, investigationCompletions).slice(0, RECENT_ACTIVITY_LIMIT);

  return {
    overview,
    skills,
    strongestSkills: strongest.map((s) => s.progress.skill),
    focusSkills: focus.map((s) => s.progress.skill),
    recentActivity,
    generatedAt: new Date().toISOString(),
  };
}
