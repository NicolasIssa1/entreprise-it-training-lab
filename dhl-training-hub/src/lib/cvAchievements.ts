"use client";

import { useEffect, useState } from "react";
import { useLocalStorageList } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fetchCvAchievements, insertCvAchievement, deleteCvAchievement, bulkUpsertCvAchievements } from "@/lib/repositories/cvAchievementsRepository";
import { mergeArrayByIdPreferCloud } from "@/lib/mergeCloudState";
import { CvAchievement } from "@/lib/types";

/**
 * CV Achievement entries — "cv-achievements" key. Phase 5: cloud-aware the
 * same way as every other domain hook (see lib/learningProgress.ts).
 *
 * Regression fix: the cloud fetch used to overwrite local state outright
 * (`setAchievements(cloud)`), which could silently erase a just-added
 * achievement if its background insert hadn't landed yet before the next
 * mount's fetch (e.g. a fast refresh right after saving). Now merges with
 * local instead (see lib/mergeCloudState.ts) and re-pushes anything still
 * local-only.
 */
export function useCvAchievements() {
  const { user, isConfigured } = useAuth();
  const cloudMode = isConfigured && !!user;

  const { items: achievements, setItems: setAchievements } = useLocalStorageList<CvAchievement>("cv-achievements", []);
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    if (!cloudMode || !user) return;
    let cancelled = false;
    fetchCvAchievements(user.id)
      .then((cloud) => {
        if (cancelled) return;
        setAchievements((prevLocal) => {
          const { merged, localOnly } = mergeArrayByIdPreferCloud(prevLocal, cloud, (a) => a.id);
          if (localOnly.length > 0) bulkUpsertCvAchievements(user.id, localOnly).catch(() => setSyncError(true));
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

  function addAchievement(achievement: CvAchievement) {
    setAchievements([achievement, ...achievements]);
    if (cloudMode && user) {
      insertCvAchievement(user.id, achievement).catch(() => setSyncError(true));
    }
  }

  function removeAchievement(id: string) {
    setAchievements(achievements.filter((a) => a.id !== id));
    if (cloudMode && user) {
      deleteCvAchievement(user.id, id).catch(() => setSyncError(true));
    }
  }

  return { achievements, addAchievement, removeAchievement, syncError };
}
