"use client";

import { useMemo } from "react";
import { PageHeader } from "@/components/PageHeader";
import { Disclaimer } from "@/components/Disclaimer";
import { ReadinessScoreCard } from "@/components/ReadinessScoreCard";
import { MilestonesPanel } from "@/components/MilestonesPanel";
import { CertificatesPanel } from "@/components/CertificatesPanel";
import { CvEvidencePanel } from "@/components/CvEvidencePanel";
import { ProGate } from "@/components/ProGate";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import Link from "next/link";
import { useLearningProgress } from "@/lib/learningProgress";
import { useQuizAttempts } from "@/lib/quizAttempts";
import { useInvestigationCompletions } from "@/lib/investigationProgress";
import { useAutomationLabAttempts, getAutomationLabCompletions } from "@/lib/automationLabProgress";
import { calculateAllSkillProgress, calculateOverallTrainingProgress } from "@/lib/skillProgress";
import { buildReadinessProfile } from "@/lib/readiness";
import { computeActivityTimeline } from "@/lib/analytics/activityTimeline";
import { getRecommendations } from "@/lib/recommendations";
import { useFeature } from "@/lib/entitlements";
import { trainingAssignments } from "@/lib/data/assignments";
import { computeAssignmentProgress } from "@/lib/assignmentProgress";
import { buildMilestoneEvaluationContext, useMilestoneUnlocks } from "@/lib/milestoneUnlocks";
import { certificatePrograms } from "@/lib/data/certificatePrograms";
import { useCertificates } from "@/lib/certificates";
import { buildCvEvidenceItems } from "@/lib/cvEvidence";

/**
 * Skills Passport (Phase 11) — a hub bringing together the Readiness Score /
 * Skill-Gap Engine, Personalised Next Steps, Professional Milestones,
 * Certificates, and CV Evidence. Every number here is derived from the same
 * evidence sources /progress and /analytics already read (see the imports
 * above) — this page adds presentation and two small new persisted domains
 * (milestone unlock timestamps, certificate issue records), never a second
 * stored competency score.
 */
