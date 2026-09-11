"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import { useLearningProgress } from "@/lib/learningProgress";
import { useQuizAttempts } from "@/lib/quizAttempts";
import { useInvestigationCompletions } from "@/lib/investigationProgress";
import { useAutomationLabAttempts, getAutomationLabCompletions } from "@/lib/automationLabProgress";
import { useSelectedAssignment } from "@/lib/assignmentSelection";
import { computeActivityTimeline } from "@/lib/analytics/activityTimeline";
import { generateDemoRoster } from "@/lib/data/admin/demoDataGenerator";
import { useOrganizations } from "@/lib/organizations";
import { useOrganizationRoster } from "@/lib/organizationRoster";
import { useOrganizationCohorts } from "@/lib/organizationData";
import { AdminLearnerRecord } from "@/lib/types";

export const YOU_LEARNER_ID = "you";

/**
 * The Phase 12 fictional-demo roster — the real signed-in user's own account
 * (computed via the exact same hooks every other real page uses) plus a
 * fictional, clearly-labeled demo cohort (see
 * lib/data/admin/demoDataGenerator.ts). Unchanged from Phase 12.
 */
function useDemoRoster(): { learners: AdminLearnerRecord[]; loaded: boolean } {
  const { user, profile } = useAuth();
  const { completed: completedTopics } = useLearningProgress();
  const { allAttempts: quizAttemptsMap, loaded: quizLoaded } = useQuizAttempts();
  const investigationCompletions = useInvestigationCompletions();
  const { allAttempts: automationLabAttemptsMap, loaded: automationLoaded } = useAutomationLabAttempts();
  const { assignmentId: selectedAssignmentId } = useSelectedAssignment();

  const loaded = quizLoaded && automationLoaded;

  const you = useMemo<AdminLearnerRecord>(() => {
    const automationLabCompletions = getAutomationLabCompletions(automationLabAttemptsMap);
    const timeline = computeActivityTimeline(quizAttemptsMap, investigationCompletions, automationLabAttemptsMap);
    const lastActivityAt = timeline.length > 0 ? timeline.reduce((latest, e) => (e.timestamp > latest ? e.timestamp : latest), timeline[0].timestamp) : null;

    return {
      id: YOU_LEARNER_ID,
      name: (user?.user_metadata?.display_name as string | undefined) || user?.email || "You",
      isYou: true,
      cohortIds: [],
      programmeId: selectedAssignmentId ?? null,
      joinedDate: profile?.createdAt ?? new Date().toISOString(),
      completedTopics,
      quizAttemptsMap,
      investigationCompletions,
      automationLabCompletions,
      automationLabAttemptsMap,
      lastActivityAt,
    };
  }, [user, profile, completedTopics, quizAttemptsMap, investigationCompletions, automationLabAttemptsMap, selectedAssignmentId]);

  const demoRoster = useMemo(() => generateDemoRoster(), []);

  return { learners: [you, ...demoRoster], loaded };
}

/**
 * The Enterprise Admin roster (Phase 12, made organization-aware in Phase
 * 13). If the user has a real organization actively selected (see
 * lib/organizations.tsx's useOrganizations()), this returns that
 * organization's REAL members and their REAL evidence, fetched via
 * lib/organizationRoster.ts — entirely RLS-authorized, never a fictional
 * learner mixed in (root CLAUDE.md's Phase 13 section 11: "Do not mix
 * generated fictional learners into real tenant analytics"). Otherwise it
 * falls back to exactly the Phase 12 fictional demo experience, unchanged.
 * Every downstream /admin/* page reads from here and never needs to know
 * which source it's getting — both are shaped as AdminLearnerRecord[].
 */
export function useAdminRoster(): { learners: AdminLearnerRecord[]; loaded: boolean; source: "demo" | "organization"; organizationName: string | null } {
  const { user } = useAuth();
  const { activeOrganizationId, activeOrganization } = useOrganizations();
  const demo = useDemoRoster();
  const org = useOrganizationRoster(activeOrganizationId, user?.id);
  const { cohorts } = useOrganizationCohorts(activeOrganizationId);

  const orgLearnersWithCohorts = useMemo<AdminLearnerRecord[]>(
    () => org.learners.map((learner) => ({ ...learner, cohortIds: cohorts.filter((c) => c.memberUserIds.includes(learner.id)).map((c) => c.id) })),
    [org.learners, cohorts],
  );

  if (activeOrganizationId) {
    return { learners: orgLearnersWithCohorts, loaded: org.loaded, source: "organization", organizationName: activeOrganization?.name ?? null };
  }
  return { learners: demo.learners, loaded: demo.loaded, source: "demo", organizationName: null };
}
