"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { PageHeader } from "@/components/PageHeader";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import { LearnerIdentityBadge, AttentionIndicator, AssignmentStatusBadge } from "@/components/admin/AdminBadges";
import { useAdminRoster } from "@/lib/adminRoster";
import { useAdminProgrammes } from "@/lib/adminProgrammes";
import { useAdminAssignments, statusForAssignment, learnersForAssignment } from "@/lib/adminAssignments";
import { useAdminCohorts } from "@/lib/adminCohorts";
import { computeLearnerAttentionFlags } from "@/lib/adminRiskSignals";
import { calculateAllSkillProgress, calculateOverallTrainingProgress } from "@/lib/skillProgress";
import { computeActivityTimeline } from "@/lib/analytics/activityTimeline";
import { buildMilestoneEvaluationContext } from "@/lib/milestoneUnlocks";
import { milestoneDefinitions, getEligibleMilestoneIds } from "@/lib/data/milestones";
import { certificatePrograms, isCertificateProgramEligible } from "@/lib/data/certificatePrograms";
import { trainingAssignments } from "@/lib/data/assignments";
import { computeAssignmentProgress } from "@/lib/assignmentProgress";
import { automationLabScenarios, getAutomationLabScenarioById } from "@/lib/data/automationLab";
import { getScenarioById } from "@/lib/data/investigations";
import { getQuizById } from "@/lib/data/quizzes";
import { bestAttempt } from "@/lib/quizAttempts";