export default function PassportPage() {
  const { completed: completedTopics } = useLearningProgress();
  const { allAttempts: quizAttemptsMap } = useQuizAttempts();
  const investigationCompletions = useInvestigationCompletions();
  const { allAttempts: allAutomationLabAttempts } = useAutomationLabAttempts();
  const automationLabCompletions = useMemo(() => getAutomationLabCompletions(allAutomationLabAttempts), [allAutomationLabAttempts]);

  const skillProgresses = useMemo(
    () => calculateAllSkillProgress(completedTopics, quizAttemptsMap, investigationCompletions, automationLabCompletions),
    [completedTopics, quizAttemptsMap, investigationCompletions, automationLabCompletions],
  );
  const overall = useMemo(() => calculateOverallTrainingProgress(skillProgresses), [skillProgresses]);

  const recentActivity = useMemo(
    () => computeActivityTimeline(quizAttemptsMap, investigationCompletions, allAutomationLabAttempts),
    [quizAttemptsMap, investigationCompletions, allAutomationLabAttempts],
  );
  const readinessProfile = useMemo(() => buildReadinessProfile(skillProgresses, overall, recentActivity), [skillProgresses, overall, recentActivity]);

  const recommendations = useMemo(
    () => getRecommendations({ completedTopics, quizAttemptsMap, investigationCompletions, skillProgresses, automationLabCompletions }, 5),
    [completedTopics, quizAttemptsMap, investigationCompletions, skillProgresses, automationLabCompletions],
  );

  const assignmentProgresses = useMemo(
    () => trainingAssignments.map((a) => computeAssignmentProgress(a, completedTopics, quizAttemptsMap, investigationCompletions, automationLabCompletions)),
    [completedTopics, quizAttemptsMap, investigationCompletions, automationLabCompletions],
  );

  const milestoneCtx = useMemo(
    () =>
      buildMilestoneEvaluationContext({
        completedTopics,
        quizAttemptsMap,
        investigationCompletions,
        automationLabCompletions,
        skillProgresses,
        assignmentProgresses,
        totalActivityCount: recentActivity.length,
      }),
    [completedTopics, quizAttemptsMap, investigationCompletions, automationLabCompletions, skillProgresses, assignmentProgresses, recentActivity],
  );
  const { unlockedDefinitions, lockedDefinitions, unlocks } = useMilestoneUnlocks(milestoneCtx);
  const unlockedWithDates = unlockedDefinitions.map((milestone) => ({
    milestone,
    unlockedAt: unlocks.find((u) => u.milestoneId === milestone.id)?.unlockedAt ?? "",
  }));

  const certificateCtx = useMemo(() => ({ completedTopics, quizAttemptsMap }), [completedTopics, quizAttemptsMap]);
  const { certificates } = useCertificates(certificateCtx);

  const cvEvidenceItems = useMemo(() => buildCvEvidenceItems(automationLabCompletions), [automationLabCompletions]);

  const readiness = useFeature("readiness-score");
  const milestones = useFeature("milestones");
  const certs = useFeature("certificates");
  const cvEvidence = useFeature("cv-evidence");

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Skills Passport"
        title="Your Professional Skills Passport"
        description="A single, honest view of your training readiness, earned milestones, certificates, and CV-ready evidence — every figure is derived from your own recorded activity."
        accent="from-indigo-500/15 via-blue-500/10 to-transparent"
      />

      <Disclaimer>
        Educational progress indicators only — not a certification, professional assessment, or job-readiness
        guarantee. See{" "}
        <Link href="/progress" className="font-medium underline">
          /progress
        </Link>{" "}
        for the full per-skill evidence breakdown these numbers come from.
      </Disclaimer>

      <ProGate
        unlocked={readiness.unlocked}
        requiredTier={readiness.requiredTier}
        title="Readiness Score & Skill-Gap Engine"
        description="A transparent overall readiness score with a strength/developing/gap breakdown across every skill area."
      >
        <ReadinessScoreCard profile={readinessProfile} />
      </ProGate>

      {recommendations.length > 0 && (
        <Card>
          <SectionHeading title="Recommended for you" subtitle="A deterministic, no-AI engine — no fabricated scores, just your next best step" />
          <div className="grid gap-2 sm:grid-cols-2">
            {recommendations.map((r) => (
              <Link
                key={r.id}
                href={r.href}
                className="block rounded-lg border border-slate-200 p-3 text-sm transition-colors duration-200 hover:border-blue-300 hover:bg-blue-50/40 dark:border-slate-800 dark:hover:border-blue-800 dark:hover:bg-blue-950/20"
              >
                <p className="font-medium text-slate-900 dark:text-slate-100">{r.title}</p>
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{r.description}</p>
              </Link>
            ))}
          </div>
        </Card>
      )}

      <ProGate
        unlocked={milestones.unlocked}
        requiredTier={milestones.requiredTier}
        title="Professional Milestones"
        description="Grounded, resume-appropriate milestones with explicit unlock criteria — no cartoon badges."
      >
        <MilestonesPanel unlocked={unlockedWithDates} locked={lockedDefinitions} />
      </ProGate>

      <ProGate
        unlocked={certs.unlocked}
        requiredTier={certs.requiredTier}
        title="Certificates"
        description="A printable, shareable certificate for every Learning Path you complete."
      >
        <CertificatesPanel programs={certificatePrograms} certificates={certificates} />
      </ProGate>

      <ProGate
        unlocked={cvEvidence.unlocked}
        requiredTier={cvEvidence.requiredTier}
        title="CV Evidence & Interview Prep"
        description="Structured CV wording and an interview-ready STAR story for every completed Enterprise Project."
      >
        <CvEvidencePanel items={cvEvidenceItems} />
      </ProGate>
    </div>
  );
}
