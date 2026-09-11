"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { UserRole } from "@/lib/types";
import { USER_ROLES } from "@/lib/types";
import { hasAdminAreaAccess } from "@/lib/roleRules";

function isUserRole(value: string | undefined | null): value is UserRole {
  return !!value && (USER_ROLES as readonly string[]).includes(value);
}

/** Explicit, visible dev/test escape hatch (see .env.example) — mirrors
 * NEXT_PUBLIC_DEV_TIER_OVERRIDE from Phase 11 exactly. Set locally in
 * .env.local (gitignored), never inferred from a specific account. */
const DEV_ROLE_OVERRIDE = process.env.NEXT_PUBLIC_DEV_ROLE_OVERRIDE;

export function useRole(): { role: UserRole; isDevOverride: boolean } {
  const { profile } = useAuth();

  return useMemo(() => {
    if (isUserRole(DEV_ROLE_OVERRIDE)) {
      return { role: DEV_ROLE_OVERRIDE, isDevOverride: true };
    }
    return { role: profile?.role ?? "learner", isDevOverride: false };
  }, [profile]);
}

export function useHasAdminAreaAccess(): boolean {
  const { role } = useRole();
  return hasAdminAreaAccess(role);
}
