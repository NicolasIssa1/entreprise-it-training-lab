"use client";

import { useEffect, useState } from "react";
import { useLocalStorageState } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  fetchAutomationLabAttempts,
  insertAutomationLabAttempt,
  bulkUpsertAutomationLabAttempts,
} from "@/lib/repositories/automationLabRepository";
import { mergeMapOfArraysByIdPreferCloud } from "@/lib/mergeCloudState";
import { scopedKey } from "@/lib/storageScope";
import { AutomationLabAttempt, AutomationLabCompletionRecord } from "@/lib/types";

const DOMAIN_KEY = "automation-lab-attempts";
const MAX_ATTEMPTS_PER_SCENARIO = 5;

export type AutomationLabAttemptsMap = Record<string, AutomationLabAttempt[]>;

const isAttemptsMap = (value: unknown): value is AutomationLabAttemptsMap =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Best (highest-overall-score) attempt among a scenario's kept history. Mirrors
 * bestAttempt in lib/quizAttempts.ts. */
export function bestAutomationLabAttempt(attempts: AutomationLabAttempt[]): AutomationLabAttempt | undefined {
  return attempts.reduce<AutomationLabAttempt | undefined>(
    (best, a) => (!best || a.score.overall > best.score.overall ? a : best),
    undefined,
  );
}

export function latestAutomationLabAttempt(attempts: AutomationLabAttempt[]): AutomationLabAttempt | undefined {
  return attempts[attempts.length - 1];
}

/** Derives a lightweight completion list (best attempt per scenario) shaped like
 * InvestigationCompletionRecord — computed at read time, never a second stored
 * "completions" domain (unlike Investigations, which don't need the split here
 * since there's no mid-scenario resume state to persist). */
export function getAutomationLabCompletions(allAttempts: AutomationLabAttemptsMap): AutomationLabCompletionRecord[] {
  const completions: AutomationLabCompletionRecord[] = [];
  for (const [scenarioId, attempts] of Object.entries(allAttempts)) {
    const best = bestAutomationLabAttempt(attempts);
    const latest = latestAutomationLabAttempt(attempts);
    if (!best || !latest) continue;
    completions.push({ scenarioId, completedAt: latest.completedAt, score: best.score.overall });
  }
  return completions;
}

/**
 * Persists Automation Lab attempts under a single "automation-lab-attempts" key
 * (Record<scenarioId, AutomationLabAttempt[]>, capped at the last 5 attempts per
 * scenario), built on the same useLocalStorageState core as every other storage
 * hook — modeled directly on lib/quizAttempts.ts (closest existing shape: attempt
 * history with a cap, best/latest helpers) since a scenario is built and
 * submitted in one sitting, like a quiz, with no mid-scenario resume state to
 * persist (unlike Investigations' progress+completions split).
 *
 * Cloud-aware exactly like every other Phase 5 domain hook: fetch-and-merge on
 * mount (cloud wins per attempt id, local-only attempts are preserved and
 * re-pushed), optimistic local write on every submission, background upsert,
 * syncError flag on failure. Local Demo Mode is pure localStorage, no network.
 */
export function useAutomationLabAttempts(scenarioId?: string) {
  const { user, isConfigured } = useAuth();
  const cloudMode = isConfigured && !!user;

  const { state: allAttempts, setState: setAllAttempts, loaded } = useLocalStorageState<AutomationLabAttemptsMap>(
    scopedKey(DOMAIN_KEY, user?.id),
    {},
    isAttemptsMap,
  );
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    if (!cloudMode || !user) return;
    let cancelled = false;
    fetchAutomationLabAttempts(user.id)
      .then((cloud) => {
        if (cancelled) return;
        setAllAttempts((prevLocal) => {
          const { merged, localOnly } = mergeMapOfArraysByIdPreferCloud(prevLocal, cloud, (a) => a.attemptId);
          if (Object.keys(localOnly).length > 0) bulkUpsertAutomationLabAttempts(user.id, localOnly).catch(() => setSyncError(true));
          const capped: AutomationLabAttemptsMap = {};
          for (const [id, list] of Object.entries(merged)) capped[id] = list.slice(-MAX_ATTEMPTS_PER_SCENARIO);
          return capped;
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

  function recordAttempt(attempt: AutomationLabAttempt) {
    setAllAttempts((prev) => {
      const existing = prev[attempt.scenarioId] ?? [];
      return { ...prev, [attempt.scenarioId]: [...existing, attempt].slice(-MAX_ATTEMPTS_PER_SCENARIO) };
    });
    if (cloudMode && user) {
      insertAutomationLabAttempt(user.id, attempt).catch(() => setSyncError(true));
    }
  }

  const attempts = scenarioId ? allAttempts[scenarioId] ?? [] : [];

  return {
    allAttempts,
    attempts,
    latest: latestAutomationLabAttempt(attempts),
    best: bestAutomationLabAttempt(attempts),
    recordAttempt,
    loaded,
    syncError,
  };
}
