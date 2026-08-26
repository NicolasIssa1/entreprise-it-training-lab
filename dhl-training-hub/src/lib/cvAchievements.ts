"use client";

import { useEffect, useState } from "react";
import { useLocalStorageList } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fetchCvAchievements, insertCvAchievement, deleteCvAchievement } from "@/lib/repositories/cvAchievementsRepository";
import { CvAchievement } from "@/lib/types";

/**
 * CV Achievement entries — "cv-achievements" key. Phase 5: cloud-aware the
 * same way as every other domain hook (see lib/learningProgress.ts).
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
        if (!cancelled) setAchievements(cloud);
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
