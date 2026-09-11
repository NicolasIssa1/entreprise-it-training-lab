import { getSupabaseClient } from "@/lib/supabase/client";
import {
  Organization,
  OrganizationMembership,
  OrganizationMemberProfile,
  OrganizationInvite,
  InvitePreview,
  OrgCohort,
  OrgProgramme,
  OrgAssignment,
  OrganizationRole,
  OrganizationType,
  AdminAssignmentRequirementType,
  AdminAssignmentTargetType,
} from "@/lib/types";

/**
 * The only file that talks to Supabase for Phase 13's organization domain —
 * same "repository layer" convention as every other domain (see root
 * CLAUDE.md's Phase 5 section). Every mutation that touches
 * organizations/organization_members goes through an RPC (see
 * supabase/migrations/0006_multi_tenant.sql) rather than a raw
 * insert/update — there is no client insert/update policy on those tables
 * for exactly that reason. This file never re-implements an authorization
 * decision; it only calls the RPC and surfaces whatever Postgres decides.
 */

function toOrganization(row: { id: string; name: string; slug: string; org_type: string; created_by: string; created_at: string }): Organization {
  return { id: row.id, name: row.name, slug: row.slug, orgType: row.org_type as OrganizationType, createdBy: row.created_by, createdAt: row.created_at };
}

function toMembership(row: { id: string; organization_id: string; user_id: string; role: string; status: string; joined_at: string }): OrganizationMembership {
  return {
    id: row.id,
    organizationId: row.organization_id,
    userId: row.user_id,
    role: row.role as OrganizationRole,
    status: row.status as "active" | "removed",
    joinedAt: row.joined_at,
  };
}

/** Every organization the current user actively belongs to, with the
 * organization's own details embedded via the FK relationship. */
export async function fetchMyMemberships(): Promise<{ membership: OrganizationMembership; organization: Organization }[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("organization_members")
    .select("*, organizations(*)")
    .eq("status", "active")
    .order("joined_at", { ascending: true });
  if (error || !data) throw error ?? new Error("Failed to load organization memberships");
  return data
    .filter((row): row is typeof row & { organizations: NonNullable<(typeof row)["organizations"]> } => !!row.organizations)
    .map((row) => ({ membership: toMembership(row), organization: toOrganization(row.organizations) }));
}

export async function createOrganization(name: string, slug: string, orgType: OrganizationType): Promise<string> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Cloud accounts aren't available in Local Demo Mode.");
  const { data, error } = await supabase.rpc("create_organization", { p_name: name, p_slug: slug, p_org_type: orgType });
  if (error || !data) throw error ?? new Error("Failed to create organization");
  return data;
}

/** The full roster of an organization — RLS silently returns only what the
 * caller is authorized to see (their own row if a plain learner, the whole
 * roster if manager+). display_name is joined from profiles, which has its
 * own matching org-member SELECT policy (see the migration). */
export async function fetchOrganizationMembers(organizationId: string): Promise<OrganizationMemberProfile[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data: members, error } = await supabase
    .from("organization_members")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("status", "active");
  if (error || !members) throw error ?? new Error("Failed to load organization members");

  const userIds = members.map((m) => m.user_id);
  const { data: profiles } = await supabase.from("profiles").select("id, display_name").in("id", userIds.length > 0 ? userIds : ["00000000-0000-0000-0000-000000000000"]);
  const nameById = new Map((profiles ?? []).map((p) => [p.id, p.display_name]));

  return members.map((m) => ({ ...toMembership(m), displayName: nameById.get(m.user_id) ?? null }));
}

export async function inviteToOrganization(organizationId: string, email: string, role: Exclude<OrganizationRole, "owner">): Promise<string> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Cloud accounts aren't available in Local Demo Mode.");
  const { data, error } = await supabase.rpc("invite_to_organization", { p_organization_id: organizationId, p_email: email, p_role: role });
  if (error || !data) throw error ?? new Error("Failed to create invite");
  return data;
}

export async function fetchPendingInvites(organizationId: string): Promise<OrganizationInvite[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("organization_invites")
    .select("*")
    .eq("organization_id", organizationId)
    .eq("status", "pending")
    .order("created_at", { ascending: false });
  if (error || !data) throw error ?? new Error("Failed to load invites");
  return data.map((row) => ({
    id: row.id,
    organizationId: row.organization_id,
    email: row.email,
    role: row.role as Exclude<OrganizationRole, "owner">,
    status: row.status as OrganizationInvite["status"],
    invitedBy: row.invited_by,
    token: row.token,
    createdAt: row.created_at,
  }));
}

export async function getInvitePreview(token: string): Promise<InvitePreview | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data, error } = await supabase.rpc("get_invite_preview", { p_token: token });
  if (error) throw error;
  const row = data?.[0];
  if (!row) return null;
  return { organizationName: row.organization_name, role: row.role as Exclude<OrganizationRole, "owner">, email: row.email, status: row.status as InvitePreview["status"] };
}

export async function acceptOrganizationInvite(token: string): Promise<string> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Cloud accounts aren't available in Local Demo Mode.");
  const { data, error } = await supabase.rpc("accept_organization_invite", { p_token: token });
  if (error || !data) throw error ?? new Error("Failed to accept invite");
  return data;
}

export async function updateOrganizationMemberRole(organizationId: string, targetUserId: string, newRole: Exclude<OrganizationRole, "owner">): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.rpc("update_member_role", { p_organization_id: organizationId, p_target_user_id: targetUserId, p_new_role: newRole });
  if (error) throw error;
}

