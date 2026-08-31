"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Disclaimer } from "@/components/Disclaimer";
import { SkillAnalyticsCard } from "@/components/analytics/SkillAnalyticsCard";
import { PrintSummaryButton } from "@/components/PrintSummaryButton";
import { AssignmentProgressSummary } from "@/components/AssignmentProgressSummary";
import { useLearningProgress } from "@/lib/learningProgress";
import { useQuizAttempts } from "@/lib/quizAttempts";
import { useInvestigationCompletions } from "@/lib/investigationProgress";
import { useSelectedAssignment } from "@/lib/assignmentSelection";
import { computeAssignmentProgress } from "@/lib/assignmentProgress";
import { computeTrainingSummary } from "@/lib/analytics";
import { getRecommendations } from "@/lib/recommendations";
import { internshipState } from "@/lib/data/internshipState";

/**
 * Pilot Report (Phase 9 Part I) — a structured summary suitable for
 * demonstrating this product to a manager, distinct from /analytics/summary:
 * this page is assignment-centric (what was assigned, how much is done)
 * rather than a general activity summary. Reuses computeTrainingSummary() and
 * getRecommendations() rather than a second derivation, same as every other
 * Phase 8/9 reporting page. Excludes Daily Log, CV Tracker, and Tutor
 * conversation content by construction (never imported here).
 */
export default function PilotReportPage() {
  const { completed } = useLearningProgress();
  const { allAttempts } = useQuizAttempts();
  const investigationCompletions = useInvestigationCompletions();
  const { selectedAssignment } = useSelectedAssignment();

  const summary = computeTrainingSummary(completed, allAttempts, investigationCompletions);
  const assignmentProgress = selectedAssignment
    ? computeAssignmentProgress(selectedAssignment, completed, allAttempts, investigationCompletions)
    : null;
  const recommendations = getRecommendations(
    {
      completedTopics: completed,
      quizAttemptsMap: allAttempts,
      investigationCompletions,
      skillProgresses: summary.skills.map((s) => s.progress),
      assignmentProgress,
    },
    5,
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-3 print:hidden">
        <Link href="/pilot" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          ← Back to Pilot
        </Link>
        <PrintSummaryButton />
      </div>

      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pilot Training Summary</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          {internshipState.organization} · {internshipState.role}
        </p>
      </div>

      <Disclaimer>
        Pilot training summary — not a certification or employee performance evaluation. Daily Log entries, CV
        Achievement descriptions, and AI Tutor conversations are excluded from this report.
      </Disclaimer>

      {assignmentProgress ? (
        <Card>
          <SectionHeading title="Assigned training" subtitle={assignmentProgress.assignment.title} />
          <p className="text-sm text-slate-700 dark:text-slate-300">{assignmentProgress.assignment.purpose}</p>
          <div className="mt-4">
            <AssignmentProgressSummary progress={assignmentProgress} />
          </div>
        </Card>
      ) : (
        <Card>
          <SectionHeading title="Assigned training" />
          <p className="text-sm text-slate-500 dark:text-slate-400">
            No Training Assignment is currently activated. <Link href="/assignments" className="font-medium text-blue-600 hover:underline dark:text-blue-400">Browse assignment templates →</Link>
          </p>
        </Card>
      )}

      <Card>
        <SectionHeading title="Overall training activity" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-sm">
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Topics completed</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {summary.overview.topicsCompleted}/{summary.overview.topicsTotal}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Quizzes attempted</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {summary.overview.quizzesAttempted}/{summary.overview.quizzesTotal}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Investigations completed</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {summary.overview.investigationsCompleted}/{summary.overview.investigationsTotal}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Overall progress</p>
            <p className="font-semibold text-slate-900 dark:text-slate-100">{summary.overview.overallProgress}%</p>
          </div>
        </div>
      </Card>

      <section className="space-y-3">
        <SectionHeading title="Skill indicators" subtitle="Educational progress indicators — not a validated competency assessment" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summary.skills.map((entry) => (
            <SkillAnalyticsCard key={entry.progress.skill.id} entry={entry} />
          ))}
        </div>
      </section>

      <Card>
        <SectionHeading title="Recommended next steps" subtitle="Deterministic suggestions from this app's recommendation engine — no AI" />
        {recommendations.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No recommendations right now.</p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {recommendations.map((r) => (
              <Card key={r.id} className="border-slate-100 dark:border-slate-800">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{r.title}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{r.description}</p>
              </Card>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
