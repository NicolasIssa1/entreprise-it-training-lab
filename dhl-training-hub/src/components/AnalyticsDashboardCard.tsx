"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { useLearningProgress } from "@/lib/learningProgress";
import { useQuizAttempts } from "@/lib/quizAttempts";
import { useInvestigationCompletions } from "@/lib/investigationProgress";
import { computeSkillAnalytics, computeTrainingOverview } from "@/lib/analytics";

/**
 * Lightweight Dashboard entry point into /analytics (Phase 8 Part M) —
 * deliberately small (three counts + a link), distinct from
 * DashboardProgressSummary (which links to /progress: "what should I learn
 * next?"). This answers "what have I done?" instead — see
 * docs/ANALYTICS.md's /progress-vs-/analytics note.
 */
export function AnalyticsDashboardCard() {
  const { completed } = useLearningProgress();
  const { allAttempts } = useQuizAttempts();
  const investigationCompletions = useInvestigationCompletions();

  const skills = computeSkillAnalytics(completed, allAttempts, investigationCompletions);
  const overview = computeTrainingOverview(completed, allAttempts, investigationCompletions, skills.map((s) => s.progress));

  return (
    <Card>
      <div className="flex items-center justify-between">
        <SectionHeading title="Training Analytics" />
        <Link href="/analytics" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          View analytics →
        </Link>
      </div>
      <div className="flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400">
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">
            {overview.topicsCompleted}/{overview.topicsTotal}
          </p>
          <p>Topics completed</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{overview.quizzesAttempted}</p>
          <p>Assessments taken</p>
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-slate-100">{overview.investigationsCompleted}</p>
          <p>Investigations completed</p>
        </div>
      </div>
    </Card>
  );
}
