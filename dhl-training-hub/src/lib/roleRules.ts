/**
 * Pure role logic (Phase 12) — zero `@/`-aliased imports, same testability
 * pattern as entitlementRules.ts/pureCalculations.ts. UserRole here is
 * structurally identical to the canonical one in lib/types.ts.
 *
 * IMPORTANT — this is NOT a real security boundary. There is no backend
 * enforcement of role anywhere yet (no RLS policy reads it, no server route
 * checks it) — it only gates client-side UI. This is safe *for what Phase 12
 * actually does*: the Enterprise Admin area never queries another real
 * user's Supabase rows (see lib/data/admin/demoLearners.ts) — it only reads
 * the current user's own real data plus fictional local demo data — so
 * there is no real cross-user data-exposure risk for a client-side gate to
 * fail to protect. Once Phase 13 introduces real multi-tenant data (other
 * real users' rows becoming readable to a manager), role MUST move to a
 * server-enforced RLS policy before that data is exposed — see the Phase 12
 * completion report's Security Limitations section.
 */
export type UserRole = "learner" | "manager" | "admin";

const ROLE_RANK: Record<UserRole, number> = { learner: 0, manager: 1, admin: 2 };

export function roleAtLeast(role: UserRole, minimum: UserRole): boolean {
  return ROLE_RANK[role] >= ROLE_RANK[minimum];
}

export function hasAdminAreaAccess(role: UserRole): boolean {
  return roleAtLeast(role, "manager");
}

export function canManageRoster(role: UserRole): boolean {
  return roleAtLeast(role, "manager");
}

export const ROLE_LABELS: Record<UserRole, string> = { learner: "Learner", manager: "Manager", admin: "Admin" };