export default function AdminLearnerDetailPage() {
  const params = useParams<{ learnerId: string }>();
  const { learners } = useAdminRoster();
  const { programmes } = useAdminProgrammes();
  const { assignments } = useAdminAssignments();
  const { cohorts } = useAdminCohorts();

  const learner = learners.find((l) => l.id === params.learnerId);

  const skillProgresses = useMemo(
    () => (learner ? calculateAllSkillProgress(learner.completedTopics, learner.quizAttemptsMap, learner.investigationCompletions, learner.automationLabCompletions) : []),
    [learner],
  );
  const readiness = useMemo(() => calculateOverallTrainingProgress(skillProgresses), [skillProgresses]);
  const flags = useMemo(() => (learner ? computeLearnerAttentionFlags(learner, skillProgresses, assignments, cohorts) : []), [learner, skillProgresses, assignments, cohorts]);
  const timeline = useMemo(
    () => (learner ? computeActivityTimeline(learner.quizAttemptsMap, learner.investigationCompletions, learner.automationLabAttemptsMap) : []),
    [learner],
  );

  const programme = learner?.programmeId ? programmes.find((p) => p.id === learner.programmeId) : undefined;
  const programmeProgress = useMemo(
    () => (learner && programme ? computeAssignmentProgress(programme, learner.completedTopics, learner.quizAttemptsMap, learner.investigationCompletions, learner.automationLabCompletions) : null),
    [learner, programme],
  );

  const learnerAssignments = useMemo(() => {
    if (!learner) return [];
    return assignments.filter((a) => {
      const cohort = cohorts.find((c) => c.id === a.targetId);
      return learnersForAssignment(a, [learner], cohort?.memberLearnerIds ?? []).length > 0;
    });
  }, [learner, assignments, cohorts]);

  const eligibleMilestones = useMemo(() => {
    if (!learner) return [];
    const assignmentProgresses = trainingAssignments.map((a) => computeAssignmentProgress(a, learner.completedTopics, learner.quizAttemptsMap, learner.investigationCompletions, learner.automationLabCompletions));
    const ctx = buildMilestoneEvaluationContext({
      completedTopics: learner.completedTopics,
      quizAttemptsMap: learner.quizAttemptsMap,
      investigationCompletions: learner.investigationCompletions,
      automationLabCompletions: learner.automationLabCompletions,
      skillProgresses,
      assignmentProgresses,
      totalActivityCount: timeline.length,
    });
    const eligibleIds = new Set(getEligibleMilestoneIds(ctx));
    return milestoneDefinitions.filter((m) => eligibleIds.has(m.id));
  }, [learner, skillProgresses, timeline]);

  const earnedCertificates = useMemo(() => {
    if (!learner) return [];
    return certificatePrograms.filter((p) => isCertificateProgramEligible(p, { completedTopics: learner.completedTopics, quizAttemptsMap: learner.quizAttemptsMap }));
  }, [learner]);

  const projectScenarioIds = new Set(automationLabScenarios.filter((s) => s.isEnterpriseProject).map((s) => s.id));

  if (!learner) {
    return (
      <Card>
        <EmptyState title="Learner not found" description="This learner may no longer exist in the current roster." />
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Enterprise Admin · Learner"
        title={learner.name}
        description={
          <span className="flex flex-wrap items-center gap-2">
            <LearnerIdentityBadge isYou={learner.isYou} />
            {programme && <Badge variant="accent">{programme.title}</Badge>}
            <AttentionIndicator flags={flags} />
          </span>
        }
        accent="from-slate-500/10 via-blue-500/10 to-transparent"
      />

      {flags.length > 0 && (
        <Card>
          <SectionHeading title="Attention flags" subtitle="Deterministic, explainable — never an opaque score" />
          <ul className="space-y-2 text-sm">
            {flags.map((f) => (
              <li key={f.kind} className="flex items-start gap-2">
                <Badge variant={f.severity === "high" ? "danger" : "warning"}>{f.kind.replace(/-/g, " ")}</Badge>
                <span className="text-slate-700 dark:text-slate-300">{f.reason}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <SectionHeading title="Overall readiness" />
          <p className="text-3xl font-bold text-slate-900 dark:text-slate-100">{readiness}%</p>
          {programmeProgress && (
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Programme completion: {programmeProgress.overallCompletion}% ({programme?.title})
            </p>
          )}
        </Card>
        <Card>
          <SectionHeading title="Competency profile" />
          <ul className="space-y-1.5 text-sm">
            {skillProgresses.map((s) => (
              <li key={s.skill.id} className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300">{s.skill.name}</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {s.level} · {s.overall}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card>
        <SectionHeading title="Quizzes" />
        {Object.keys(learner.quizAttemptsMap).length === 0 ? (
          <EmptyState title="No quiz attempts yet" />
        ) : (
          <ul className="space-y-1.5 text-sm">
            {Object.entries(learner.quizAttemptsMap).map(([quizId, attempts]) => {
              const quiz = getQuizById(quizId);
              const best = bestAttempt(attempts);
              return (
                <li key={quizId} className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300">{quiz?.title ?? quizId}</span>
                  <span className="text-slate-500 dark:text-slate-400">
                    Best {best?.percentage}% · {attempts.length} attempt{attempts.length === 1 ? "" : "s"}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </Card>

      <Card>
        <SectionHeading title="Investigations & Projects" />
        {learner.investigationCompletions.length === 0 && learner.automationLabCompletions.length === 0 ? (
          <EmptyState title="No practical work completed yet" />
        ) : (
          <ul className="space-y-1.5 text-sm">
            {learner.investigationCompletions.map((c) => (
              <li key={c.scenarioId} className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300">{getScenarioById(c.scenarioId)?.title ?? c.scenarioId}</span>
                <span className="text-slate-500 dark:text-slate-400">
                  {c.score}% · {c.resultCategory}
                </span>
              </li>
            ))}
            {learner.automationLabCompletions.map((c) => (
              <li key={c.scenarioId} className="flex items-center justify-between">
                <span className="text-slate-700 dark:text-slate-300">
                  {getAutomationLabScenarioById(c.scenarioId)?.title ?? c.scenarioId}
                  {projectScenarioIds.has(c.scenarioId) && (
                    <Badge variant="accent">Enterprise Project</Badge>
                  )}
                </span>
                <span className="text-slate-500 dark:text-slate-400">{c.score}%</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <SectionHeading title="Assignments" />
        {learnerAssignments.length === 0 ? (
          <EmptyState title="No assignments issued yet" />
        ) : (
          <ul className="space-y-2 text-sm">
            {learnerAssignments.map((a) => (
              <li key={a.id} className="flex items-center justify-between rounded-lg border border-slate-200 p-2.5 dark:border-slate-800">
                <span className="text-slate-700 dark:text-slate-300">{a.requirementTitle}</span>
                <AssignmentStatusBadge status={statusForAssignment(a, learner)} />
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card>
        <SectionHeading title="Achievements & Certificates" subtitle="Computed live from evidence — the same deterministic engine as the Skills Passport" />
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Milestones ({eligibleMilestones.length})</p>
            {eligibleMilestones.length === 0 ? <p className="text-xs text-slate-400">None yet.</p> : (
              <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                {eligibleMilestones.map((m) => <li key={m.id}>{m.title}</li>)}
              </ul>
            )}
          </div>
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Certificates ({earnedCertificates.length})</p>
            {earnedCertificates.length === 0 ? <p className="text-xs text-slate-400">None yet.</p> : (
              <ul className="space-y-1 text-sm text-slate-700 dark:text-slate-300">
                {earnedCertificates.map((c) => <li key={c.id}>{c.title}</li>)}
              </ul>
            )}
          </div>
        </div>
      </Card>

      <Card>
        <SectionHeading title="Recent activity" />
        {timeline.length === 0 ? (
          <EmptyState title="No recorded activity yet" />
        ) : (
          <ul className="space-y-1.5 text-sm">
            {[...timeline]
              .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
              .slice(0, 10)
              .map((e) => (
                <li key={e.id} className="flex items-center justify-between">
                  <span className="text-slate-700 dark:text-slate-300">{e.title}</span>
                  <span className="text-slate-500 dark:text-slate-400">{new Date(e.timestamp).toLocaleDateString()}</span>
                </li>
              ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
