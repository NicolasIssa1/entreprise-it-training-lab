"use client";

import { useEffect, useState } from "react";
import { useLocalStorageList } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fetchDailyLogs, insertDailyLog, deleteDailyLog, bulkUpsertDailyLogs } from "@/lib/repositories/dailyLogRepository";
import { seedDailyLogEntries } from "@/lib/data/seedDailyLog";
import { mergeArrayByIdPreferCloud } from "@/lib/mergeCloudState";
import { scopedKey } from "@/lib/storageScope";
import { DailyLogEntry } from "@/lib/types";

const DOMAIN_KEY = "daily-log-entries";

/**
 * Daily Log entries, shared by the Daily Log page (read/write) and
 * TeamObservations (read-only) — both used to call useLocalStorageList
 * directly against the same "daily-log-entries" key; centralized here so
 * there's exactly one place that knows how to load/save them.
 *
 * Phase 5: signed-in + configured fetches from Supabase on mount and merges
 * it with whatever's already local (see lib/mergeCloudState.ts) rather than
 * replacing local state outright — a blind replace was the root cause of a
 * regression where a just-saved entry could vanish on refresh if its
 * background insert hadn't landed in Supabase yet. Any entry that's still
 * local-only after the merge (never yet synced) is re-pushed to cloud in the
 * background.
 *
 * Account isolation (see storageScope.ts): the local cache key is scoped per
 * signed-in user, so no two accounts on the same browser ever share entries.
 * A brand-new authenticated account starts from an empty list, never the
 * example `seedDailyLogEntries` — those are personal illustrative content
 * meant only for first-time Local Demo Mode use (the shared "demo" namespace,
 * signed out), not something a newly created real account should inherit.
 */
export function useDailyLogEntries() {
  const { user, isConfigured } = useAuth();
  const cloudMode = isConfigured && !!user;

  const { items: entries, setItems: setEntries } = useLocalStorageList<DailyLogEntry>(
    scopedKey(DOMAIN_KEY, user?.id),
    cloudMode ? [] : seedDailyLogEntries,
  );
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    if (!cloudMode || !user) return;
    let cancelled = false;
    fetchDailyLogs(user.id)
      .then((cloud) => {
        if (cancelled) return;
        setEntries((prevLocal) => {
          const { merged, localOnly } = mergeArrayByIdPreferCloud(prevLocal, cloud, (e) => e.id);
          if (localOnly.length > 0) bulkUpsertDailyLogs(user.id, localOnly).catch(() => setSyncError(true));
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

  function addEntry(entry: DailyLogEntry) {
    setEntries([entry, ...entries]);
    if (cloudMode && user) {
      insertDailyLog(user.id, entry).catch(() => setSyncError(true));
    }
  }

  function removeEntry(id: string) {
    setEntries(entries.filter((e) => e.id !== id));
    if (cloudMode && user) {
      deleteDailyLog(user.id, id).catch(() => setSyncError(true));
    }
  }

  return { entries, addEntry, removeEntry, syncError };
}
