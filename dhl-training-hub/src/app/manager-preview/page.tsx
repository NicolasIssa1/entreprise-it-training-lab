"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHeader } from "@/components/PageHeader";
import { Disclaimer } from "@/components/Disclaimer";
import { SkillAnalyticsCard } from "@/components/analytics/SkillAnalyticsCard";
import { InvestigationAnalyticsSummary } from "@/components/analytics/InvestigationAnalyticsSummary";
import { PrintSummaryButton } from "@/components/PrintSummaryButton";
import { AssignmentProgressSummary } from "@/components/AssignmentProgressSummary";
import { useLearningProgress } from "@/lib/learningProgress";
import { useQuizAttempts } from "@/lib/quizAttempts";
import { useInvestigationCompletions } from "@/lib/investigationProgress";
import { computeTrainingSummary, computeInvestigationAnalytics } from "@/lib/analytics";
import { getRecommendations } from "@/lib/recommendations";
import { useSelectedAssignment } from "@/lib/assignmentSelection";
import { computeAssignmentProgress } from "@/lib/assignmentProgress";
import { internshipState } from "@/lib/data/internshipState";

/**
 * Read-only personal preview (Phase 8 Part J/K/L) — "what might a
 * trainer/manager see if the learner chose to share their progress?" This is
 * NOT a real multi-user manager account: there is no other-user data, no
 * cohort, no RLS bypass. It renders exactly the current signed-in learner's
 * own structured training evidence, reusing the same computeTrainingSummary
 * bundle as /analytics/summary so the numbers always match.
 *
 * Structured evidence only — Daily Log free text, CV Achievement
 * descriptions, and Tutor conversation content are never read by this page.
 */
export default function ManagerPreviewPage() {
  const { completed } = useLearningProgress();
  const { allAttempts } = useQuizAttempts();
  const investigationCompletions = useInvestigationCompletions();
  const { selectedAssignment } = useSelectedAssignment();

  const summary = computeTrainingSummary(completed, allAttempts, investigationCompletions);
  const investigationAnalytics = computeInvestigationAnalytics(investigationCompletions);
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
        <Link href="/analytics" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          ← Back to Analytics
        </Link>
        <PrintSummaryButton />
      </div>

      <PageHeader
        eyebrow="Manager Preview"
        title="Manager Preview"
        description={`${internshipState.organization} · ${internshipState.role}`}
        accent="from-slate-500/10 via-blue-500/10 to-transparent"
      />

      <Disclaimer>
        Preview only — this page displays your own training data. Multi-user manager accounts are not implemented
        yet; nobody else can view this, and this page never reads another user&rsquo;s data.
      </Disclaimer>
      <Disclaimer>
        This view contains structured training progress only. Daily Log entries, CV Achievement descriptions, and AI
        Tutor conversations are excluded — not a professional certification or validated competency assessment.
      </Disclaimer>

      <Card>
        <SectionHeading title="Learner summary" />
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

      {assignmentProgress && (
        <Card>
          <SectionHeading title="Current Training Assignment" subtitle={assignmentProgress.assignment.title} />
          <AssignmentProgressSummary progress={assignmentProgress} />
        </Card>
      )}

      <section className="space-y-3">
        <SectionHeading title="Skill indicators" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {summary.skills.map((entry) => (
            <SkillAnalyticsCard key={entry.progress.skill.id} entry={entry} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading title="Investigation results" />
        <InvestigationAnalyticsSummary analytics={investigationAnalytics} />
      </section>

      <Card>
        <SectionHeading title="Recommendations" subtitle="Deterministic suggestions from this app's recommendation engine — no AI" />
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
