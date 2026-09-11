-- Enterprise IT Training Lab / DHL IT Training Hub — Phase 11 Premium Product
-- Layer schema addition.
--
-- Purely additive on top of 0001-0003 — no existing table/column is touched.
-- Safe to re-run (every statement guarded with "if not exists"/"or replace").
-- See root CLAUDE.md's Phase 11 section.

-- ---------------------------------------------------------------------------
-- profiles.tier — the entitlement column. Defaults every existing and new
-- account to "free". There is no payment integration yet (Phase 11
-- deliberately stops short of Stripe/billing) — the only legitimate way to
-- change this today is a service-role connection (a future billing webhook),
-- so it is deliberately NOT writable through an ordinary client update call,
-- even though every other profiles column is (see profiles_update_own in
-- 0001_init.sql). The trigger below enforces that: any client-side attempt to
-- change tier via a normal authenticated/anon update is silently reverted to
-- the existing value, while a future service-role webhook can still set it.
-- The client-side dev/test override (NEXT_PUBLIC_DEV_TIER_OVERRIDE, see
-- lib/entitlements.ts) never touches this column at all — it's a pure,
-- local, UI-gating override for testing, not a real grant.
-- ---------------------------------------------------------------------------
alter table public.profiles add column if not exists tier text not null default 'free';
alter table public.profiles drop constraint if exists profiles_tier_check;
alter table public.profiles add constraint profiles_tier_check check (tier in ('free', 'pro', 'enterprise'));

create or replace function public.protect_tier_column()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if new.tier is distinct from old.tier and auth.role() <> 'service_role' then
    new.tier := old.tier;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_tier_column on public.profiles;
create trigger protect_tier_column
  before update on public.profiles
  for each row execute function public.protect_tier_column();

-- ---------------------------------------------------------------------------
-- milestone_unlocks — records the moment a Professional Milestone's
-- deterministic eligibility check (lib/data/milestones.ts) was first
-- observed to be satisfied. Eligibility itself is always recomputed live from
-- existing progress data — this table only ever records a timestamp, never a
-- duplicated score. One row per (user, milestone); a composite primary key
-- avoids needing a synthesized id, same reasoning as team_checklist_progress's
-- natural-key approach in 0001_init.sql.
-- ---------------------------------------------------------------------------
create table if not exists public.milestone_unlocks (
  user_id uuid not null references auth.users (id) on delete cascade,
  milestone_id text not null,
  unlocked_at timestamptz not null default now(),
  primary key (user_id, milestone_id)
);

alter table public.milestone_unlocks enable row level security;

drop policy if exists "milestone_unlocks_select_own" on public.milestone_unlocks;
create policy "milestone_unlocks_select_own" on public.milestone_unlocks for select using (auth.uid() = user_id);
drop policy if exists "milestone_unlocks_insert_own" on public.milestone_unlocks;
create policy "milestone_unlocks_insert_own" on public.milestone_unlocks for insert with check (auth.uid() = user_id);
drop policy if exists "milestone_unlocks_update_own" on public.milestone_unlocks;
create policy "milestone_unlocks_update_own" on public.milestone_unlocks for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "milestone_unlocks_delete_own" on public.milestone_unlocks;
create policy "milestone_unlocks_delete_own" on public.milestone_unlocks for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- certificates — issued once a certificate program's deterministic
-- eligibility (lib/data/certificatePrograms.ts) is first satisfied. Unlike
-- milestone_unlocks, a certificate's issued_at/certificate_ref must stay
-- FIXED once earned (re-deriving them live on every render would let a
-- certificate's date silently drift if the underlying data model ever
-- changed), so the application layer only ever inserts a row here, never
-- updates one. RLS still grants update/delete for the same reason every
-- other personal-record table in this app does (cv_achievements,
-- investigation_completions) — this is presentational/portfolio content, not
-- a security boundary, so the low-stakes "client trusts itself" trade-off
-- already documented for those tables applies here too. tier (above) is the
-- one column in this schema that actually gates access, which is why it
-- alone gets the trigger.
-- ---------------------------------------------------------------------------
create table if not exists public.certificates (
  user_id uuid not null references auth.users (id) on delete cascade,
  program_id text not null,
  certificate_ref text not null,
  issued_at timestamptz not null default now(),
  skills_summary jsonb not null default '[]'::jsonb,
  primary key (user_id, program_id)
);

alter table public.certificates enable row level security;

drop policy if exists "certificates_select_own" on public.certificates;
create policy "certificates_select_own" on public.certificates for select using (auth.uid() = user_id);
drop policy if exists "certificates_insert_own" on public.certificates;
create policy "certificates_insert_own" on public.certificates for insert with check (auth.uid() = user_id);
drop policy if exists "certificates_update_own" on public.certificates;
create policy "certificates_update_own" on public.certificates for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "certificates_delete_own" on public.certificates;
create policy "certificates_delete_own" on public.certificates for delete using (auth.uid() = user_id);
