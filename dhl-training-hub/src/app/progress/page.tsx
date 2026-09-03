"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHeader } from "@/components/PageHeader";
import { Disclaimer } from "@/components/Disclaimer";
import { SkillCard } from "@/components/SkillCard";
import { AskTutorLink } from "@/components/AskTutorLink";
import { buildProgressTutorPrompt } from "@/lib/ai/tutorPromptTemplates";
import { learningTopics } from "@/lib/data/learning";
import { quizzes } from "@/lib/data/quizzes";
import { investigationScenarios } from "@/lib/data/investigations";
import { useLearningProgress } from "@/lib/learningProgress";
import { useQuizAttempts } from "@/lib/quizAttempts";
import { useInvestigationCompletions } from "@/lib/investigationProgress";
import { calculateAllSkillProgress, calculateOverallTrainingProgress } from "@/lib/skillProgress";
import { getRecommendations } from "@/lib/recommendations";

export default function ProgressPage() {
  const { completed, completedCount } = useLearningProgress();
  const { allAttempts } = useQuizAttempts();
  const investigationCompletions = useInvestigationCompletions();

  const skillProgresses = calculateAllSkillProgress(completed, allAttempts, investigationCompletions);
  const overall = calculateOverallTrainingProgress(skillProgresses);
  const recommendations = getRecommendations({
    completedTopics: completed,
    quizAttemptsMap: allAttempts,
    investigationCompletions,
    skillProgresses,
  });

  const quizzesAttempted = Object.values(allAttempts).filter((attempts) => attempts.length > 0).length;

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Progress"
        title="See how your training is developing."
        description={
          <>
            An educational progress indicator across your lessons, knowledge checks, and practical investigations.
            For a fuller breakdown — quiz trends, investigation history, a shareable summary — see{" "}
            <Link href="/analytics" className="font-medium underline">
              Training Analytics
            </Link>
            .
          </>
        }
        accent="from-blue-500/15 via-cyan-500/10 to-transparent"
      />

      <Disclaimer>
        These scores are educational progress indicators inside this training application. They are not validated
        measures of professional competence and do not certify job readiness.
      </Disclaimer>

      <Card>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Overall Training Progress</p>
            <p className="mt-1 text-3xl font-bold text-slate-900 dark:text-slate-100">{overall}%</p>
          </div>
          <div className="flex flex-wrap gap-6 text-sm text-slate-500 dark:text-slate-400">
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {completedCount}/{learningTopics.length}
              </p>
              <p>Topics completed</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {quizzesAttempted}/{quizzes.length}
              </p>
              <p>Assessments attempted</p>
            </div>
            <div>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {investigationCompletions.length}/{investigationScenarios.length}
              </p>
              <p>Investigations completed</p>
            </div>
          </div>
        </div>
        <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-2.5 rounded-full bg-blue-600 transition-all" style={{ width: `${overall}%` }} />
        </div>
      </Card>

      <section className="space-y-3">
        <SectionHeading
          title="Skill Breakdown"
          subtitle="Each skill combines completed lessons (30%), assessment results (30%), and practical investigation performance (40%)"
        />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skillProgresses.map((sp) => (
            <SkillCard key={sp.skill.id} progress={sp} />
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <SectionHeading title="Recommended Next Actions" subtitle="Deterministic suggestions based on your activity — no AI" />
          <AskTutorLink params={{ mode: "progress-coach", prompt: buildProgressTutorPrompt() }} variant="button">
            Ask Tutor to explain my recommendations
          </AskTutorLink>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {recommendations.map((r) => (
            <Link key={r.id} href={r.href} className="block rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40">
              <Card className="h-full" interactive>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{r.title}</p>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{r.description}</p>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <Card>
        <SectionHeading title="How this is calculated" />
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Each skill&rsquo;s training indicator combines completed relevant Learn topics (30%), your best
          knowledge-assessment results for that skill (30%), and your performance in relevant Advanced Investigations
          (40%) — weighted highest because applying knowledge to a realistic investigation is a stronger signal than a
          completion checkbox or a quiz alone. For example, your Networking indicator combines completed networking
          lessons, networking quiz results, and performance in networking-related troubleshooting investigations.
        </p>
      </Card>
    </div>
  );
}
