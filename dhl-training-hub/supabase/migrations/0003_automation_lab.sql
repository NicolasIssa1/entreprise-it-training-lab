-- Enterprise IT Training Lab / DHL IT Training Hub — Automation Lab (Enterprise
-- Automation track) schema addition.
--
-- Purely additive on top of 0001_init.sql / 0002_tutor.sql — no existing table or
-- column is touched. Safe to re-run (every statement guarded with "if not
-- exists"/"or replace"). See root CLAUDE.md's Automation Lab section.

-- ---------------------------------------------------------------------------
-- automation_lab_attempts — mirrors the local "automation-lab-attempts" key
-- (Record<scenarioId, AutomationLabAttempt[]>). One row per attempt; id reuses
-- the client-generated attemptId directly, same idempotent-upsert rationale as
-- quiz_attempts. History is capped at the 5 most recent attempts per
-- (user, scenario) by the application layer after each insert, same
-- client-side-trim pattern quiz_attempts already uses.
-- ---------------------------------------------------------------------------
create table if not exists public.automation_lab_attempts (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  scenario_id text not null,
  completed_at timestamptz not null,
  submitted_block_ids jsonb not null default '[]'::jsonb,
  score jsonb not null,
  created_at timestamptz not null default now()
);

create index if not exists automation_lab_attempts_user_scenario_idx
  on public.automation_lab_attempts (user_id, scenario_id, completed_at desc);

alter table public.automation_lab_attempts enable row level security;

drop policy if exists "automation_lab_attempts_select_own" on public.automation_lab_attempts;
create policy "automation_lab_attempts_select_own" on public.automation_lab_attempts for select using (auth.uid() = user_id);
drop policy if exists "automation_lab_attempts_insert_own" on public.automation_lab_attempts;
create policy "automation_lab_attempts_insert_own" on public.automation_lab_attempts for insert with check (auth.uid() = user_id);
drop policy if exists "automation_lab_attempts_update_own" on public.automation_lab_attempts;
create policy "automation_lab_attempts_update_own" on public.automation_lab_attempts for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "automation_lab_attempts_delete_own" on public.automation_lab_attempts;
create policy "automation_lab_attempts_delete_own" on public.automation_lab_attempts for delete using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- cv_achievements.source — additive column for the Automation Lab's CV
-- connection (Feature 6). Distinguishes a real internship observation (null,
-- the pre-existing behavior) from a "portfolio-project" entry generated from a
-- completed Enterprise Project. See CvAchievement.source in lib/types.ts.
-- ---------------------------------------------------------------------------
alter table public.cv_achievements add column if not exists source text;
