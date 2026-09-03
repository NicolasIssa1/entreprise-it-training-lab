"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { PageGroupHeading } from "@/components/PageGroupHeading";
import { PageHeader } from "@/components/PageHeader";
import { MetricCard } from "@/components/MetricCard";
import { Disclaimer } from "@/components/Disclaimer";
import { EmptyState } from "@/components/EmptyState";
import { BookIcon, LayersIcon, ChartIcon, BeakerIcon } from "@/components/icons";
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
      <PageHeader
        eyebrow="Analytics"
        title="Understand how your training is developing."
        description={
          <>
            What you&rsquo;ve done and how your training is developing — for what to learn next, see{" "}
            <Link href="/progress" className="font-medium underline">
              Training Progress
            </Link>
            .
          </>
        }
        accent="from-cyan-500/15 via-blue-500/10 to-transparent"
        actions={
          <>
            <Link
              href="/analytics/summary"
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Shareable Summary
            </Link>
            <Link
              href="/manager-preview"
              className="inline-flex items-center rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors duration-200 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
            >
              Manager Preview
            </Link>
          </>
        }
      />

      <Disclaimer>
        These are educational progress indicators inside this training application — not a validated professional
        competency assessment, official certification, or measure of job readiness.
      </Disclaimer>

      <PageGroupHeading label="Training Overview" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          label="Topics completed"
          value={`${overview.topicsCompleted}/${overview.topicsTotal}`}
          icon={<BookIcon size={16} />}
          accentClass="bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300"
        />
        <MetricCard
          label="Learning paths"
          value={`${overview.pathsCompleted} done`}
          hint={`${overview.pathsInProgress} in progress`}
          icon={<LayersIcon size={16} />}
          accentClass="bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300"
        />
        <MetricCard
          label="Assessments attempted"
          value={`${overview.quizzesAttempted}/${overview.quizzesTotal}`}
          icon={<ChartIcon size={16} />}
          accentClass="bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300"
        />
        <MetricCard
          label="Investigations completed"
          value={`${overview.investigationsCompleted}/${overview.investigationsTotal}`}
          icon={<BeakerIcon size={16} />}
          accentClass="bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300"
        />
      </div>
      <Card>
        <div className="flex items-center gap-3">
          <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-2.5 rounded-full bg-blue-600 transition-all duration-700 ease-out" style={{ width: `${overview.overallProgress}%` }} />
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
