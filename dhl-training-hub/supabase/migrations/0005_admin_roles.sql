-- Enterprise IT Training Lab / DHL IT Training Hub — Phase 12 Enterprise Admin
-- schema addition.
--
-- Purely additive on top of 0001-0004 — no existing table/column touched.
-- Safe to re-run. See root CLAUDE.md's Phase 12 section.
--
-- Deliberately does NOT add any new table: cohorts, admin-issued assignment
-- records, and custom local programmes are all scoped-localStorage state (see
-- lib/adminCohorts.ts / lib/adminAssignments.ts / lib/adminProgrammes.ts) —
-- there is no real cross-user membership to sync (a cohort only ever
-- references the admin's own "You" record or fictional demo learners, never
-- another real account), so a Supabase table would add real multi-tenant
-- schema surface area for no actual benefit yet. Full organization-scoped
-- persistence and RLS is Phase 13's job.
-- ---------------------------------------------------------------------------

-- profiles.role — the Enterprise Admin role column. Defaults every existing
-- and new account to "learner". Protected by a trigger for the same reason
-- tier is (see 0004_premium.sql) — self-promoting to "admin" via a raw client
-- update call would be worse than self-upgrading a product tier, so this is
-- deliberately NOT writable through an ordinary authenticated/anon update.
alter table public.profiles add column if not exists role text not null default 'learner';
alter table public.profiles drop constraint if exists profiles_role_check;
alter table public.profiles add constraint profiles_role_check check (role in ('learner', 'manager', 'admin'));

-- Replaces the Phase 11 protect_tier_column trigger with one that protects
-- both privileged columns — a client-side attempt to change either tier or
-- role via a normal update call is silently reverted to the existing value;
-- only a service-role connection (a future admin-management backend) can
-- change them. The old trigger name/function is dropped so there is exactly
-- one trigger doing this job, not two overlapping ones.
drop trigger if exists protect_tier_column on public.profiles;
drop function if exists public.protect_tier_column();

create or replace function public.protect_privileged_columns()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.tier is distinct from old.tier and auth.role() <> 'service_role' then
    new.tier := old.tier;
  end if;
  if new.role is distinct from old.role and auth.role() <> 'service_role' then
    new.role := old.role;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_privileged_columns on public.profiles;
create trigger protect_privileged_columns
  before update on public.profiles
  for each row execute function public.protect_privileged_columns();
