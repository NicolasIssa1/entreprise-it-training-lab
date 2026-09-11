/**
 * Pure rank comparison for OrganizationRole ("owner" > "admin" > "manager" >
 * "learner") — zero `@/`-aliased imports, same testability pattern as
 * roleRules.ts. Deliberately separate from roleRules.ts's UserRole
 * comparison: OrganizationRole has a 4th value ("owner") that the platform-
 * level demo/dev role (lib/roleRules.ts) does not, and the two must never be
 * confused — see root CLAUDE.md's Phase 13 section 16. This is a DISPLAY/UX
 * convenience only; the actual authoritative rank comparison lives
 * server-side in org_role_at_least() (supabase/migrations/0006_multi_tenant.sql),
 * which this mirrors exactly and must be kept in sync with.
 */
export type OrganizationRole = "owner" | "admin" | "manager" | "learner";

const ORG_ROLE_RANK: Record<OrganizationRole, number> = { owner: 4, admin: 3, manager: 2, learner: 1 };

export function organizationRoleAtLeast(role: OrganizationRole, minimum: OrganizationRole): boolean {
  return ORG_ROLE_RANK[role] >= ORG_ROLE_RANK[minimum];
}
