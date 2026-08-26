-- Enterprise IT Training Lab / DHL IT Training Hub — Phase 6 AI Tutor schema.
--
-- Stores only visible learner/assistant chat messages. Never stores system
-- prompts, API keys, or hidden model reasoning — see root CLAUDE.md Part R.
-- Static curriculum stays in application code, exactly like every other
-- Phase 5 table. Safe to re-run (every statement is guarded).

create table if not exists public.tutor_conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tutor_conversations_user_id_idx on public.tutor_conversations (user_id, updated_at desc);

drop trigger if exists set_updated_at on public.tutor_conversations;
create trigger set_updated_at
  before update on public.tutor_conversations
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- tutor_messages — one row per visible chat turn. "mode" and
-- "related_topic_ids" mirror the client-side TutorMessage type (lib/types.ts)
-- so a resumed conversation can re-render mode badges / related-topic links
-- without re-deriving them. No system/hidden-reasoning content is ever
-- written here (see root CLAUDE.md Part R).
-- ---------------------------------------------------------------------------
create table if not exists public.tutor_messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.tutor_conversations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  mode text not null,
  related_topic_ids jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists tutor_messages_conversation_id_idx on public.tutor_messages (conversation_id, created_at);
create index if not exists tutor_messages_user_id_idx on public.tutor_messages (user_id);

-- ---------------------------------------------------------------------------
-- Row Level Security — same mandatory pattern as every table in 0001_init.sql.
-- ---------------------------------------------------------------------------
alter table public.tutor_conversations enable row level security;
alter table public.tutor_messages enable row level security;

drop policy if exists "tutor_conversations_select_own" on public.tutor_conversations;
create policy "tutor_conversations_select_own" on public.tutor_conversations for select using (auth.uid() = user_id);
drop policy if exists "tutor_conversations_insert_own" on public.tutor_conversations;
create policy "tutor_conversations_insert_own" on public.tutor_conversations for insert with check (auth.uid() = user_id);
drop policy if exists "tutor_conversations_update_own" on public.tutor_conversations;
create policy "tutor_conversations_update_own" on public.tutor_conversations for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
drop policy if exists "tutor_conversations_delete_own" on public.tutor_conversations;
create policy "tutor_conversations_delete_own" on public.tutor_conversations for delete using (auth.uid() = user_id);

drop policy if exists "tutor_messages_select_own" on public.tutor_messages;
create policy "tutor_messages_select_own" on public.tutor_messages for select using (auth.uid() = user_id);
drop policy if exists "tutor_messages_insert_own" on public.tutor_messages;
create policy "tutor_messages_insert_own" on public.tutor_messages for insert with check (auth.uid() = user_id);
drop policy if exists "tutor_messages_delete_own" on public.tutor_messages;
create policy "tutor_messages_delete_own" on public.tutor_messages for delete using (auth.uid() = user_id);
-- No update policy for tutor_messages: messages are append-only/delete-only
-- from the client (a sent chat message is never edited in place).
