"use client";

import { useEffect, useState } from "react";
import { useLocalStorageState } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import {
  fetchInvestigationCompletions,
  fetchInvestigationProgress,
  upsertInvestigationCompletion,
  upsertInvestigationProgress,
  deleteInvestigationProgress,
} from "@/lib/repositories/investigationRepository";
import { InvestigationCompletionRecord, InvestigationProgress } from "@/lib/types";

const PROGRESS_KEY = "investigation-progress";
const COMPLETIONS_KEY = "investigation-completions";

type ProgressMap = Record<string, InvestigationProgress>;

const isProgressMap = (value: unknown): value is ProgressMap =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isCompletionArray = (value: unknown): value is InvestigationCompletionRecord[] => Array.isArray(value);

function createInitialProgress(scenarioId: string, startNodeId: string): InvestigationProgress {
  return {
    scenarioId,
    currentNodeId: startNodeId,
    history: [{ id: "start", timestamp: Date.now(), kind: "start", label: "Ticket received" }],
    actionsTaken: [],
    askedQuestionIds: [],
    hypothesisHistory: [],
    documentation: {},
    completed: false,
  };
}

/**
 * Persists one scenario's investigation progress, namespaced under a single
 * "investigation-progress" key (Record<scenarioId, InvestigationProgress>) plus a
 * separate lightweight "investigation-completions" history list — built on the
 * same useLocalStorageState core as every other storage hook. Malformed saved
 * data is handled safely by useLocalStorageState's isValid guard, falling back
 * to a fresh initial state.
 *
 * Phase 5: signed-in + configured fetches both from Supabase on mount (cloud
 * becomes authoritative — this is what lets a learner start an investigation,
 * leave, and resume from another device, per root CLAUDE.md's Phase 5
 * section) and writes through on every update. "Restart Scenario" deletes the
 * cloud row outright rather than upserting a reset one. Local Demo Mode is
 * unchanged from Phase 3.
 */
export function useInvestigationProgress(scenarioId: string, startNodeId: string) {
  const { user, isConfigured } = useAuth();
  const cloudMode = isConfigured && !!user;

  const { state: allProgress, setState: setAllProgress, loaded } = useLocalStorageState<ProgressMap>(
    PROGRESS_KEY,
    {},
    isProgressMap,
  );
  const { state: completions, setState: setCompletions } = useLocalStorageState<InvestigationCompletionRecord[]>(
    COMPLETIONS_KEY,
    [],
    isCompletionArray,
  );
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    if (!cloudMode || !user) return;
    let cancelled = false;
    Promise.all([fetchInvestigationProgress(user.id), fetchInvestigationCompletions(user.id)])
      .then(([progressMap, completionList]) => {
        if (cancelled) return;
        setAllProgress(progressMap);
        setCompletions(completionList);
      })
      .catch(() => {
        if (!cancelled) setSyncError(true);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudMode, user?.id]);

  const progress: InvestigationProgress = allProgress[scenarioId] ?? createInitialProgress(scenarioId, startNodeId);

  function update(updater: (prev: InvestigationProgress) => InvestigationProgress) {
    setAllProgress((prev) => {
      const next = updater(prev[scenarioId] ?? createInitialProgress(scenarioId, startNodeId));
      if (cloudMode && user) {
        upsertInvestigationProgress(user.id, next).catch(() => setSyncError(true));
      }
      return { ...prev, [scenarioId]: next };
    });
  }

  function restart() {
    setAllProgress((prev) => ({ ...prev, [scenarioId]: createInitialProgress(scenarioId, startNodeId) }));
    if (cloudMode && user) {
      deleteInvestigationProgress(user.id, scenarioId).catch(() => setSyncError(true));
    }
  }

  function recordCompletion(record: InvestigationCompletionRecord) {
    setCompletions((prev) => [...prev.filter((c) => c.scenarioId !== record.scenarioId), record]);
    if (cloudMode && user) {
      upsertInvestigationCompletion(user.id, record).catch(() => setSyncError(true));
    }
  }

  return { progress, update, restart, completions, recordCompletion, loaded, syncError };
}

/** Read-only view of completion records — used by list pages (Advanced
 * Investigations landing, Team/Learn "Advanced Practice" sections) that just need
 * to know which scenarios are done, without loading full per-scenario progress. */
export function useInvestigationCompletions() {
  const { user, isConfigured } = useAuth();
  const cloudMode = isConfigured && !!user;

  const { state: completions, setState: setCompletions } = useLocalStorageState<InvestigationCompletionRecord[]>(
    COMPLETIONS_KEY,
    [],
    isCompletionArray,
  );

  useEffect(() => {
    if (!cloudMode || !user) return;
    let cancelled = false;
    fetchInvestigationCompletions(user.id)
      .then((cloud) => {
        if (!cancelled) setCompletions(cloud);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudMode, user?.id]);

  return completions;
}
