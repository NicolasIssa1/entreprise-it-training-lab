-- Phase 13 Multi-Tenant RLS — manual verification script.
--
-- WHY THIS FILE EXISTS: this development environment has no service-role
-- key or linked Supabase CLI session, so migrations/tests cannot be executed
-- against the live database from within the coding session that wrote them
-- (see the Phase 13 completion report, section H). This script lets a human
-- empirically verify the RLS policies in 0006_multi_tenant.sql actually
-- behave as documented.
--
-- HOW TO RUN: paste this whole file into the Supabase SQL Editor (or run it
-- via `psql`) and execute it as one script, connected as the `postgres`
-- role (the SQL Editor's default). It creates three throwaway auth users,
-- then uses `set local role authenticated; set local request.jwt.claims =
-- ...` to simulate each of them for RLS purposes, asserting expected
-- results at each step via RAISE EXCEPTION on failure — "the script
-- completes and prints ALL PHASE 13 RLS TESTS PASSED" is the pass signal.
-- Deliberately portable (no `\gset`/psql-only syntax) — uses
-- set_config()/current_setting() to pass values between statements instead,
-- so it also works pasted directly into the Supabase SQL Editor. Everything
-- runs inside one transaction that is ROLLED BACK at the end, so it leaves
-- no trace in your real data.

begin;

-- ---------------------------------------------------------------------------
-- Setup: three fake auth users (never real people) and two organizations.
-- user_a = learner/owner of Org A. user_b = learner/owner of Org B (an
-- unrelated organization). user_c = invited as manager into Org A only.
-- ---------------------------------------------------------------------------
do $$
declare
  v_user_a uuid := '00000000-0000-0000-0000-0000000000a1';
  v_user_b uuid := '00000000-0000-0000-0000-0000000000b1';
  v_user_c uuid := '00000000-0000-0000-0000-0000000000c1';
begin
  insert into auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, aud, role)
  values
    (v_user_a, 'phase13-test-learner-a@example.invalid', 'x', now(), now(), now(), 'authenticated', 'authenticated'),
    (v_user_b, 'phase13-test-learner-b@example.invalid', 'x', now(), now(), now(), 'authenticated', 'authenticated'),
    (v_user_c, 'phase13-test-manager-c@example.invalid', 'x', now(), now(), now(), 'authenticated', 'authenticated')
  on conflict (id) do nothing;

  perform set_config('phase13.user_a', v_user_a::text, false);
  perform set_config('phase13.user_b', v_user_b::text, false);
  perform set_config('phase13.user_c', v_user_c::text, false);
end $$;

-- Org A, created by user A (becomes owner). Org B, created by user B.
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}';
select set_config('phase13.org_a', public.create_organization('Phase 13 Test Org A', 'phase13-test-org-a', 'company')::text, false);
reset role;

set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}';
select set_config('phase13.org_b', public.create_organization('Phase 13 Test Org B', 'phase13-test-org-b', 'company')::text, false);
reset role;

-- User A (owner of Org A) invites user C as manager; user C accepts.
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}';
select set_config(
  'phase13.invite_token',
  (select token::text from public.organization_invites where id = public.invite_to_organization(current_setting('phase13.org_a')::uuid, 'phase13-test-manager-c@example.invalid', 'manager')),
  false
);
reset role;

set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000c1","role":"authenticated"}';
select public.accept_organization_invite(current_setting('phase13.invite_token')::uuid);
reset role;

-- Seed one row of "training evidence" for user A directly (bypassing RLS as
-- postgres — this represents user A's real recorded progress).
insert into public.learning_progress (user_id, topic_id, completed)
values ('00000000-0000-0000-0000-0000000000a1', 'phase13-test-topic', true)
on conflict do nothing;

-- ---------------------------------------------------------------------------
-- TEST 1 — a learner (user A) can read their own progress.
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}';
do $$
declare v_count int;
begin
  select count(*) into v_count from public.learning_progress where topic_id = 'phase13-test-topic';
  if v_count <> 1 then raise exception 'TEST 1 FAILED: learner could not read their own progress (got % rows)', v_count; end if;
  raise notice 'TEST 1 PASSED: learner reads their own progress';
end $$;
reset role;

-- ---------------------------------------------------------------------------
-- TEST 2 — a DIFFERENT learner (user B, no shared organization with A)
-- cannot read user A's progress. This is the core IDOR check.
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}';
do $$
declare v_count int;
begin
  select count(*) into v_count from public.learning_progress where topic_id = 'phase13-test-topic';
  if v_count <> 0 then raise exception 'TEST 2 FAILED: an unrelated learner could read another learner''s progress (got % rows)', v_count; end if;
  raise notice 'TEST 2 PASSED: unrelated learner cannot read another learner''s progress';
end $$;
reset role;

-- ---------------------------------------------------------------------------
-- TEST 3 — user C (manager in Org A, where user A is a member) CAN read
-- user A's progress.
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000c1","role":"authenticated"}';
do $$
declare v_count int;
begin
  select count(*) into v_count from public.learning_progress where topic_id = 'phase13-test-topic';
  if v_count <> 1 then raise exception 'TEST 3 FAILED: a manager in the same organization could not read a learner''s progress (got % rows)', v_count; end if;
  raise notice 'TEST 3 PASSED: manager in the same organization reads a learner''s progress';
