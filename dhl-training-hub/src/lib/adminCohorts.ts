"use client";

import { useLocalStorageList } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { scopedKey } from "@/lib/storageScope";
import { useOrganizations } from "@/lib/organizations";
import { useOrganizationCohorts } from "@/lib/organizationData";
import { AdminCohort } from "@/lib/types";
import { demoCohortSeeds, demoLearnerSeeds } from "@/lib/data/admin/demoLearners";

const DOMAIN_KEY = "admin-custom-cohorts";

/** The 3 built-in fictional demo cohorts (see demoLearners.ts), expanded to
 * full AdminCohort records with membership derived from the roster seeds —
 * never hand-duplicated membership lists that could drift out of sync. */
export function builtInCohorts(): AdminCohort[] {
  return demoCohortSeeds.map((seed) => ({
    id: seed.id,
    name: seed.name,
    description: seed.description,
    memberLearnerIds: demoLearnerSeeds.filter((l) => l.cohortIds.includes(seed.id)).map((l) => l.id),
    isCustom: false,
  }));
}

function useDemoCohorts() {
  const { user } = useAuth();
  const { items: customCohorts, setItems: setCustomCohorts } = useLocalStorageList<AdminCohort>(scopedKey(DOMAIN_KEY, user?.id), []);

  const cohorts = [...builtInCohorts(), ...customCohorts];

  function createCohort(name: string, description: string): AdminCohort {
    const cohort: AdminCohort = {
      id: `custom-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      name,
      description,
      memberLearnerIds: [],
      isCustom: true,
    };
    setCustomCohorts((prev) => [...prev, cohort]);
    return cohort;
  }
  function deleteCohort(cohortId: string) {
    setCustomCohorts((prev) => prev.filter((c) => c.id !== cohortId));
  }
  function toggleMember(cohortId: string, learnerId: string) {
    setCustomCohorts((prev) =>
      prev.map((c) =>
        c.id === cohortId
          ? { ...c, memberLearnerIds: c.memberLearnerIds.includes(learnerId) ? c.memberLearnerIds.filter((id) => id !== learnerId) : [...c.memberLearnerIds, learnerId] }
          : c,
      ),
    );
  }

  return { cohorts, customCohorts, createCohort, deleteCohort, toggleMember };
}

/**
 * Cohorts (Phase 12, made organization-aware in Phase 13). With a real
 * organization active, this is backed by the real, RLS-protected
 * cohorts/cohort_members tables (lib/organizationData.ts) — every cohort
 * `isCustom: true` (there are no "built-in" cohorts for a real
 * organization). Otherwise, unchanged Phase 12 behavior: 3 fixed fictional
 * demo cohorts plus locally-created custom ones, entirely client-side.
 */
export function useAdminCohorts() {
  const { activeOrganizationId } = useOrganizations();
  const { user } = useAuth();
  const demo = useDemoCohorts();
  const org = useOrganizationCohorts(activeOrganizationId);

  if (activeOrganizationId) {
    const cohorts: AdminCohort[] = org.cohorts.map((c) => ({ id: c.id, name: c.name, description: c.description, memberLearnerIds: c.memberUserIds, isCustom: true }));
    return {
      cohorts,
      customCohorts: cohorts,
      createCohort: (name: string, description: string) => org.create(name, description, user?.id ?? ""),
      deleteCohort: org.remove,
      toggleMember: (cohortId: string, learnerId: string) => {
        const cohort = org.cohorts.find((c) => c.id === cohortId);
        if (!cohort) return;
        if (cohort.memberUserIds.includes(learnerId)) org.removeMember(cohortId, learnerId);
        else org.addMember(cohortId, learnerId);
      },
    };
  }

  return demo;
}
