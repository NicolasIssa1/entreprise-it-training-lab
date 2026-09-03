"use client";

import { useEffect, useState } from "react";
import { useLocalStorageState } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fetchLearningProgress, upsertTopicCompletion, bulkUpsertLearningProgress } from "@/lib/repositories/learningProgressRepository";
import { mergeRecordPreferCloud } from "@/lib/mergeCloudState";
import { scopedKey } from "@/lib/storageScope";

const DOMAIN_KEY = "learning-topic-progress";

const isProgressRecord = (value: unknown): value is Record<string, boolean> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Learning topic completion, shared across the Learn landing page and topic
 * pages. Built on the same useLocalStorageState core as everything else
 * (Checklist, Daily Log, CV Tracker) — schema Record<topicId, boolean>, keyed
 * by `scopedKey(DOMAIN_KEY, user?.id)` so every signed-in account gets its own
 * private local cache, never a key shared with any other account on the same
 * browser (see storageScope.ts — this is the account-isolation fix).
 *
 * Phase 5: when signed in with Supabase configured, local storage is used as
 * an optimistic cache — cloud data is merged into it on load (cloud wins per
 * topic id it has an opinion on, but a topic completed locally that cloud
 * doesn't know about yet is preserved and re-pushed rather than dropped; see
 * lib/mergeCloudState.ts — a blind overwrite here used to be able to silently
 * un-complete a topic if its background write hadn't landed before the next
 * mount's fetch), and every toggle writes through to Supabase in the
 * background. Signed-out / Local Demo Mode behaves exactly as it did in
 * Phase 4: pure localStorage, no network calls, using the shared "demo"
 * namespace.
 */
export function useLearningProgress() {
  const { user, isConfigured } = useAuth();
  const cloudMode = isConfigured && !!user;

  const { state: completed, setState: setCompleted } = useLocalStorageState<Record<string, boolean>>(
    scopedKey(DOMAIN_KEY, user?.id),
    {},
    isProgressRecord,
  );
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    if (!cloudMode || !user) return;
    let cancelled = false;
    fetchLearningProgress(user.id)
      .then((cloud) => {
        if (cancelled) return;
        setCompleted((prevLocal) => {
          const { merged, localOnly } = mergeRecordPreferCloud(prevLocal, cloud);
          if (Object.keys(localOnly).length > 0) bulkUpsertLearningProgress(user.id, localOnly).catch(() => setSyncError(true));
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
