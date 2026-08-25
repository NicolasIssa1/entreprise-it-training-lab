"use client";

import { useLocalStorageState } from "@/lib/storage";

const STORAGE_KEY = "learning-topic-progress";

const isProgressRecord = (value: unknown): value is Record<string, boolean> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Learning topic completion, shared across the Learn landing page and topic pages.
 * Built on the same useLocalStorageState core as everything else (Checklist,
 * Daily Log, CV Tracker) — one storage architecture, not a separate system.
 * Schema: Record<topicId, boolean>, key "learning-topic-progress".
 */
export function useLearningProgress() {
  const { state: completed, setState: setCompleted } = useLocalStorageState<Record<string, boolean>>(
    STORAGE_KEY,
    {},
    isProgressRecord,
  );

  function toggleComplete(topicId: string) {
    setCompleted({ ...completed, [topicId]: !completed[topicId] });
  }

  function isComplete(topicId: string) {
    return !!completed[topicId];
  }

  const completedCount = Object.values(completed).filter(Boolean).length;

  return { completed, toggleComplete, isComplete, completedCount };
}
