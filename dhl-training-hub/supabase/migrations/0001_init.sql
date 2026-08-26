-- Enterprise IT Training Lab / DHL IT Training Hub — Phase 5 initial schema.
--
-- Stores USER-GENERATED data only. Static curriculum (Learn topics, learning
-- paths, quizzes, ticket/investigation scenarios, team definitions) stays in
-- application code — see root CLAUDE.md. Nothing here contains, or should
-- ever contain, real DHL data.
--
-- Run this once against a fresh Supabase project's SQL editor (or via the
-- Supabase CLI — see docs/SUPABASE-SETUP.md). Safe to re-run: every statement
-- is guarded with "if not exists" / "or replace" so re-running does not error
-- on objects that already exist.

-- ---------------------------------------------------------------------------
-- Shared helper: auto-maintain updated_at on every table that has one.
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- profiles — one row per authenticated user. Minimal by design (see
-- CLAUDE.md's User Profile scope: no avatars, no public profiles).
-- local_migration_version tracks whether this user's pre-existing
-- localStorage data has been migrated to the cloud yet — checked explicitly
-- rather than inferred from "do any cloud rows exist," because a legitimately
-- empty new account must not be mistaken for "not yet migrated" and re-run
-- migration to nowhere (harmless, but wasteful) — see Phase 5 migration docs.
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  local_migration_version integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_updated_at on public.profiles;
create trigger set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Auto-create a profile row the moment a new auth user is created, so the
-- client never has to remember to do this itself (works even if a user is
-- created outside the app, e.g. directly in the Supabase dashboard).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- learning_progress — mirrors the local "learning-topic-progress" key
-- (Record<topicId, boolean>). One row per (user, topic).
-- ---------------------------------------------------------------------------
create table if not exists public.learning_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  topic_id text not null,
  completed boolean not null default true,
  completed_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (user_id, topic_id)
);

create index if not exists learning_progress_user_id_idx on public.learning_progress (user_id);

drop trigger if exists set_updated_at on public.learning_progress;
create trigger set_updated_at
  before update on public.learning_progress
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- quiz_attempts — mirrors the local "quiz-attempts" key
-- (Record<quizId, QuizAttempt[]>). One row per attempt; id reuses the
-- client-generated attemptId directly (already unique) so re-uploading the
-- same local attempt during migration is a no-op upsert, not a duplicate.
-- History is capped at the 10 most recent attempts per (user, quiz) by the
-- application layer after each insert — see lib/repositories and
-- CLAUDE.md's Phase 5 section for why this is done client-side rather than
-- via a trigger.
-- ---------------------------------------------------------------------------
create table if not exists public.quiz_attempts (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  quiz_id text not null,
  completed_at timestamptz not null,
  correct_count integer not null,
  total_questions integer not null,
  percentage integer not null,
  answers jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists quiz_attempts_user_quiz_idx on public.quiz_attempts (user_id, quiz_id, completed_at desc);

-- ---------------------------------------------------------------------------
-- investigation_progress — mirrors the local "investigation-progress" key
-- (Record<scenarioId, InvestigationProgress>). One row per (user, scenario);
-- upserted continuously as the learner investigates. "Restart Scenario"
-- deletes (or resets) the row for that scenario — see repository layer.
-- ---------------------------------------------------------------------------
create table if not exists public.investigation_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  scenario_id text not null,
  current_node_id text not null,
  history jsonb not null default '[]'::jsonb,
  actions_taken jsonb not null default '[]'::jsonb,
  asked_question_ids jsonb not null default '[]'::jsonb,
  hypothesis_history jsonb not null default '[]'::jsonb,
  business_impact text,
  documentation jsonb not null default '{}'::jsonb,
  completed boolean not null default false,
  score jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, scenario_id)
);

create index if not exists investigation_progress_user_id_idx on public.investigation_progress (user_id);

drop trigger if exists set_updated_at on public.investigation_progress;
create trigger set_updated_at
  before update on public.investigation_progress
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- investigation_completions — mirrors the local "investigation-completions"
-- key. Phase 4 only ever kept the LATEST completion per scenario (not a full
-- history), so this preserves that exactly: one row per (user, scenario).
-- ---------------------------------------------------------------------------
create table if not exists public.investigation_completions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  scenario_id text not null,
  completed_at timestamptz not null,
  score integer not null,
  result_category text not null,
  updated_at timestamptz not null default now(),
  unique (user_id, scenario_id)
);

create index if not exists investigation_completions_user_id_idx on public.investigation_completions (user_id);

