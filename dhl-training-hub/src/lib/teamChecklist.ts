"use client";

import { useEffect, useState } from "react";
import { useLocalStorageState } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fetchTeamChecklist, upsertChecklistItem, bulkUpsertTeamChecklists } from "@/lib/repositories/teamChecklistRepository";
import { mergeRecordPreferCloud } from "@/lib/mergeCloudState";
import { TeamId } from "@/lib/types";

const isChecklistRecord = (value: unknown): value is Record<string, boolean> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Team learning checklist, storage scoped per team via a distinct key
 * (`checklist-<teamId>`) so Infrastructure/Applications/Support & Network each
 * own their own record. Phase 5: cloud-aware the same way as every other
 * domain hook — see lib/learningProgress.ts for the pattern this follows.
 */
export function useTeamChecklist(teamId: TeamId) {
  const { user, isConfigured } = useAuth();
  const cloudMode = isConfigured && !!user;

  const { state: checked, setState: setChecked } = useLocalStorageState<Record<string, boolean>>(
    `checklist-${teamId}`,
    {},
    isChecklistRecord,
  );
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    if (!cloudMode || !user) return;
    let cancelled = false;
    fetchTeamChecklist(user.id, teamId)
      .then((cloud) => {
        if (cancelled) return;
        setChecked((prevLocal) => {
          const { merged, localOnly } = mergeRecordPreferCloud(prevLocal, cloud);
          if (Object.keys(localOnly).length > 0) {
            bulkUpsertTeamChecklists(user.id, { [teamId]: localOnly }).catch(() => setSyncError(true));
          }
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
  }, [cloudMode, user?.id, teamId]);

  function toggle(item: string) {
    const next = !checked[item];
    setChecked({ ...checked, [item]: next });
    if (cloudMode && user) {
      upsertChecklistItem(user.id, teamId, item, next).catch(() => setSyncError(true));
    }
  }

  return { checked, toggle, syncError };
}
