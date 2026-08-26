"use client";

import { useLocalStorageState } from "@/lib/storage";
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
 * same useLocalStorageState core as every other storage hook (Checklist, Daily
 * Log, CV Tracker, learning progress). Malformed saved data is handled safely by
 * useLocalStorageState's isValid guard, falling back to a fresh initial state.
 */
export function useInvestigationProgress(scenarioId: string, startNodeId: string) {
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

  const progress: InvestigationProgress = allProgress[scenarioId] ?? createInitialProgress(scenarioId, startNodeId);

  function update(updater: (prev: InvestigationProgress) => InvestigationProgress) {
    setAllProgress((prev) => ({
      ...prev,
      [scenarioId]: updater(prev[scenarioId] ?? createInitialProgress(scenarioId, startNodeId)),
    }));
  }

  function restart() {
    setAllProgress((prev) => ({ ...prev, [scenarioId]: createInitialProgress(scenarioId, startNodeId) }));
  }

  function recordCompletion(record: InvestigationCompletionRecord) {
    setCompletions((prev) => [...prev.filter((c) => c.scenarioId !== scenarioId), record]);
  }

  return { progress, update, restart, completions, recordCompletion, loaded };
}

/** Read-only view of completion records — used by list pages (Advanced
 * Investigations landing, Team/Learn "Advanced Practice" sections) that just need
 * to know which scenarios are done, without loading full per-scenario progress. */
export function useInvestigationCompletions() {
  const { state: completions } = useLocalStorageState<InvestigationCompletionRecord[]>(
    COMPLETIONS_KEY,
    [],
    isCompletionArray,
  );
  return completions;
}
