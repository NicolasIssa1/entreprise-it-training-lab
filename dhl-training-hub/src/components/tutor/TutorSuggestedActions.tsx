"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { useLearningProgress } from "@/lib/learningProgress";
import { useQuizAttempts } from "@/lib/quizAttempts";
import { useInvestigationCompletions } from "@/lib/investigationProgress";
import { useAutomationLabAttempts, getAutomationLabCompletions } from "@/lib/automationLabProgress";
import { calculateAllSkillProgress } from "@/lib/skillProgress";
import { getRecommendations } from "@/lib/recommendations";

/**
 * "Suggested next steps" (Phase 14 section 5) — reuses the existing
 * deterministic recommendation engine (lib/recommendations.ts) verbatim,
 * the same one the Dashboard and Skills Passport already show. The Tutor's
 * own replies may explain/reinforce these in words, but the actions
 * themselves are always this app's own engine output, never something the
 * model generates — see root CLAUDE.md's Phase 14 section 5.
 */
export function TutorSuggestedActions() {
  const { completed } = useLearningProgress();
  const { allAttempts } = useQuizAttempts();
  const investigationCompletions = useInvestigationCompletions();
  const { allAttempts: allAutomationLabAttempts } = useAutomationLabAttempts();
  const automationLabCompletions = getAutomationLabCompletions(allAutomationLabAttempts);

  const skillProgresses = calculateAllSkillProgress(completed, allAttempts, investigationCompletions, automationLabCompletions);
  const recommendations = getRecommendations({ completedTopics: completed, quizAttemptsMap: allAttempts, investigationCompletions, skillProgresses, automationLabCompletions }, 3);

  if (recommendations.length === 0) return null;

  return (
    <Card>
      <SectionHeading title="Suggested next steps" subtitle="From this app's own recommendation engine — not the Tutor" />
      <ul className="space-y-1.5">
        {recommendations.map((r) => (
          <li key={r.id}>
            <Link
              href={r.href}
              className="block rounded-lg border border-slate-200 p-2.5 text-sm transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/20"
            >
              <span className="font-medium text-slate-900 dark:text-slate-100">{r.title}</span>
              <span className="mt-0.5 block text-xs text-slate-500 dark:text-slate-400">{r.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </Card>
  );
}
