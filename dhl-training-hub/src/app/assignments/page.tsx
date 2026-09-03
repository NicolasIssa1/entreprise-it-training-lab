"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { PageHeader } from "@/components/PageHeader";
import { Disclaimer } from "@/components/Disclaimer";
import { AssignmentProgressSummary } from "@/components/AssignmentProgressSummary";
import { AskTutorLink } from "@/components/AskTutorLink";
import { buildAssignmentTutorPrompt } from "@/lib/ai/tutorPromptTemplates";
import { getPathById } from "@/lib/data/learning";
import { getQuizById } from "@/lib/data/quizzes";
import { getScenarioById } from "@/lib/data/investigations";
import { useLearningProgress } from "@/lib/learningProgress";
import { useQuizAttempts } from "@/lib/quizAttempts";
import { useInvestigationCompletions } from "@/lib/investigationProgress";
import { useSelectedAssignment } from "@/lib/assignmentSelection";
import { computeAssignmentProgress } from "@/lib/assignmentProgress";

/**
 * Training Assignments (Phase 9 Part D/E/F) — static, config-driven templates
 * (see lib/data/assignments.ts) the learner can browse and activate one of for
 * themselves. Not organization-wide manager functionality: there is exactly one
 * "current assignment" preference, stored locally (see useSelectedAssignment),
 * and completion is only completion against each template's required list —
 * never a new competency score.
 */
export default function AssignmentsPage() {
  const { completed } = useLearningProgress();
  const { allAttempts } = useQuizAttempts();
  const investigationCompletions = useInvestigationCompletions();
  const { assignmentId, assignments, selectAssignment, clearAssignment } = useSelectedAssignment();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Assignments"
        title="Structured training programs, ready to activate."
        description="Curated templates bundling required learning paths, assessments, and investigations — activate one to get a focused, trackable list of what to work through next."
        accent="from-indigo-500/15 via-blue-500/10 to-transparent"
      />

      <Disclaimer>
        These are generic templates, not company-specific programs. Activating one is a personal preference stored on
        this device — there is no organization-wide manager view yet.
      </Disclaimer>

      <div className="grid gap-5 lg:grid-cols-2">
        {assignments.map((assignment) => {
          const isActive = assignmentId === assignment.id;
          const progress = computeAssignmentProgress(assignment, completed, allAttempts, investigationCompletions);

          return (
            <Card key={assignment.id} className={isActive ? "border-blue-400 ring-1 ring-blue-400/40" : ""}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  {isActive && <Badge variant="accent">Active</Badge>}
                  <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">{assignment.title}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{assignment.audience}</p>
                </div>
                {isActive ? (
                  <button
                    onClick={clearAssignment}
                    className="shrink-0 rounded-lg border border-slate-300 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  >
                    Deactivate
                  </button>
                ) : (
                  <button
                    onClick={() => selectAssignment(assignment.id)}
                    className="shrink-0 rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    Activate
                  </button>
                )}
              </div>

              <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{assignment.purpose}</p>
              <p className="mt-2 text-xs font-medium text-slate-500 dark:text-slate-400">{assignment.estimatedScope}</p>

              <div className="mt-4 space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Required learning paths</p>
                <div className="flex flex-wrap gap-1.5">
                  {assignment.requiredPathIds.map((id) => {
                    const path = getPathById(id);
                    return path ? (
                      <span key={id} className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 dark:border-slate-700 dark:text-slate-400">
                        {path.title}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Required assessments</p>
                <div className="flex flex-wrap gap-1.5">
                  {assignment.requiredQuizIds.map((id) => {
                    const quiz = getQuizById(id);
                    return quiz ? (
                      <Link
                        key={id}
                        href={`/quizzes/${id}`}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                      >
                        {quiz.title}
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>
              <div className="mt-3 space-y-1.5">
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Required investigations</p>
                <div className="flex flex-wrap gap-1.5">
                  {assignment.requiredScenarioIds.map((id) => {
                    const scenario = getScenarioById(id);
                    return scenario ? (
                      <Link
                        key={id}
                        href={`/tickets/investigate/${id}`}
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800"
                      >
                        {scenario.title}
                      </Link>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-800">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <SectionHeading title="Your progress against this template" />
                  <AskTutorLink params={{ mode: "progress-coach", prompt: buildAssignmentTutorPrompt(assignment) }}>
                    Ask Tutor →
                  </AskTutorLink>
                </div>
                <AssignmentProgressSummary progress={progress} />
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
