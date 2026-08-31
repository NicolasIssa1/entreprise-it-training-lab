"use client";

import { useLocalStorageState } from "@/lib/storage";
import { getAssignmentById, trainingAssignments } from "@/lib/data/assignments";

const STORAGE_KEY = "selected-assignment-id";

const isNullableString = (value: unknown): value is string | null => value === null || typeof value === "string";

/**
 * Which single TrainingAssignment the learner has activated for themselves
 * (Phase 9 Part D/F) — a personal preference, not organization-wide manager
 * functionality. Stored purely in localStorage, the same simple pattern as
 * every other lightweight preference in this app; a new Supabase table was
 * deliberately not added for this (see root CLAUDE.md Phase 9 Part F —
 * "prefer the simplest safe option, do not redesign the whole backend").
 */
export function useSelectedAssignment() {
  const { state: assignmentId, setState: setAssignmentId, loaded } = useLocalStorageState<string | null>(
    STORAGE_KEY,
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
