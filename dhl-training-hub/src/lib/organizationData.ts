"use client";

import { useCallback, useEffect, useState } from "react";
import {
  fetchOrganizationMembers,
  fetchPendingInvites,
  fetchOrganizationCohorts,
  createOrganizationCohort,
  deleteOrganizationCohort,
  addCohortMember,
  removeCohortMember,
  fetchOrganizationAssignments,
  createOrganizationAssignment,
  deleteOrganizationAssignment,
  fetchOrganizationProgrammes,
  createOrganizationProgramme,
  deleteOrganizationProgramme,
} from "@/lib/repositories/organizationRepository";
import { OrgCohort, OrgAssignment, OrgProgramme, OrganizationMemberProfile, OrganizationInvite } from "@/lib/types";

/**
 * Real, RLS-authorized organization data hooks (see
 * supabase/migrations/0006_multi_tenant.sql for the actual tenant-isolation
 * enforcement — these hooks never re-implement that check, they just
 * surface whatever the database allows). Every fetch below resolves a
 * `Promise.resolve([])` when organizationId is null instead of an early
 * synchronous setState — every state update happens inside an async
 * callback, matching the pattern every other cloud-aware hook in this app
 * already uses (see lib/quizAttempts.ts etc.), which is what keeps effects
 * "subscribing to an external result" rather than "computing state
 * synchronously," per this project's react-hooks/set-state-in-effect rule.
 */

export function useOrganizationMembers(organizationId: string | null) {
  const [members, setMembers] = useState<OrganizationMemberProfile[]>([]);
  const [invites, setInvites] = useState<OrganizationInvite[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    const task: Promise<[OrganizationMemberProfile[], OrganizationInvite[]]> = organizationId
      ? Promise.all([fetchOrganizationMembers(organizationId), fetchPendingInvites(organizationId)])
      : Promise.resolve([[], []]);
    task
      .then(([m, i]) => {
        setMembers(m);
        setInvites(i);
      })
      .catch(() => {
        setMembers([]);
        setInvites([]);
      })
      .finally(() => setLoaded(true));
  }, [organizationId]);

  useEffect(refresh, [refresh]);

  return { members, invites, loaded, refresh };
}

export function useOrganizationCohorts(organizationId: string | null) {
  const [cohorts, setCohorts] = useState<OrgCohort[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    const task = organizationId ? fetchOrganizationCohorts(organizationId) : Promise.resolve([]);
    task
      .then(setCohorts)
      .catch(() => setCohorts([]))
      .finally(() => setLoaded(true));
  }, [organizationId]);

  useEffect(refresh, [refresh]);

  async function create(name: string, description: string, createdBy: string) {
    if (!organizationId) return;
    await createOrganizationCohort(organizationId, name, description, createdBy);
    refresh();
  }
  async function remove(cohortId: string) {
    await deleteOrganizationCohort(cohortId);
    refresh();
  }
  async function addMember(cohortId: string, userId: string) {
    await addCohortMember(cohortId, userId);
    refresh();
  }
  async function removeMember(cohortId: string, userId: string) {
    await removeCohortMember(cohortId, userId);
    refresh();
  }

  return { cohorts, loaded, refresh, create, remove, addMember, removeMember };
}

export function useOrganizationAssignments(organizationId: string | null) {
  const [assignments, setAssignments] = useState<OrgAssignment[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    const task = organizationId ? fetchOrganizationAssignments(organizationId) : Promise.resolve([]);
    task
      .then(setAssignments)
      .catch(() => setAssignments([]))
      .finally(() => setLoaded(true));
  }, [organizationId]);

  useEffect(refresh, [refresh]);

  async function create(input: Omit<OrgAssignment, "id" | "assignedAt">) {
    await createOrganizationAssignment(input);
    refresh();
  }
  async function remove(assignmentId: string) {
    await deleteOrganizationAssignment(assignmentId);
    refresh();
  }

  return { assignments, loaded, refresh, create, remove };
}

export function useOrganizationProgrammes(organizationId: string | null) {
  const [programmes, setProgrammes] = useState<OrgProgramme[]>([]);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(() => {
    const task = organizationId ? fetchOrganizationProgrammes(organizationId) : Promise.resolve([]);
    task
      .then(setProgrammes)
      .catch(() => setProgrammes([]))
      .finally(() => setLoaded(true));
  }, [organizationId]);

  useEffect(refresh, [refresh]);

  async function create(input: Omit<OrgProgramme, "id" | "createdAt">) {
    await createOrganizationProgramme(input);
    refresh();
  }
  async function remove(programmeId: string) {
    await deleteOrganizationProgramme(programmeId);
    refresh();
  }

  return { programmes, loaded, refresh, create, remove };
}
