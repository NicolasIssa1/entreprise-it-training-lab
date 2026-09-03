"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { MetricCard } from "@/components/MetricCard";
import { BookIcon, BeakerIcon, ChartIcon, TargetIcon } from "@/components/icons";
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
 * Shows the overall training indicator, a metric row, and one top
 * recommendation, with a link out to /progress for the full breakdown. All
 * numbers are the same derived values Progress/Analytics already compute —
 * nothing here is a second stored score.
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

  // Circumference-based ring for the overall % — plain inline SVG, no chart library.
  const radius = 30;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (overall / 100) * circumference;

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

      <div className="flex flex-wrap items-center gap-6">
        <div className="relative flex h-20 w-20 shrink-0 items-center justify-center">
          <svg viewBox="0 0 72 72" className="h-20 w-20 -rotate-90">
            <circle cx="36" cy="36" r={radius} fill="none" strokeWidth="7" className="stroke-slate-100 dark:stroke-slate-800" />
            <circle
              cx="36"
              cy="36"
              r={radius}
              fill="none"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              className="stroke-blue-600 transition-all duration-700 ease-out dark:stroke-blue-400"
            />
          </svg>
          <span className="absolute text-lg font-bold text-slate-900 dark:text-slate-100">{overall}%</span>
        </div>

        <div className="grid flex-1 grid-cols-3 gap-3">
          <MetricCard
            label="Topics"
            value={`${completedCount}/${learningTopics.length}`}
            icon={<BookIcon size={16} />}
            accentClass="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
          />
          <MetricCard
            label="Assessments"
            value={`${quizzesAttempted}/${quizzes.length}`}
            icon={<ChartIcon size={16} />}
            accentClass="bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300"
          />
          <MetricCard
            label="Investigations"
            value={`${investigationCompletions.length}/${investigationScenarios.length}`}
            icon={<BeakerIcon size={16} />}
            accentClass="bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300"
          />
        </div>
      </div>

      {topRecommendation && (
        <Link
          href={topRecommendation.href}
          className="mt-5 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md dark:border-blue-900 dark:bg-blue-950/30"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 text-white">
            <TargetIcon size={16} />
          </span>
          <span>
            <span className="block text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-400">
              Next best action
            </span>
            <span className="mt-0.5 block text-sm font-medium text-slate-900 dark:text-slate-100">
              {topRecommendation.title}
            </span>
            <span className="mt-0.5 block text-xs text-slate-600 dark:text-slate-400">{topRecommendation.description}</span>
          </span>
        </Link>
      )}
    </Card>
  );
}
