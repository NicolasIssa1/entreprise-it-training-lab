"use client";

import { useEffect, useState } from "react";
import { fetchOrganizationMembers } from "@/lib/repositories/organizationRepository";
import { fetchLearningProgress } from "@/lib/repositories/learningProgressRepository";
import { fetchQuizAttempts } from "@/lib/repositories/quizAttemptsRepository";
import { fetchInvestigationCompletions } from "@/lib/repositories/investigationRepository";
import { fetchAutomationLabAttempts } from "@/lib/repositories/automationLabRepository";
import { getAutomationLabCompletions } from "@/lib/automationLabProgress";
import { computeActivityTimeline } from "@/lib/analytics/activityTimeline";
import { AdminLearnerRecord } from "@/lib/types";

/**
 * The REAL, RLS-authorized equivalent of Phase 12's fictional demo roster —
 * fetches an organization's real members and their real training evidence
 * via the exact same repository functions every personal page already uses
 * (fetchLearningProgress/fetchQuizAttempts/fetchInvestigationCompletions/
 * fetchAutomationLabAttempts), just parameterized by each member's user_id
 * instead of always the caller's own. Nothing here decides who is allowed
 * to see what — that's entirely Postgres RLS (see
 * supabase/migrations/0006_multi_tenant.sql's can_view_org_member() policies).
 * If RLS denies a row, these calls simply return empty data, exactly as
 * they would for any other unauthorized query — there is no separate
 * client-side gate to bypass.
 *
 * Shapes every member into the SAME AdminLearnerRecord Phase 12 already
 * uses, so /admin/learners, /admin/learners/[learnerId], /admin/analytics,
 * and /admin/reports/[cohortId] needed zero changes to render real
 * organization data — only the data SOURCE changed (see lib/adminRoster.ts).
 */
export function useOrganizationRoster(organizationId: string | null, currentUserId: string | undefined): { learners: AdminLearnerRecord[]; loaded: boolean } {
  const [learners, setLearners] = useState<AdminLearnerRecord[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      if (!organizationId) return [];
      const members = await fetchOrganizationMembers(organizationId);
      return Promise.all(
        members.map(async (member) => {
          const [completedTopics, quizAttemptsMap, investigationCompletions, automationLabAttemptsMap] = await Promise.all([
            fetchLearningProgress(member.userId).catch(() => ({})),
            fetchQuizAttempts(member.userId).catch(() => ({})),
            fetchInvestigationCompletions(member.userId).catch(() => []),
            fetchAutomationLabAttempts(member.userId).catch(() => ({})),
          ]);
          const automationLabCompletions = getAutomationLabCompletions(automationLabAttemptsMap);
          const timeline = computeActivityTimeline(quizAttemptsMap, investigationCompletions, automationLabAttemptsMap);
          const lastActivityAt = timeline.length > 0 ? timeline.reduce((latest, e) => (e.timestamp > latest ? e.timestamp : latest), timeline[0].timestamp) : null;

          const record: AdminLearnerRecord = {
            id: member.userId,
            name: member.displayName || `${member.role[0].toUpperCase()}${member.role.slice(1)} (no display name set)`,
            isYou: member.userId === currentUserId,
            cohortIds: [], // populated by useOrganizationCohorts at the page level, not per-learner here
            programmeId: null,
            joinedDate: member.joinedAt,
            completedTopics,
            quizAttemptsMap,
            investigationCompletions,
            automationLabCompletions,
            automationLabAttemptsMap,
            lastActivityAt,
          };
          return record;
        }),
      );
    })()
      .then((results) => {
        if (!cancelled) setLearners(results);
      })
      .catch(() => {
        if (!cancelled) setLearners([]);
      })
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });

    return () => {
      cancelled = true;
    };
  }, [organizationId, currentUserId]);

  return { learners, loaded };
}
