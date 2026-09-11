-- Enterprise IT Training Lab / DHL IT Training Hub — Phase 13 Multi-Tenant SaaS
-- Architecture.
--
-- SECURITY-CRITICAL MIGRATION. Purely additive on top of 0001-0005 — no
-- existing table/column/policy is dropped, weakened, or wiped. Every new
-- cross-user read is granted by an ADDITIONAL policy alongside the existing
-- `auth.uid() = user_id` one (Postgres OR's same-command policies together),
-- so nothing a user could already do stops working and nothing they
-- couldn't already do becomes possible except the specific, narrow,
-- organization-scoped grants documented inline below. Safe to re-run (every
-- statement guarded with "if not exists"/"or replace"/"drop ... if exists").
--
-- ============================================================================
-- WHY THIS SHAPE (read before touching any policy below)
-- ============================================================================
-- The trust anchor for every cross-user grant in this file is
-- `organization_members` — a row proves "this user has this role in this
-- organization." Every other policy in this migration ultimately reduces to
-- a check against that table, via the two SECURITY DEFINER helper functions
-- below (org_role / org_role_at_least / can_view_org_member).
--
-- These helpers are SECURITY DEFINER so they can read organization_members
-- without being blocked by organization_members' OWN RLS (which would
-- otherwise create a circular dependency — a documented, standard Supabase
-- pattern for exactly this situation, not a shortcut). Each one is `stable`,
-- has an explicit `set search_path = public` (prevents search_path
-- hijacking — the standard hardening for SECURITY DEFINER functions), reads
-- auth.uid() itself rather than trusting a caller-supplied "who am I"
-- argument, and does nothing but SELECT — none of them can be used to
-- escalate a caller's own privileges.
--
-- Membership/role MUTATIONS (creating an org, inviting, accepting an invite,
-- changing a member's role, removing a member) are NEVER done via a raw
-- client .insert()/.update() call against organization_members or
-- organizations — there is no RLS policy that would allow that. They ALWAYS
-- go through one of the 6 RPC functions below, each of which is SECURITY
-- DEFINER but re-validates the caller's authorization *inside the function
-- body itself* before doing anything (since SECURITY DEFINER bypasses RLS,
-- skipping that internal check would be the actual privilege-escalation
-- hole — every function below explicitly re-checks). This is what makes
-- self-promotion structurally impossible rather than merely discouraged by
-- application code.
--
-- GLOBAL PLATFORM CONTENT vs ORGANIZATION-SPECIFIC DATA:
-- Learn topics, quizzes, investigation scenarios, Automation Lab scenarios,
-- and the 6 built-in Training Assignments/Programmes remain plain
-- application code/config (lib/data/*) — never given an organization_id,
-- never moved into a table. They are shared platform curriculum, the same
-- for every organization, exactly as CLAUDE.md's Phase 5 section already
-- established for static content generally. Only genuinely
-- organization-specific things (who belongs to the org, its cohorts, its
-- custom programmes, its issued assignments, its settings) get an
-- organization_id.
--
-- PRIVACY BOUNDARY PRESERVED: this migration adds manager/admin/owner
-- read access to a member's TRAINING evidence (learning_progress,
-- quiz_attempts, investigation_progress, investigation_completions,
-- automation_lab_attempts, milestone_unlocks, certificates) and their
-- profiles row (for display_name) — because that's what a manager
-- legitimately needs to do their job (root CLAUDE.md's Phase 8 "what a
-- manager view needs"). It deliberately does NOT touch daily_logs,
-- cv_achievements, tutor_conversations, or tutor_messages — those stay
-- strictly `auth.uid() = user_id` only, exactly as Phase 6/8 established
-- ("no free-text content available to leak, not just a runtime filter
-- hiding it"). Multi-tenancy does not change that rule.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- organizations
-- ----------------------------------------------------------------------------
create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  org_type text not null,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.organizations drop constraint if exists organizations_org_type_check;
alter table public.organizations add constraint organizations_org_type_check
  check (org_type in ('company', 'university', 'training_provider', 'other'));

alter table public.organizations drop constraint if exists organizations_slug_format_check;
alter table public.organizations add constraint organizations_slug_format_check
  check (slug ~ '^[a-z0-9]([a-z0-9-]{0,48}[a-z0-9])?$');

-- ----------------------------------------------------------------------------
-- organization_members — the trust anchor every policy below reduces to.
-- Soft-deleted (status = 'removed') rather than hard-deleted on removal, so
-- a removed member's history/audit trail is preserved rather than wiped —
-- consistent with this project's "data loss is worse than duplication"
-- philosophy (see root CLAUDE.md's Phase 5 migration section).
-- ----------------------------------------------------------------------------
create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null,
  status text not null default 'active',
  invited_by uuid references auth.users (id),
  joined_at timestamptz not null default now(),
  unique (organization_id, user_id)
);

alter table public.organization_members drop constraint if exists organization_members_role_check;
alter table public.organization_members add constraint organization_members_role_check
  check (role in ('owner', 'admin', 'manager', 'learner'));

alter table public.organization_members drop constraint if exists organization_members_status_check;
alter table public.organization_members add constraint organization_members_status_check
  check (status in ('active', 'removed'));

create index if not exists organization_members_org_idx on public.organization_members (organization_id) where status = 'active';
create index if not exists organization_members_user_idx on public.organization_members (user_id) where status = 'active';

-- ----------------------------------------------------------------------------
-- organization_invites — a real invite RECORD, never a real email send (no
-- email service is configured in this environment). The UI must clearly
-- label this as "not sent" and surface a shareable join link instead — see
-- src/app/organizations/[organizationId]/members/page.tsx.
-- ----------------------------------------------------------------------------
create table if not exists public.organization_invites (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  email text not null,
  role text not null,
  status text not null default 'pending',
  invited_by uuid not null references auth.users (id),
  token uuid not null unique default gen_random_uuid(),
  created_at timestamptz not null default now(),
  accepted_at timestamptz,
  accepted_by uuid references auth.users (id)
);

alter table public.organization_invites drop constraint if exists organization_invites_role_check;
alter table public.organization_invites add constraint organization_invites_role_check
  check (role in ('admin', 'manager', 'learner'));

alter table public.organization_invites drop constraint if exists organization_invites_status_check;
alter table public.organization_invites add constraint organization_invites_status_check
  check (status in ('pending', 'accepted', 'revoked'));

create index if not exists organization_invites_org_idx on public.organization_invites (organization_id);

-- ----------------------------------------------------------------------------
-- cohorts / cohort_members — REAL, organization-scoped cohorts. Distinct
-- from the Phase 12 fictional demo cohorts (lib/data/admin/demoLearners.ts),
-- which remain local/client-only and are never written here.
-- ----------------------------------------------------------------------------
create table if not exists public.cohorts (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  name text not null,
  description text not null default '',
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists cohorts_org_idx on public.cohorts (organization_id);

create table if not exists public.cohort_members (
  id uuid primary key default gen_random_uuid(),
  cohort_id uuid not null references public.cohorts (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  added_at timestamptz not null default now(),
  unique (cohort_id, user_id)
);

create index if not exists cohort_members_cohort_idx on public.cohort_members (cohort_id);
create index if not exists cohort_members_user_idx on public.cohort_members (user_id);

-- ----------------------------------------------------------------------------
-- organization_programmes — custom, organization-defined Programmes. Same
-- shape as the existing static TrainingAssignment (Phase 9/12) — the 6
-- built-in Programmes stay application code; this table only holds ones an
-- organization defines for itself.
-- ----------------------------------------------------------------------------
create table if not exists public.organization_programmes (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  title text not null,
  audience text not null default '',
  purpose text not null default '',
  estimated_scope text not null default '',
  required_path_ids jsonb not null default '[]'::jsonb,
  required_quiz_ids jsonb not null default '[]'::jsonb,
  required_scenario_ids jsonb not null default '[]'::jsonb,
  recommended_topic_ids jsonb not null default '[]'::jsonb,
  created_by uuid not null references auth.users (id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists organization_programmes_org_idx on public.organization_programmes (organization_id);

-- ----------------------------------------------------------------------------
-- organization_assignments — REAL, organization-scoped assignments (mirrors
-- the Phase 12 local-only AdminAssignmentRecord shape). target_id is a
-- polymorphic reference (a user_id when target_type = 'learner', a cohort_id
-- when target_type = 'cohort') validated at the application layer and by
-- the RLS policies below — not a single FK, documented as a deliberate,
-- low-risk trade-off (the real trust boundary is organization_id, enforced
-- by RLS regardless of what target_id contains).
-- ----------------------------------------------------------------------------
create table if not exists public.organization_assignments (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations (id) on delete cascade,
  target_type text not null,
  target_id uuid not null,
  requirement_type text not null,
  requirement_id text not null,
  requirement_title text not null,
  due_date timestamptz,
  instructions text not null default '',
  assigned_by uuid not null references auth.users (id),
  assigned_at timestamptz not null default now()
);

alter table public.organization_assignments drop constraint if exists organization_assignments_target_type_check;
alter table public.organization_assignments add constraint organization_assignments_target_type_check
  check (target_type in ('learner', 'cohort'));

alter table public.organization_assignments drop constraint if exists organization_assignments_requirement_type_check;
alter table public.organization_assignments add constraint organization_assignments_requirement_type_check
  check (requirement_type in ('path', 'quiz', 'investigation', 'automation-scenario'));

create index if not exists organization_assignments_org_idx on public.organization_assignments (organization_id);

-- ----------------------------------------------------------------------------
-- organization_settings — one row per organization, extensible via a jsonb
-- bag so future settings don't each need their own migration.
-- ----------------------------------------------------------------------------
create table if not exists public.organization_settings (
  organization_id uuid primary key references public.organizations (id) on delete cascade,
  display_name text,
  settings jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- ============================================================================
-- SECURITY DEFINER HELPER FUNCTIONS — the only place cross-row membership
-- checks happen. See the header comment above for why these are safe.
-- ============================================================================

create or replace function public.org_role(p_organization_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role from public.organization_members
  where organization_id = p_organization_id
    and user_id = auth.uid()
    and status = 'active'
  limit 1;
$$;

create or replace function public.org_role_at_least(p_organization_id uuid, p_min_role text)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    (
      case public.org_role(p_organization_id)
        when 'owner' then 4 when 'admin' then 3 when 'manager' then 2 when 'learner' then 1 else 0
      end
    ) >= (
      case p_min_role
        when 'owner' then 4 when 'admin' then 3 when 'manager' then 2 when 'learner' then 1 else 0
      end
    ),
    false
  );
$$;

/** True if the caller is an active manager/admin/owner in any organization
 * where p_target_user_id is also an active member — the single primitive
 * used by every "manager can view a learner's training evidence" policy
 * below. Never grants write access, only read. */
create or replace function public.can_view_org_member(p_target_user_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members target
    join public.organization_members viewer
      on viewer.organization_id = target.organization_id
     and viewer.user_id = auth.uid()
     and viewer.status = 'active'
     and viewer.role in ('manager', 'admin', 'owner')
    where target.user_id = p_target_user_id
      and target.status = 'active'
  );
$$;

revoke all on function public.org_role(uuid) from public, anon;
revoke all on function public.org_role_at_least(uuid, text) from public, anon;
revoke all on function public.can_view_org_member(uuid) from public, anon;
grant execute on function public.org_role(uuid) to authenticated;
grant execute on function public.org_role_at_least(uuid, text) to authenticated;
grant execute on function public.can_view_org_member(uuid) to authenticated;

-- ============================================================================
-- RPC FUNCTIONS — the ONLY way membership/role/organization state mutates.
-- Each is SECURITY DEFINER (so it can write organization_members despite no
-- client INSERT/UPDATE policy existing on that table) but re-checks the
-- caller's authorization inside the function body every time — this is what
-- makes self-promotion and cross-tenant writes structurally impossible
-- rather than merely discouraged by application code.
-- ============================================================================

create or replace function public.create_organization(p_name text, p_slug text, p_org_type text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_org_id uuid;
begin
  if p_org_type not in ('company', 'university', 'training_provider', 'other') then
    raise exception 'Invalid organization type';
  end if;
  if p_slug !~ '^[a-z0-9]([a-z0-9-]{0,48}[a-z0-9])?$' then
    raise exception 'Slug must be lowercase letters, numbers, and hyphens only';
  end if;
  if trim(p_name) = '' then
    raise exception 'Organization name is required';
  end if;

  insert into public.organizations (name, slug, org_type, created_by)
  values (trim(p_name), p_slug, p_org_type, auth.uid())
  returning id into v_org_id;

  insert into public.organization_members (organization_id, user_id, role, status)
  values (v_org_id, auth.uid(), 'owner', 'active');

  insert into public.organization_settings (organization_id) values (v_org_id);

  return v_org_id;
end;
$$;

create or replace function public.invite_to_organization(p_organization_id uuid, p_email text, p_role text)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller_role text;
  v_invite_id uuid;
begin
  if p_role not in ('admin', 'manager', 'learner') then
    raise exception 'Invalid role';
  end if;

  v_caller_role := public.org_role(p_organization_id);
  if v_caller_role is null or v_caller_role not in ('owner', 'admin') then
    raise exception 'Not authorized to invite members to this organization';
  end if;
  if p_role = 'admin' and v_caller_role <> 'owner' then
    raise exception 'Only the owner can invite an admin';
  end if;

  insert into public.organization_invites (organization_id, email, role, invited_by)
  values (p_organization_id, lower(trim(p_email)), p_role, auth.uid())
  returning id into v_invite_id;

  return v_invite_id;
end;
$$;

create or replace function public.accept_organization_invite(p_token uuid)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_invite record;
  v_caller_email text;
begin
  select * into v_invite from public.organization_invites where token = p_token;
  if v_invite is null then
    raise exception 'Invite not found';
  end if;
  if v_invite.status <> 'pending' then
    raise exception 'This invite has already been used or revoked';
  end if;

  select email into v_caller_email from auth.users where id = auth.uid();
  if v_caller_email is null or lower(v_caller_email) <> v_invite.email then
    raise exception 'This invite was sent to a different email address than the one you are signed in with';
  end if;

  insert into public.organization_members (organization_id, user_id, role, status, invited_by)
  values (v_invite.organization_id, auth.uid(), v_invite.role, 'active', v_invite.invited_by)
  on conflict (organization_id, user_id) do update set status = 'active', role = excluded.role;

  update public.organization_invites
    set status = 'accepted', accepted_at = now(), accepted_by = auth.uid()
    where id = v_invite.id;

  return v_invite.organization_id;
end;
$$;

create or replace function public.get_invite_preview(p_token uuid)
returns table (organization_name text, role text, email text, status text)
language sql
stable
security definer
set search_path = public
as $$
  select o.name, i.role, i.email, i.status
  from public.organization_invites i
  join public.organizations o on o.id = i.organization_id
  where i.token = p_token;
$$;

/** The sole path for changing a member's role. A caller can NEVER change
 * their own role (self-promotion is structurally blocked here, not just
 * discouraged by the UI), only owner/admin may call this at all, only the
 * owner may grant 'admin', and nobody may touch the owner's own role. */
create or replace function public.update_member_role(p_organization_id uuid, p_target_user_id uuid, p_new_role text)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller_role text;
  v_target_role text;
begin
  if p_new_role not in ('admin', 'manager', 'learner') then
    raise exception 'Invalid role';
  end if;
  if p_target_user_id = auth.uid() then
    raise exception 'You cannot change your own role';
  end if;

  v_caller_role := public.org_role(p_organization_id);
  if v_caller_role is null or v_caller_role not in ('owner', 'admin') then
    raise exception 'Not authorized';
  end if;

  select role into v_target_role from public.organization_members
    where organization_id = p_organization_id and user_id = p_target_user_id and status = 'active';
  if v_target_role is null then
    raise exception 'Member not found';
  end if;
  if v_target_role = 'owner' then
    raise exception 'Cannot change the owner''s role';
  end if;
  if p_new_role = 'admin' and v_caller_role <> 'owner' then
    raise exception 'Only the owner can grant admin role';
  end if;

  update public.organization_members
    set role = p_new_role
    where organization_id = p_organization_id and user_id = p_target_user_id;
end;
$$;

/** Soft-removes a member (status = 'removed'), or lets a non-owner leave
 * voluntarily. The owner can never be removed by anyone (including
 * themselves) in this phase — ownership transfer is out of scope, see the
 * Phase 13 completion report. */
create or replace function public.remove_member(p_organization_id uuid, p_target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_caller_role text;
  v_target_role text;
begin
  v_caller_role := public.org_role(p_organization_id);
  select role into v_target_role from public.organization_members
    where organization_id = p_organization_id and user_id = p_target_user_id and status = 'active';

  if v_target_role is null then
    raise exception 'Member not found';
  end if;

  if p_target_user_id = auth.uid() then
    if v_target_role = 'owner' then
      raise exception 'The owner cannot leave the organization — ownership transfer is not built in this phase';
    end if;
  else
    if v_caller_role is null or v_caller_role not in ('owner', 'admin') then
      raise exception 'Not authorized';
    end if;
    if v_target_role = 'owner' then
      raise exception 'Cannot remove the owner';
    end if;
  end if;

  update public.organization_members
    set status = 'removed'
    where organization_id = p_organization_id and user_id = p_target_user_id;
end;
$$;

revoke all on function public.create_organization(text, text, text) from public, anon;
revoke all on function public.invite_to_organization(uuid, text, text) from public, anon;
revoke all on function public.accept_organization_invite(uuid) from public, anon;
revoke all on function public.get_invite_preview(uuid) from public, anon;
revoke all on function public.update_member_role(uuid, uuid, text) from public, anon;
revoke all on function public.remove_member(uuid, uuid) from public, anon;
grant execute on function public.create_organization(text, text, text) to authenticated;
grant execute on function public.invite_to_organization(uuid, text, text) to authenticated;
grant execute on function public.accept_organization_invite(uuid) to authenticated;
grant execute on function public.get_invite_preview(uuid) to authenticated;
grant execute on function public.update_member_role(uuid, uuid, text) to authenticated;
grant execute on function public.remove_member(uuid, uuid) to authenticated;

-- ============================================================================
-- ROW LEVEL SECURITY — every new table enabled, no exceptions.
-- ============================================================================

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_invites enable row level security;
alter table public.cohorts enable row level security;
alter table public.cohort_members enable row level security;
alter table public.organization_programmes enable row level security;
alter table public.organization_assignments enable row level security;
alter table public.organization_settings enable row level security;

-- organizations: visible to active members only. No client INSERT policy —
-- creation only happens via create_organization(). UPDATE (e.g. renaming)
-- is allowed for admin+; slug changes are intentionally not exposed in the
-- UI even though RLS can't restrict individual columns, since a changing
-- slug would break outstanding invite/join links.
drop policy if exists "organizations_select_member" on public.organizations;
create policy "organizations_select_member" on public.organizations
  for select using (public.org_role_at_least(id, 'learner'));
drop policy if exists "organizations_update_admin" on public.organizations;
create policy "organizations_update_admin" on public.organizations
  for update using (public.org_role_at_least(id, 'admin')) with check (public.org_role_at_least(id, 'admin'));

-- organization_members: your own row is always visible; the full roster is
-- visible to manager+ (a plain learner does not see who else is enrolled).
-- No client INSERT/UPDATE/DELETE policy at all — every mutation goes
-- through the RPCs above.
drop policy if exists "organization_members_select" on public.organization_members;
create policy "organization_members_select" on public.organization_members
  for select using (user_id = auth.uid() or public.org_role_at_least(organization_id, 'manager'));

-- organization_invites: visible to admin+ of that organization only (an
-- invitee previews their own invite via get_invite_preview(), which is
-- token-gated, not membership-gated, since they aren't a member yet). No
-- client INSERT/UPDATE — invite_to_organization()/accept_organization_invite()
-- are the only mutation paths.
drop policy if exists "organization_invites_select_admin" on public.organization_invites;
create policy "organization_invites_select_admin" on public.organization_invites
  for select using (public.org_role_at_least(organization_id, 'admin'));

-- cohorts: manager+ sees every cohort in their organization; a learner sees
-- only cohorts they are actually a member of. Admin+ manages (create/
-- rename/delete) — this is "cohort management," reserved above manager per
-- the Phase 13 spec's role table.
drop policy if exists "cohorts_select" on public.cohorts;
create policy "cohorts_select" on public.cohorts
  for select using (
    public.org_role_at_least(organization_id, 'manager')
    or exists (select 1 from public.cohort_members cm where cm.cohort_id = id and cm.user_id = auth.uid())
  );
drop policy if exists "cohorts_insert_admin" on public.cohorts;
create policy "cohorts_insert_admin" on public.cohorts
  for insert with check (public.org_role_at_least(organization_id, 'admin') and created_by = auth.uid());
drop policy if exists "cohorts_update_admin" on public.cohorts;
create policy "cohorts_update_admin" on public.cohorts
  for update using (public.org_role_at_least(organization_id, 'admin')) with check (public.org_role_at_least(organization_id, 'admin'));
drop policy if exists "cohorts_delete_admin" on public.cohorts;
create policy "cohorts_delete_admin" on public.cohorts
  for delete using (public.org_role_at_least(organization_id, 'admin'));

-- cohort_members: a learner can always see their own membership row;
-- manager+ (of that cohort's organization) sees the full cohort roster.
-- Admin+ manages membership, and — this is the tenant-isolation guarantee
-- for section 8 — the WITH CHECK clause requires the target user to already
-- be an active member of the SAME organization the cohort belongs to, so a
-- cohort in Organization A can never gain a member from Organization B, even
-- by an admin's mistake or a manipulated request.
drop policy if exists "cohort_members_select" on public.cohort_members;
create policy "cohort_members_select" on public.cohort_members
  for select using (
    user_id = auth.uid()
    or public.org_role_at_least((select organization_id from public.cohorts where id = cohort_id), 'manager')
  );
drop policy if exists "cohort_members_insert_admin" on public.cohort_members;
create policy "cohort_members_insert_admin" on public.cohort_members
  for insert with check (
    public.org_role_at_least((select organization_id from public.cohorts where id = cohort_id), 'admin')
    and exists (
      select 1 from public.organization_members om
      where om.user_id = cohort_members.user_id
        and om.organization_id = (select organization_id from public.cohorts where id = cohort_members.cohort_id)
        and om.status = 'active'
    )
  );
drop policy if exists "cohort_members_delete_admin" on public.cohort_members;
create policy "cohort_members_delete_admin" on public.cohort_members
  for delete using (public.org_role_at_least((select organization_id from public.cohorts where id = cohort_id), 'admin'));

-- organization_programmes: readable by any active member (curriculum
-- bundles are not sensitive); admin+ manages.
drop policy if exists "organization_programmes_select" on public.organization_programmes;
create policy "organization_programmes_select" on public.organization_programmes
  for select using (public.org_role_at_least(organization_id, 'learner'));
drop policy if exists "organization_programmes_insert_admin" on public.organization_programmes;
create policy "organization_programmes_insert_admin" on public.organization_programmes
  for insert with check (public.org_role_at_least(organization_id, 'admin') and created_by = auth.uid());
drop policy if exists "organization_programmes_delete_admin" on public.organization_programmes;
create policy "organization_programmes_delete_admin" on public.organization_programmes
  for delete using (public.org_role_at_least(organization_id, 'admin'));

-- organization_assignments: manager+ sees every assignment in their
-- organization; a learner sees only assignments targeted directly at them
-- or at a cohort they belong to — never another learner's individual
-- assignment. Manager+ issues assignments (with check enforces assigned_by
-- = auth.uid(), so nobody can attribute an assignment to someone else); the
-- issuer or admin+ may delete one.
drop policy if exists "organization_assignments_select" on public.organization_assignments;
create policy "organization_assignments_select" on public.organization_assignments
  for select using (
    public.org_role_at_least(organization_id, 'manager')
    or (target_type = 'learner' and target_id = auth.uid())
    or (target_type = 'cohort' and exists (select 1 from public.cohort_members cm where cm.cohort_id = target_id and cm.user_id = auth.uid()))
  );
drop policy if exists "organization_assignments_insert_manager" on public.organization_assignments;
create policy "organization_assignments_insert_manager" on public.organization_assignments
  for insert with check (public.org_role_at_least(organization_id, 'manager') and assigned_by = auth.uid());
drop policy if exists "organization_assignments_delete" on public.organization_assignments;
create policy "organization_assignments_delete" on public.organization_assignments
  for delete using (assigned_by = auth.uid() or public.org_role_at_least(organization_id, 'admin'));

-- organization_settings: readable by any active member (org display
-- name/branding), writable by admin+.
drop policy if exists "organization_settings_select" on public.organization_settings;
create policy "organization_settings_select" on public.organization_settings
  for select using (public.org_role_at_least(organization_id, 'learner'));
drop policy if exists "organization_settings_update_admin" on public.organization_settings;
create policy "organization_settings_update_admin" on public.organization_settings
  for update using (public.org_role_at_least(organization_id, 'admin')) with check (public.org_role_at_least(organization_id, 'admin'));

-- ============================================================================
-- ADDITIVE cross-user SELECT policies on existing evidence tables — a
-- manager/admin/owner may now read a fellow organization member's TRAINING
-- evidence. Every existing policy on these tables is left completely
-- untouched; these are new policies alongside them (same-command policies
-- are OR'd by Postgres), so nothing that already worked changes, and this
-- read grant is the ONLY new capability. No write policy is added anywhere
-- here — a manager can view, never edit, a learner's recorded progress.
-- Deliberately NOT applied to daily_logs, cv_achievements,
-- tutor_conversations, or tutor_messages — see the header comment.
-- ============================================================================

drop policy if exists "profiles_select_org_members" on public.profiles;
create policy "profiles_select_org_members" on public.profiles
  for select using (public.can_view_org_member(id));

drop policy if exists "learning_progress_select_org_members" on public.learning_progress;
create policy "learning_progress_select_org_members" on public.learning_progress
  for select using (public.can_view_org_member(user_id));

drop policy if exists "quiz_attempts_select_org_members" on public.quiz_attempts;
create policy "quiz_attempts_select_org_members" on public.quiz_attempts
  for select using (public.can_view_org_member(user_id));

drop policy if exists "investigation_progress_select_org_members" on public.investigation_progress;
create policy "investigation_progress_select_org_members" on public.investigation_progress
  for select using (public.can_view_org_member(user_id));

drop policy if exists "investigation_completions_select_org_members" on public.investigation_completions;
create policy "investigation_completions_select_org_members" on public.investigation_completions
  for select using (public.can_view_org_member(user_id));

drop policy if exists "automation_lab_attempts_select_org_members" on public.automation_lab_attempts;
create policy "automation_lab_attempts_select_org_members" on public.automation_lab_attempts
  for select using (public.can_view_org_member(user_id));

drop policy if exists "milestone_unlocks_select_org_members" on public.milestone_unlocks;
create policy "milestone_unlocks_select_org_members" on public.milestone_unlocks
  for select using (public.can_view_org_member(user_id));

drop policy if exists "certificates_select_org_members" on public.certificates;
create policy "certificates_select_org_members" on public.certificates
  for select using (public.can_view_org_member(user_id));
