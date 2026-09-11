"use client";

import { useLocalStorageList } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { scopedKey } from "@/lib/storageScope";
import { AdminCustomProgramme } from "@/lib/types";
import { trainingAssignments } from "@/lib/data/assignments";
import { useOrganizations } from "@/lib/organizations";
import { useOrganizationProgrammes } from "@/lib/organizationData";

const DOMAIN_KEY = "admin-custom-programmes";

function useDemoProgrammes() {
  const { user } = useAuth();
  const { items: customProgrammes, setItems: setCustomProgrammes } = useLocalStorageList<AdminCustomProgramme>(scopedKey(DOMAIN_KEY, user?.id), []);

  const programmes = [...trainingAssignments, ...customProgrammes];

  function createProgramme(programme: Omit<AdminCustomProgramme, "id">): AdminCustomProgramme {
    const created: AdminCustomProgramme = { ...programme, id: `custom-programme-${Date.now()}-${Math.random().toString(36).slice(2, 8)}` };
    setCustomProgrammes((prev) => [...prev, created]);
    return created;
  }
  function deleteProgramme(programmeId: string) {
    setCustomProgrammes((prev) => prev.filter((p) => p.id !== programmeId));
  }

  return { programmes, customProgrammes, createProgramme, deleteProgramme };
}

/**
 * Programmes (Phase 12, made organization-aware in Phase 13). The 6
 * built-in Programmes are shared platform content (application code, see
 * lib/data/assignments.ts) — every organization can use them, so they are
 * NOT organization-scoped and NOT duplicated per organization, per root
 * CLAUDE.md's Phase 13 "global platform content vs organization-specific
 * data" distinction. Only genuinely custom, organization-authored
 * Programmes live in the real organization_programmes table when a real
 * organization is active; otherwise (demo mode) custom programmes stay
 * local-only, unchanged from Phase 12.
 */
export function useAdminProgrammes() {
  const { activeOrganizationId } = useOrganizations();
  const { user } = useAuth();
  const demo = useDemoProgrammes();
  const org = useOrganizationProgrammes(activeOrganizationId);

  if (activeOrganizationId) {
    const customProgrammes: AdminCustomProgramme[] = org.programmes.map((p) => ({
      id: p.id,
      title: p.title,
      audience: p.audience,
      purpose: p.purpose,
      estimatedScope: p.estimatedScope,
      requiredPathIds: p.requiredPathIds,
      requiredQuizIds: p.requiredQuizIds,
      requiredScenarioIds: p.requiredScenarioIds,
      recommendedTopicIds: p.recommendedTopicIds,
    }));
    return {
      programmes: [...trainingAssignments, ...customProgrammes],
      customProgrammes,
      createProgramme: (programme: Omit<AdminCustomProgramme, "id">) =>
        org.create({ ...programme, recommendedTopicIds: programme.recommendedTopicIds ?? [], organizationId: activeOrganizationId, createdBy: user?.id ?? "" }),
      deleteProgramme: org.remove,
    };
  }

  return demo;
}
