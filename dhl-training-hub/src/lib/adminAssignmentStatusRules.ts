/**
 * Pure status-derivation rule for admin-issued assignments (Phase 12) — zero
 * `@/`-aliased imports, same testability pattern as entitlementRules.ts.
 * lib/adminAssignments.ts computes the actual completionFraction per
 * requirement type (path/quiz/investigation/automation-scenario) against a
 * learner's real evidence, then hands it to this function — the "what state
 * does this number + this due date resolve to" decision is tested here in
 * isolation.
 */
export type AdminAssignmentStatus = "assigned" | "started" | "completed" | "overdue";

/** completionFraction is 0-1. dueDateIso/nowIso are ISO date strings; a null
 * dueDate means "no deadline," so lateness can never apply. */
export function deriveAssignmentStatus(completionFraction: number, dueDateIso: string | null, nowIso: string): AdminAssignmentStatus {
  if (completionFraction >= 1) return "completed";
  const isOverdue = !!dueDateIso && new Date(dueDateIso).getTime() < new Date(nowIso).getTime();
  if (isOverdue) return "overdue";
  if (completionFraction > 0) return "started";
  return "assigned";
}
