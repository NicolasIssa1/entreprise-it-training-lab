"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { learningTopics } from "@/lib/data/learning";
import { quizzes } from "@/lib/data/quizzes";
import { investigationScenarios } from "@/lib/data/investigations";
import { useLearningProgress } from "@/lib/learningProgress";
import { useQuizAttempts } from "@/lib/quizAttempts";
import { useInvestigationCompletions } from "@/lib/investigationProgress";
import { calculateAllSkillProgress, calculateOverallTrainingProgress } from "@/lib/skillProgress";
import { getRecommendations } from "@/lib/recommendations";

/**
 * Lightweight Dashboard summary — deliberately not the full Progress page.
 * Shows the overall training indicator plus counts and one top recommendation,
 * with a link out to /progress for the full breakdown.
 */
export function DashboardProgressSummary() {
  const { completed, completedCount } = useLearningProgress();
  const { allAttempts } = useQuizAttempts();
  const investigationCompletions = useInvestigationCompletions();

  const skillProgresses = calculateAllSkillProgress(completed, allAttempts, investigationCompletions);
  const overall = calculateOverallTrainingProgress(skillProgresses);
  const [topRecommendation] = getRecommendations(
    { completedTopics: completed, quizAttemptsMap: allAttempts, investigationCompletions, skillProgresses },
    1,
  );
  const quizzesAttempted = Object.values(allAttempts).filter((attempts) => attempts.length > 0).length;

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SectionHeading title="Your Learning Progress" />
        <div className="flex gap-4 text-sm font-medium">
          <Link href="/progress" className="text-blue-600 hover:underline dark:text-blue-400">
            View full progress →
          </Link>
          <Link href="/analytics" className="text-blue-600 hover:underline dark:text-blue-400">
            View analytics →
          </Link>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Overall training indicator</p>
          <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">{overall}%</p>
        </div>
        <div className="flex flex-wrap gap-5 text-sm text-slate-500 dark:text-slate-400">
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {completedCount}/{learningTopics.length}
            </p>
            <p>Topics</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {quizzesAttempted}/{quizzes.length}
            </p>
            <p>Assessments</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {investigationCompletions.length}/{investigationScenarios.length}
            </p>
            <p>Investigations</p>
          </div>
        </div>
      </div>
      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
        <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${overall}%` }} />
      </div>

      {topRecommendation && (
        <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Recommended next step</p>
          <Link
            href={topRecommendation.href}
            className="mt-1 block text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
          >
            {topRecommendation.title} →
          </Link>
          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{topRecommendation.description}</p>
        </div>
      )}
    </Card>
  );
}
