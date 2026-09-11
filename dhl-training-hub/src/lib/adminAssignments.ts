"use client";

import { useLocalStorageList } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { scopedKey } from "@/lib/storageScope";
import { AdminAssignmentRecord, AdminAssignmentRequirementType, AdminLearnerRecord } from "@/lib/types";
import { getPathById, getPathProgress } from "@/lib/data/learning";
import { deriveAssignmentStatus, AdminAssignmentStatus } from "@/lib/adminAssignmentStatusRules";
import { useOrganizations } from "@/lib/organizations";
import { useOrganizationAssignments } from "@/lib/organizationData";

const DOMAIN_KEY = "admin-assignments";

function useDemoAssignments() {
  const { user } = useAuth();
  const { items: assignments, setItems: setAssignments } = useLocalStorageList<AdminAssignmentRecord>(scopedKey(DOMAIN_KEY, user?.id), []);

  function createAssignment(input: Omit<AdminAssignmentRecord, "id" | "assignedAt">): AdminAssignmentRecord {
    const record: AdminAssignmentRecord = {
      ...input,
      id: `assignment-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      assignedAt: new Date().toISOString(),
    };
    setAssignments((prev) => [...prev, record]);
    return record;
  }
  function deleteAssignment(id: string) {
    setAssignments((prev) => prev.filter((a) => a.id !== id));
  }

  return { assignments, createAssignment, deleteAssignment };
}

/**
 * Admin-issued assignment records (Phase 12, made organization-aware in
 * Phase 13). With a real organization active, this is backed by the real,
 * RLS-protected organization_assignments table (lib/organizationData.ts) —
 * status is still always derived at render time (see
 * completionFractionFor/statusFor below), never stored as a fourth,
 * independently-tracked field. Otherwise, unchanged Phase 12 local-only
 * behavior.
 */
export function useAdminAssignments() {
  const { activeOrganizationId } = useOrganizations();
  const { user } = useAuth();
  const demo = useDemoAssignments();
  const org = useOrganizationAssignments(activeOrganizationId);

  if (activeOrganizationId) {
    const assignments: AdminAssignmentRecord[] = org.assignments.map((a) => ({
      id: a.id,
      targetType: a.targetType,
      targetId: a.targetId,
      requirementType: a.requirementType,
      requirementId: a.requirementId,
      requirementTitle: a.requirementTitle,
      dueDate: a.dueDate,
      instructions: a.instructions,
      assignedAt: a.assignedAt,
    }));
    return {
      assignments,
      createAssignment: (input: Omit<AdminAssignmentRecord, "id" | "assignedAt">) =>
        org.create({ ...input, organizationId: activeOrganizationId, assignedBy: user?.id ?? "" }),
      deleteAssignment: org.remove,
    };
  }

  return demo;
}

/** How much of a single requirement a learner has completed, 0-1 — mirrors
 * computeAssignmentProgress.ts's own per-requirement completion rules
 * exactly (a quiz/investigation/automation scenario counts as done once
 * there's any recorded attempt/completion; a path is completion-count/total). */
function completionFractionFor(requirementType: AdminAssignmentRequirementType, requirementId: string, learner: AdminLearnerRecord): number {
  switch (requirementType) {
    case "path": {
      const path = getPathById(requirementId);
      if (!path) return 0;
      const { completedCount, total } = getPathProgress(path, learner.completedTopics);
      return total === 0 ? 0 : completedCount / total;
    }
    case "quiz":
      return (learner.quizAttemptsMap[requirementId]?.length ?? 0) > 0 ? 1 : 0;
    case "investigation":
      return learner.investigationCompletions.some((c) => c.scenarioId === requirementId) ? 1 : 0;
    case "automation-scenario":
      return learner.automationLabCompletions.some((c) => c.scenarioId === requirementId) ? 1 : 0;
    default:
      return 0;
  }
}

export function statusForAssignment(assignment: AdminAssignmentRecord, learner: AdminLearnerRecord, now: Date = new Date()): AdminAssignmentStatus {
  const fraction = completionFractionFor(assignment.requirementType, assignment.requirementId, learner);
  return deriveAssignmentStatus(fraction, assignment.dueDate, now.toISOString());
}

/** Resolves an assignment's targets (a single learner or every member of a
 * cohort) against the current roster/cohort list. */
export function learnersForAssignment(assignment: AdminAssignmentRecord, learners: AdminLearnerRecord[], cohortMemberIds: string[]): AdminLearnerRecord[] {
  if (assignment.targetType === "learner") {
    const learner = learners.find((l) => l.id === assignment.targetId);
    return learner ? [learner] : [];
  }
  return learners.filter((l) => cohortMemberIds.includes(l.id));
}