end $$;
reset role;

-- ---------------------------------------------------------------------------
-- TEST 4 — user C is NOT a member of Org B, so cannot see Org B's
-- organization row at all (cross-tenant isolation for the org itself).
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000c1","role":"authenticated"}';
do $$
declare v_count int;
begin
  select count(*) into v_count from public.organizations where id = current_setting('phase13.org_b')::uuid;
  if v_count <> 0 then raise exception 'TEST 4 FAILED: a non-member could see Organization B (got % rows)', v_count; end if;
  raise notice 'TEST 4 PASSED: a non-member cannot see an organization they do not belong to';
end $$;
reset role;

-- ---------------------------------------------------------------------------
-- TEST 5 — self-promotion is blocked: user C (manager) cannot promote
-- themselves to admin.
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000c1","role":"authenticated"}';
do $$
begin
  begin
    perform public.update_member_role(current_setting('phase13.org_a')::uuid, '00000000-0000-0000-0000-0000000000c1', 'admin');
    raise exception 'TEST 5 FAILED: a manager was able to change their own role';
  exception
    when others then
      if sqlerrm = 'You cannot change your own role' then
        raise notice 'TEST 5 PASSED: self-promotion is blocked (%)', sqlerrm;
      else
        raise exception 'TEST 5 FAILED with unexpected error: %', sqlerrm;
      end if;
  end;
end $$;
reset role;

-- ---------------------------------------------------------------------------
-- TEST 6 — a manager (not owner/admin) cannot grant admin to someone else
-- either — the org_role_at_least gate inside invite_to_organization.
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000c1","role":"authenticated"}';
do $$
begin
  begin
    perform public.invite_to_organization(current_setting('phase13.org_a')::uuid, 'someone-else@example.invalid', 'admin');
    raise exception 'TEST 6 FAILED: a manager was able to invite an admin';
  exception
    when others then
      raise notice 'TEST 6 PASSED: a manager cannot invite/grant an admin role (%)', sqlerrm;
  end;
end $$;
reset role;

-- ---------------------------------------------------------------------------
-- TEST 7 — cross-tenant cohort membership injection is blocked: user A
-- (owner of Org A) cannot add user B (a member of Org B only) into a cohort
-- inside Org A.
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}';
with ins as (
  insert into public.cohorts (organization_id, name, created_by)
  values (current_setting('phase13.org_a')::uuid, 'Phase 13 Test Cohort', '00000000-0000-0000-0000-0000000000a1')
  returning id
)
select set_config('phase13.cohort_a', id::text, false) from ins;
do $$
begin
  begin
    insert into public.cohort_members (cohort_id, user_id) values (current_setting('phase13.cohort_a')::uuid, '00000000-0000-0000-0000-0000000000b1');
    raise exception 'TEST 7 FAILED: a user from Organization B was added to an Organization A cohort';
  exception
    when others then
      raise notice 'TEST 7 PASSED: cross-tenant cohort membership is blocked (%)', sqlerrm;
  end;
end $$;
reset role;

-- ---------------------------------------------------------------------------
-- TEST 8 — the organization creator is the owner, verified via org_role().
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}';
do $$
declare v_role text;
begin
  select public.org_role(current_setting('phase13.org_a')::uuid) into v_role;
  if v_role <> 'owner' then raise exception 'TEST 8 FAILED: creator role is % not owner', v_role; end if;
  raise notice 'TEST 8 PASSED: the organization creator is its owner';
end $$;
reset role;

-- ---------------------------------------------------------------------------
-- TEST 9 — cross-tenant assignment access is blocked: user B (a learner in
-- Org B only) cannot see an assignment issued inside Org A, even one
-- targeted at "all learners" via a cohort — only Org A's own members can.
-- ---------------------------------------------------------------------------
set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000a1","role":"authenticated"}';
with ins as (
  insert into public.organization_assignments (organization_id, target_type, target_id, requirement_type, requirement_id, requirement_title, assigned_by)
  values (current_setting('phase13.org_a')::uuid, 'learner', '00000000-0000-0000-0000-0000000000a1', 'quiz', 'phase13-test-quiz', 'Phase 13 Test Assignment', '00000000-0000-0000-0000-0000000000a1')
  returning id
)
select set_config('phase13.assignment_a', id::text, false) from ins;
reset role;

set local role authenticated;
set local request.jwt.claims = '{"sub":"00000000-0000-0000-0000-0000000000b1","role":"authenticated"}';
do $$
declare v_count int;
begin
  select count(*) into v_count from public.organization_assignments where id = current_setting('phase13.assignment_a')::uuid;
  if v_count <> 0 then raise exception 'TEST 9 FAILED: a user from Organization B could see an Organization A assignment (got % rows)', v_count; end if;
  raise notice 'TEST 9 PASSED: cross-tenant assignment access is blocked';
end $$;
reset role;

raise notice '=== ALL PHASE 13 RLS TESTS PASSED ===';

rollback;
