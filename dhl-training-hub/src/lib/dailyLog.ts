"use client";

import { useEffect, useState } from "react";
import { useLocalStorageList } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fetchDailyLogs, insertDailyLog, deleteDailyLog, bulkUpsertDailyLogs } from "@/lib/repositories/dailyLogRepository";
import { seedDailyLogEntries } from "@/lib/data/seedDailyLog";
import { DailyLogEntry } from "@/lib/types";

/**
 * Daily Log entries, shared by the Daily Log page (read/write) and
 * TeamObservations (read-only) — both used to call useLocalStorageList
 * directly against the same "daily-log-entries" key; centralized here so
 * there's exactly one place that knows how to load/save them.
 *
 * Phase 5: signed-in + configured fetches from Supabase on mount. If the
 * cloud has no rows yet (a brand-new account that never had this browser's
 * local key populated), it seeds with the same seedDailyLogEntries local mode
 * has always used and pushes that seed to the cloud too, so first-time cloud
 * users don't lose the example entries. Local Demo Mode is unchanged.
 */
export function useDailyLogEntries() {
  const { user, isConfigured } = useAuth();
  const cloudMode = isConfigured && !!user;

  const { items: entries, setItems: setEntries } = useLocalStorageList<DailyLogEntry>(
    "daily-log-entries",
    seedDailyLogEntries,
  );
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    if (!cloudMode || !user) return;
    let cancelled = false;
    fetchDailyLogs(user.id)
      .then((cloud) => {
        if (cancelled) return;
        if (cloud.length === 0) {
          setEntries(seedDailyLogEntries);
          bulkUpsertDailyLogs(user.id, seedDailyLogEntries).catch(() => undefined);
        } else {
          setEntries(cloud);
        }
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
