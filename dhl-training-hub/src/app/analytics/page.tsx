"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { PageGroupHeading } from "@/components/PageGroupHeading";
import { Disclaimer } from "@/components/Disclaimer";
import { EmptyState } from "@/components/EmptyState";
import { AskTutorLink } from "@/components/AskTutorLink";
import { SkillAnalyticsCard } from "@/components/analytics/SkillAnalyticsCard";
import { QuizAnalyticsCard } from "@/components/analytics/QuizAnalyticsCard";
import { InvestigationAnalyticsSummary } from "@/components/analytics/InvestigationAnalyticsSummary";
import { LearningPathAnalyticsCard } from "@/components/analytics/LearningPathAnalyticsCard";
import { ActivityTimelineList } from "@/components/analytics/ActivityTimelineList";
import { TrendSparkline } from "@/components/analytics/TrendSparkline";
import { useLearningProgress } from "@/lib/learningProgress";
import { useQuizAttempts } from "@/lib/quizAttempts";
import { useInvestigationCompletions } from "@/lib/investigationProgress";
import {
  computeTrainingOverview,
  computeSkillAnalytics,
  computeQuizAnalytics,
  computeInvestigationAnalytics,
  computeLearningPathAnalytics,
  computeActivityTimeline,
  computeWeeklyActivityCounts,
} from "@/lib/analytics";

export default function AnalyticsPage() {
  const { completed } = useLearningProgress();
  const { allAttempts } = useQuizAttempts();
  const investigationCompletions = useInvestigationCompletions();

  const skills = computeSkillAnalytics(completed, allAttempts, investigationCompletions);
  const overview = computeTrainingOverview(completed, allAttempts, investigationCompletions, skills.map((s) => s.progress));
  const quizAnalytics = computeQuizAnalytics(allAttempts);
  const attemptedQuizAnalytics = quizAnalytics.filter((q) => q.attemptCount > 0);
  const investigationAnalytics = computeInvestigationAnalytics(investigationCompletions);
  const pathAnalytics = computeLearningPathAnalytics(completed, allAttempts, investigationCompletions);
  const timeline = computeActivityTimeline(allAttempts, investigationCompletions);
  const weeklyActivity = computeWeeklyActivityCounts(timeline);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Training Analytics</h1>
          <p className="mt-1 text-slate-600 dark:text-slate-400">
            What you&rsquo;ve done and how your training is developing — for what to learn next, see{" "}
            <Link href="/progress" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
              Training Progress
            </Link>
            .
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/analytics/summary"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Shareable Summary
          </Link>
          <Link
            href="/manager-preview"
            className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Manager Preview
          </Link>
        </div>
      </div>

      <Disclaimer>
        These are educational progress indicators inside this training application — not a validated professional
        competency assessment, official certification, or measure of job readiness.
      </Disclaimer>

      <PageGroupHeading label="Training Overview" />
      <Card>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <OverviewStat label="Topics completed" value={`${overview.topicsCompleted}/${overview.topicsTotal}`} />
          <OverviewStat label="Learning paths" value={`${overview.pathsCompleted} done, ${overview.pathsInProgress} in progress`} />
          <OverviewStat label="Assessments attempted" value={`${overview.quizzesAttempted}/${overview.quizzesTotal}`} />
          <OverviewStat label="Investigations completed" value={`${overview.investigationsCompleted}/${overview.investigationsTotal}`} />
        </div>
        <div className="mt-4 flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-2.5 rounded-full bg-blue-600 transition-all" style={{ width: `${overview.overallProgress}%` }} />
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{overview.overallProgress}% overall</p>
        </div>
      </Card>

      <PageGroupHeading label="Skills" />
      <section className="space-y-3">
        <SectionHeading title="Skill Analytics" subtitle="Training indicator, evidence breakdown, and a suggested next step per skill" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((entry) => (
            <SkillAnalyticsCard key={entry.progress.skill.id} entry={entry} />
          ))}
        </div>
      </section>

      <PageGroupHeading label="Assessments" />
      <section className="space-y-3">
        <SectionHeading title="Quiz Analytics" subtitle="Latest/best score, attempt count, and trend where you have 2+ attempts" />
        {attemptedQuizAnalytics.length === 0 ? (
          <EmptyState title="No quiz attempts yet" description="Complete an assessment to see score trends." />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {attemptedQuizAnalytics.map((entry) => (
              <QuizAnalyticsCard key={entry.quiz.id} entry={entry} />
            ))}
          </div>
        )}
      </section>

      <PageGroupHeading label="Advanced Investigations" />
      <section className="space-y-3">
        <SectionHeading title="Investigation Analytics" subtitle="Training performance across completed scenarios, grouped by area" />
        <InvestigationAnalyticsSummary analytics={investigationAnalytics} />
      </section>

      <PageGroupHeading label="Learning Paths" />
      <section className="space-y-3">
        <SectionHeading title="Learning Path Analytics" subtitle="Progress, checkpoint result, and related practice per path — nothing here is hard-locked" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pathAnalytics.map((entry) => (
            <LearningPathAnalyticsCard key={entry.path.id} entry={entry} />
          ))}
        </div>
      </section>

      <PageGroupHeading label="Activity" />
      <section className="space-y-3">
        <SectionHeading
          title="Activity Timeline"
          subtitle="Built only from structured, timestamped quiz and investigation records — never Daily Log, CV Tracker, or Tutor text"
        />
        {weeklyActivity.length > 0 && (
          <Card>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-400">Activity by week</p>
            <TrendSparkline
              points={weeklyActivity.map((w) => ({ label: w.weekStart, value: w.count }))}
              ariaLabel="Training activity events per week"
              formatValue={(v) => `${v} event${v === 1 ? "" : "s"}`}
            />
          </Card>
        )}
        <Card>
          <ActivityTimelineList events={timeline.slice(0, 20)} />
        </Card>
      </section>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHeading title="Ask the Tutor about your analytics" subtitle="Explains what's already here — never invents a new score" />
          <AskTutorLink params={{ mode: "progress-coach" }} variant="button">
            Ask Tutor to explain my analytics
          </AskTutorLink>
        </div>
      </Card>
    </div>
  );
}

function OverviewStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
      <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">{value}</p>
    </div>
  );
}
