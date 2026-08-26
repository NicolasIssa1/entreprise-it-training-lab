"use client";

import { useEffect, useState } from "react";
import { useLocalStorageState } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fetchLearningProgress, upsertTopicCompletion } from "@/lib/repositories/learningProgressRepository";

const STORAGE_KEY = "learning-topic-progress";

const isProgressRecord = (value: unknown): value is Record<string, boolean> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Learning topic completion, shared across the Learn landing page and topic
 * pages. Built on the same useLocalStorageState core as everything else
 * (Checklist, Daily Log, CV Tracker) — key "learning-topic-progress", schema
 * Record<topicId, boolean>.
 *
 * Phase 5: when signed in with Supabase configured, local storage is used as
 * an optimistic cache — cloud data overwrites it on load (cloud is
 * authoritative post-auth, see root CLAUDE.md), and every toggle writes
 * through to Supabase in the background. Signed-out / Local Demo Mode behaves
 * exactly as it did in Phase 4: pure localStorage, no network calls.
 */
export function useLearningProgress() {
  const { user, isConfigured } = useAuth();
  const cloudMode = isConfigured && !!user;

  const { state: completed, setState: setCompleted } = useLocalStorageState<Record<string, boolean>>(
    STORAGE_KEY,
    {},
    isProgressRecord,
  );
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    if (!cloudMode || !user) return;
    let cancelled = false;
    fetchLearningProgress(user.id)
      .then((cloud) => {
        if (!cancelled) setCompleted(cloud);
      })
      .catch(() => {
        if (!cancelled) setSyncError(true);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudMode, user?.id]);

  function toggleComplete(topicId: string) {
    const next = !completed[topicId];
    setCompleted({ ...completed, [topicId]: next });
    if (cloudMode && user) {
      upsertTopicCompletion(user.id, topicId, next).catch(() => setSyncError(true));
    }
  }

  function isComplete(topicId: string) {
    return !!completed[topicId];
  }

  const completedCount = Object.values(completed).filter(Boolean).length;

  return { completed, toggleComplete, isComplete, completedCount, syncError };
}
