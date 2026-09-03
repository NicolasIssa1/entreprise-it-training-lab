"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHeader } from "@/components/PageHeader";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { QuizCard } from "@/components/QuizCard";
import { quizzes } from "@/lib/data/quizzes";
import { useQuizAttempts, bestAttempt, latestAttempt } from "@/lib/quizAttempts";
import { useLearningProgress } from "@/lib/learningProgress";
import { useInvestigationCompletions } from "@/lib/investigationProgress";
import { calculateAllSkillProgress } from "@/lib/skillProgress";
import { getRecommendations } from "@/lib/recommendations";

export default function QuizzesPage() {
  const { allAttempts } = useQuizAttempts();
  const { completed } = useLearningProgress();
  const investigationCompletions = useInvestigationCompletions();

  const skillProgresses = calculateAllSkillProgress(completed, allAttempts, investigationCompletions);
  const recommendations = getRecommendations(
    { completedTopics: completed, quizAttemptsMap: allAttempts, investigationCompletions, skillProgresses },
    8,
  ).filter((r) => r.href.startsWith("/quizzes"));

  const foundationQuizzes = quizzes.filter((q) => q.id.endsWith("-foundation"));
  const checkpointQuizzes = quizzes.filter((q) => !q.id.endsWith("-foundation"));

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Assessments"
        title="Prove it, don't just recognize it."
        description="Scenario-based questions that test applied judgment — never bare definitions — with detailed answer review and unlimited retakes."
        accent="from-emerald-500/15 via-teal-500/10 to-transparent"
      />
      <PrivacyNotice context="These are fictional, generic knowledge checks — not real DHL data or terminology." />

      {recommendations.length > 0 && (
        <section className="space-y-3">
          <SectionHeading title="Recommended for you" subtitle="Based on your recent activity — no AI involved" />
          <div className="grid gap-3 sm:grid-cols-2">
            {recommendations.map((r) => (
              <Link key={r.id} href={r.href} className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
                <Card className="h-full border-blue-200 bg-blue-50/60 dark:border-blue-900 dark:bg-blue-950/30" interactive>
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{r.title}</p>
                  <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{r.description}</p>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="space-y-3">
        <SectionHeading title="Foundation Assessments" subtitle="One per major skill area" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {foundationQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              best={bestAttempt(allAttempts[quiz.id] ?? [])}
              latest={latestAttempt(allAttempts[quiz.id] ?? [])}
            />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <SectionHeading title="Learning Path Checkpoints" subtitle="One checkpoint assessment per Learning Path" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {checkpointQuizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              best={bestAttempt(allAttempts[quiz.id] ?? [])}
              latest={latestAttempt(allAttempts[quiz.id] ?? [])}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
