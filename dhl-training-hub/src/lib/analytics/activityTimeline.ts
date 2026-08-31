import { InvestigationCompletionRecord, TrainingActivityEvent, WeeklyActivityCount } from "@/lib/types";
import { getQuizById } from "@/lib/data/quizzes";
import { getScenarioById } from "@/lib/data/investigations";
import { QuizAttemptsMap, quizResultGuidance } from "@/lib/quizAttempts";
import { bucketTimestampsByWeek } from "@/lib/analytics/pureCalculations";

/**
 * Activity timeline (Phase 8 Part F) — built ONLY from structured, genuinely
 * timestamped records: quiz attempts (QuizAttempt.completedAt) and
 * investigation completions (InvestigationCompletionRecord.completedAt).
 *
 * Deliberately excludes Learn topic completions: the current data model
 * stores completion as a plain boolean (locally, and via
 * fetchLearningProgress's return shape even in Cloud Mode) with no per-topic
 * completion timestamp exposed to the client, so a dated "Completed X lesson"
 * event can't be produced honestly. Per the Phase 8 brief — "if historical
 * timestamps are unavailable... do not invent them" — topic completions are
 * only ever shown as an aggregate count (see trainingOverview.ts), never as a
 * timeline event. See docs/ANALYTICS.md for the full writeup and the
 * low-risk path to add this later (the Supabase column already exists).
 *
 * Also deliberately excludes Daily Log, CV Achievement, and Tutor
 * conversation content — see root CLAUDE.md's confidentiality rules and
 * docs/ANALYTICS.md's privacy-exclusions section.
 */
export function computeActivityTimeline(
  quizAttemptsMap: QuizAttemptsMap,
  investigationCompletions: InvestigationCompletionRecord[],
): TrainingActivityEvent[] {
  const events: TrainingActivityEvent[] = [];

  for (const [quizId, attempts] of Object.entries(quizAttemptsMap)) {
    const quiz = getQuizById(quizId);
    if (!quiz) continue;
    for (const attempt of attempts) {
      events.push({
        id: `quiz-${attempt.attemptId}`,
        type: "quiz-attempt",
        timestamp: attempt.completedAt,
        title: `Completed ${quiz.title}`,
        description: `${attempt.percentage}% (${quizResultGuidance(attempt.percentage).label})`,
        href: `/quizzes/${quiz.id}`,
      });
    }
  }

  for (const record of investigationCompletions) {
    const scenario = getScenarioById(record.scenarioId);
    if (!scenario) continue;
    events.push({
      id: `investigation-${record.scenarioId}-${record.completedAt}`,
      type: "investigation-completion",
      timestamp: record.completedAt,
      title: `Finished ${scenario.title}`,
      description: `${record.score}% training indicator (${record.resultCategory})`,
      href: `/tickets/investigate/${scenario.id}`,
    });
  }

  return events.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

/**
 * Progress-over-time (Phase 8 Part G) — activity count per ISO week, derived
 * from the same structured timeline events above. Returns weeks in
 * chronological order with no gaps invented; an empty timeline returns an
 * empty array rather than a fabricated flat line.
 */
export function computeWeeklyActivityCounts(events: TrainingActivityEvent[]): WeeklyActivityCount[] {
  return bucketTimestampsByWeek(events.map((e) => e.timestamp));
}
