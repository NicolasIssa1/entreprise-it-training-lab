"use client";

import { useLocalStorageState } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { scopedKey } from "@/lib/storageScope";
import { getAssignmentById, trainingAssignments } from "@/lib/data/assignments";

const DOMAIN_KEY = "selected-assignment-id";

const isNullableString = (value: unknown): value is string | null => value === null || typeof value === "string";

/**
 * Which single TrainingAssignment the learner has activated for themselves
 * (Phase 9 Part D/F) — a personal preference, not organization-wide manager
 * functionality. Stored purely in localStorage, the same simple pattern as
 * every other lightweight preference in this app; a new Supabase table was
 * deliberately not added for this (see root CLAUDE.md Phase 9 Part F —
 * "prefer the simplest safe option, do not redesign the whole backend"). Still
 * scoped per signed-in user (see storageScope.ts) even though it never
 * touches Supabase — otherwise a second account on the same browser would
 * inherit the first account's selection, which is exactly the account-
 * isolation bug this scoping fixes. This means the selection genuinely does
 * not sync across devices for a given account — it's local-only per browser,
 * not just per account; see CLAUDE.md's Phase 9 section.
 */
export function useSelectedAssignment() {
  const { user } = useAuth();
  const { state: assignmentId, setState: setAssignmentId, loaded } = useLocalStorageState<string | null>(
    scopedKey(DOMAIN_KEY, user?.id),
    null,
    isNullableString,
  );

  const selectedAssignment = assignmentId ? getAssignmentById(assignmentId) : undefined;

  function selectAssignment(id: string) {
    if (!getAssignmentById(id)) return;
    setAssignmentId(id);
  }

  function clearAssignment() {
    setAssignmentId(null);
  }

  return { assignmentId, selectedAssignment, selectAssignment, clearAssignment, loaded, assignments: trainingAssignments };
}
