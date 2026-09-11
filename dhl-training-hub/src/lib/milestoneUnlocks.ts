"use client";

import { useEffect, useState } from "react";
import { useLocalStorageList } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { scopedKey } from "@/lib/storageScope";
import { fetchMilestoneUnlocks, insertMilestoneUnlock, bulkUpsertMilestoneUnlocks } from "@/lib/repositories/milestonesRepository";
import { mergeArrayByIdPreferCloud } from "@/lib/mergeCloudState";
import { AssignmentProgress, AutomationLabCompletionRecord, InvestigationCompletionRecord, MilestoneUnlock, SkillProgress } from "@/lib/types";
import { QuizAttemptsMap, bestAttempt } from "@/lib/quizAttempts";
import { milestoneDefinitions, getEligibleMilestoneIds, MilestoneEvaluationContext } from "@/lib/data/milestones";
import { learningPaths, getPathProgress } from "@/lib/data/learning";
import { automationLabScenarios } from "@/lib/data/automationLab";

const DOMAIN_KEY = "milestone-unlocks";

/** Gathers everything needed to evaluate every milestone's eligibility rule
 * from data the caller (a page that's already assembled its own progress
 * hooks) already has on hand — no new fetching, no new evidence source. */
export function buildMilestoneEvaluationContext(params: {
  completedTopics: Record<string, boolean>;
  quizAttemptsMap: QuizAttemptsMap;
  investigationCompletions: InvestigationCompletionRecord[];
  automationLabCompletions: AutomationLabCompletionRecord[];
  skillProgresses: SkillProgress[];
  assignmentProgresses: AssignmentProgress[];
  totalActivityCount: number;
}): MilestoneEvaluationContext {
  const { completedTopics, quizAttemptsMap, investigationCompletions, automationLabCompletions, skillProgresses, assignmentProgresses, totalActivityCount } =
    params;

  const topicsCompletedCount = Object.values(completedTopics).filter(Boolean).length;
  const quizzesPassedCount = Object.values(quizAttemptsMap).filter((attempts) => (bestAttempt(attempts)?.percentage ?? 0) >= 70).length;
  const investigationsResolvedCount = investigationCompletions.filter((c) => c.score >= 60).length;
  const automationBuildsCompletedCount = automationLabCompletions.length;

  const projectScenarioIds = new Set(automationLabScenarios.filter((s) => s.isEnterpriseProject).map((s) => s.id));
  const enterpriseProjectsCompletedCount = automationLabCompletions.filter((c) => projectScenarioIds.has(c.scenarioId)).length;

  const pathsCompletedCount = learningPaths.filter((p) => {
    const { completedCount, total } = getPathProgress(p, completedTopics);
    return total > 0 && completedCount === total;
  }).length;

  const assignmentsCompletedCount = assignmentProgresses.filter((a) => a.overallCompletion >= 100).length;

  return {
    topicsCompletedCount,
    quizzesPassedCount,
    investigationsResolvedCount,
    automationBuildsCompletedCount,
    enterpriseProjectsCompletedCount,
    pathsCompletedCount,
    assignmentsCompletedCount,
    skillProgresses,
    totalActivityCount,
  };
}

/**
 * Milestone unlock records are a thin, timestamp-only persistence layer over
 * a fully deterministic, derived eligibility check (lib/data/milestones.ts) —
 * never a duplicated score. Whenever the evaluation context shows a milestone
 * is newly eligible and has no existing unlock record, one is written with
 * unlockedAt = now(). Cloud-aware exactly like every other Phase 5+ domain
 * hook: fetch-and-merge on mount, optimistic local write, background upsert,
 * syncError flag on failure.
 */
export function useMilestoneUnlocks(ctx: MilestoneEvaluationContext | null) {
  const { user, isConfigured } = useAuth();
  const cloudMode = isConfigured && !!user;

  const { items: unlocks, setItems: setUnlocks } = useLocalStorageList<MilestoneUnlock>(scopedKey(DOMAIN_KEY, user?.id), []);
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    if (!cloudMode || !user) return;
    let cancelled = false;
    fetchMilestoneUnlocks(user.id)
      .then((cloud) => {
        if (cancelled) return;
        setUnlocks((prevLocal) => {
          const { merged, localOnly } = mergeArrayByIdPreferCloud(prevLocal, cloud, (u) => u.milestoneId);
          if (localOnly.length > 0) bulkUpsertMilestoneUnlocks(user.id, localOnly).catch(() => setSyncError(true));
          return merged;
        });
      })
      .catch(() => {
        if (!cancelled) setSyncError(true);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudMode, user?.id]);

  useEffect(() => {
    if (!ctx) return;
    const unlockedIds = new Set(unlocks.map((u) => u.milestoneId));
    const newlyEligibleIds = getEligibleMilestoneIds(ctx).filter((id) => !unlockedIds.has(id));
    if (newlyEligibleIds.length === 0) return;

    const now = new Date().toISOString();
    const newUnlocks: MilestoneUnlock[] = newlyEligibleIds.map((milestoneId) => ({ milestoneId, unlockedAt: now }));
    setUnlocks((prev) => [...prev, ...newUnlocks]);
    if (cloudMode && user) {
      for (const unlock of newUnlocks) insertMilestoneUnlock(user.id, unlock).catch(() => setSyncError(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ctx, unlocks, cloudMode, user?.id]);

  const unlockedDefinitions = milestoneDefinitions.filter((m) => unlocks.some((u) => u.milestoneId === m.id));
  const lockedDefinitions = milestoneDefinitions.filter((m) => !unlocks.some((u) => u.milestoneId === m.id));

  return { unlocks, unlockedDefinitions, lockedDefinitions, syncError };
}