export async function removeOrganizationMember(organizationId: string, targetUserId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.rpc("remove_member", { p_organization_id: organizationId, p_target_user_id: targetUserId });
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Cohorts
// ---------------------------------------------------------------------------

export async function fetchOrganizationCohorts(organizationId: string): Promise<OrgCohort[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data: cohorts, error } = await supabase.from("cohorts").select("*").eq("organization_id", organizationId);
  if (error || !cohorts) throw error ?? new Error("Failed to load cohorts");

  const { data: members } = await supabase
    .from("cohort_members")
    .select("cohort_id, user_id")
    .in("cohort_id", cohorts.length > 0 ? cohorts.map((c) => c.id) : ["00000000-0000-0000-0000-000000000000"]);

  return cohorts.map((c) => ({
    id: c.id,
    organizationId: c.organization_id,
    name: c.name,
    description: c.description,
    createdBy: c.created_by,
    createdAt: c.created_at,
    memberUserIds: (members ?? []).filter((m) => m.cohort_id === c.id).map((m) => m.user_id),
  }));
}

export async function createOrganizationCohort(organizationId: string, name: string, description: string, createdBy: string): Promise<string> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Cloud accounts aren't available in Local Demo Mode.");
  const { data, error } = await supabase.from("cohorts").insert({ organization_id: organizationId, name, description, created_by: createdBy }).select("id").single();
  if (error || !data) throw error ?? new Error("Failed to create cohort");
  return data.id;
}

export async function deleteOrganizationCohort(cohortId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("cohorts").delete().eq("id", cohortId);
  if (error) throw error;
}

export async function addCohortMember(cohortId: string, userId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("cohort_members").insert({ cohort_id: cohortId, user_id: userId });
  if (error) throw error;
}

export async function removeCohortMember(cohortId: string, userId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("cohort_members").delete().eq("cohort_id", cohortId).eq("user_id", userId);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Programmes
// ---------------------------------------------------------------------------

export async function fetchOrganizationProgrammes(organizationId: string): Promise<OrgProgramme[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("organization_programmes").select("*").eq("organization_id", organizationId);
  if (error || !data) throw error ?? new Error("Failed to load programmes");
  return data.map((p) => ({
    id: p.id,
    organizationId: p.organization_id,
    title: p.title,
    audience: p.audience,
    purpose: p.purpose,
    estimatedScope: p.estimated_scope,
    requiredPathIds: (p.required_path_ids as string[]) ?? [],
    requiredQuizIds: (p.required_quiz_ids as string[]) ?? [],
    requiredScenarioIds: (p.required_scenario_ids as string[]) ?? [],
    recommendedTopicIds: (p.recommended_topic_ids as string[]) ?? [],
    createdBy: p.created_by,
    createdAt: p.created_at,
  }));
}

export async function createOrganizationProgramme(input: Omit<OrgProgramme, "id" | "createdAt">): Promise<string> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Cloud accounts aren't available in Local Demo Mode.");
  const { data, error } = await supabase
    .from("organization_programmes")
    .insert({
      organization_id: input.organizationId,
      title: input.title,
      audience: input.audience,
      purpose: input.purpose,
      estimated_scope: input.estimatedScope,
      required_path_ids: input.requiredPathIds,
      required_quiz_ids: input.requiredQuizIds,
      required_scenario_ids: input.requiredScenarioIds,
      recommended_topic_ids: input.recommendedTopicIds,
      created_by: input.createdBy,
    })
    .select("id")
    .single();
  if (error || !data) throw error ?? new Error("Failed to create programme");
  return data.id;
}

export async function deleteOrganizationProgramme(programmeId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("organization_programmes").delete().eq("id", programmeId);
  if (error) throw error;
}

// ---------------------------------------------------------------------------
// Assignments
// ---------------------------------------------------------------------------

export async function fetchOrganizationAssignments(organizationId: string): Promise<OrgAssignment[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("organization_assignments").select("*").eq("organization_id", organizationId);
  if (error || !data) throw error ?? new Error("Failed to load assignments");
  return data.map((a) => ({
    id: a.id,
    organizationId: a.organization_id,
    targetType: a.target_type as AdminAssignmentTargetType,
    targetId: a.target_id,
    requirementType: a.requirement_type as AdminAssignmentRequirementType,
    requirementId: a.requirement_id,
    requirementTitle: a.requirement_title,
    dueDate: a.due_date,
    instructions: a.instructions,
    assignedBy: a.assigned_by,
    assignedAt: a.assigned_at,
  }));
}

export async function createOrganizationAssignment(input: Omit<OrgAssignment, "id" | "assignedAt">): Promise<string> {
  const supabase = getSupabaseClient();
  if (!supabase) throw new Error("Cloud accounts aren't available in Local Demo Mode.");
  const { data, error } = await supabase
    .from("organization_assignments")
    .insert({
      organization_id: input.organizationId,
      target_type: input.targetType,
      target_id: input.targetId,
      requirement_type: input.requirementType,
      requirement_id: input.requirementId,
      requirement_title: input.requirementTitle,
      due_date: input.dueDate,
      instructions: input.instructions,
      assigned_by: input.assignedBy,
    })
    .select("id")
    .single();
  if (error || !data) throw error ?? new Error("Failed to create assignment");
  return data.id;
}

export async function deleteOrganizationAssignment(assignmentId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("organization_assignments").delete().eq("id", assignmentId);
  if (error) throw error;
}