drop trigger if exists set_updated_at on public.investigation_completions;
create trigger set_updated_at
  before update on public.investigation_completions
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- daily_logs — mirrors the local "daily-log-entries" key. id reuses the
-- client-generated entry id directly, same idempotent-upsert rationale as
-- quiz_attempts.
-- ---------------------------------------------------------------------------
create table if not exists public.daily_logs (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  date text not null,
  day_number integer not null,
  team text not null,
  observed text not null default '',
  learned text not null default '',
  new_terminology text not null default '',
  tools_concepts text not null default '',
  questions_asked text not null default '',
  answer_summary text not null default '',
  did_not_understand text not null default '',
  to_research_later text not null default '',
  practice_completed text not null default '',
  tomorrows_goals text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists daily_logs_user_id_idx on public.daily_logs (user_id, day_number desc);

drop trigger if exists set_updated_at on public.daily_logs;
create trigger set_updated_at
  before update on public.daily_logs
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- cv_achievements — mirrors the local "cv-achievements" key. involvement_level
-- is left as free text at the database layer (not a Postgres enum) so the
-- application's INVOLVEMENT_LEVELS constant in lib/types.ts remains the one
-- source of truth for the allowed values — see CLAUDE.md's CV honesty rule.
-- ---------------------------------------------------------------------------
create table if not exists public.cv_achievements (
  id text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  date text not null,
  team text not null,
  raw_note text not null default '',
  involvement_level text not null,
  skills_involved text not null default '',
  what_learned text not null default '',
  suggested_cv_wording text not null default '',
  evidence_notes text not null default '',
  created_at timestamptz not null default now()
);

create index if not exists cv_achievements_user_id_idx on public.cv_achievements (user_id, created_at desc);

-- ---------------------------------------------------------------------------
-- team_checklist_progress — mirrors the local "checklist-<teamId>" keys
-- (Record<itemLabel, boolean>). "item" stores the checklist item's own label
-- text, matching how the app already keys checklist state — there is no
-- separate synthetic item id in the current data model.
-- ---------------------------------------------------------------------------
create table if not exists public.team_checklist_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  team_id text not null,
  item text not null,
  completed boolean not null default true,
  updated_at timestamptz not null default now(),
  unique (user_id, team_id, item)
);

create index if not exists team_checklist_progress_user_id_idx on public.team_checklist_progress (user_id);

drop trigger if exists set_updated_at on public.team_checklist_progress;
create trigger set_updated_at
  before update on public.team_checklist_progress
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Row Level Security — mandatory on every table above. Each user may only
-- ever see/write their own rows. Never weaken these policies, and never use
-- the service-role key from the browser — see root CLAUDE.md.
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.learning_progress enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.investigation_progress enable row level security;
alter table public.investigation_completions enable row level security;
alter table public.daily_logs enable row level security;
alter table public.cv_achievements enable row level security;
alter table public.team_checklist_progress enable row level security;

-- profiles: keyed by id (== auth.uid()), not a separate user_id column.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);
-- No delete policy for profiles: a user deletes their account via Supabase
-- Auth (which cascades via the foreign key), not by deleting this row directly.

-- Every remaining table shares the same four-policy shape (select / insert /
-- update / delete, each scoped to auth.uid() = user_id). Looped via a DO block
-- with dynamic SQL (Postgres has no native "for each table" DDL) rather than
-- writing out 28 near-identical CREATE POLICY statements by hand.
do $$
declare
  t text;
begin
  foreach t in array array[
    'learning_progress',
    'quiz_attempts',
    'investigation_progress',
    'investigation_completions',
    'daily_logs',
    'cv_achievements',
    'team_checklist_progress'
  ]
  loop
    execute format('drop policy if exists "%1$s_select_own" on public.%1$s', t);
    execute format('create policy "%1$s_select_own" on public.%1$s for select using (auth.uid() = user_id)', t);

    execute format('drop policy if exists "%1$s_insert_own" on public.%1$s', t);
    execute format('create policy "%1$s_insert_own" on public.%1$s for insert with check (auth.uid() = user_id)', t);

    execute format('drop policy if exists "%1$s_update_own" on public.%1$s', t);
    execute format('create policy "%1$s_update_own" on public.%1$s for update using (auth.uid() = user_id) with check (auth.uid() = user_id)', t);

    execute format('drop policy if exists "%1$s_delete_own" on public.%1$s', t);
    execute format('create policy "%1$s_delete_own" on public.%1$s for delete using (auth.uid() = user_id)', t);
  end loop;
end $$;
