import { getSupabaseClient } from "@/lib/supabase/client";
import { TutorConversation, TutorMessage, TutorMode } from "@/lib/types";

export interface CloudTutorConversation {
  conversation: TutorConversation;
  messages: TutorMessage[];
}

/** The conversation containing the user's most recent chat message — "one
 * running conversation" model (see lib/tutorConversation.ts), not a full
 * conversation-list browser. Finding "latest" via the most recent message
 * (rather than conversations.updated_at) means appendTutorMessage never needs
 * to separately touch the parent conversation row. Returns null when the
 * user has never chatted, or when a conversation row exists with zero
 * messages (e.g. created but abandoned before the first send completed). */
export async function fetchLatestTutorConversation(userId: string): Promise<CloudTutorConversation | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;

  const { data: latestMessage, error: latestError } = await supabase
    .from("tutor_messages")
    .select("conversation_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (latestError) throw latestError;
  if (!latestMessage) return null;

  const { data: convRow, error: convError } = await supabase
    .from("tutor_conversations")
    .select("*")
    .eq("id", latestMessage.conversation_id)
    .eq("user_id", userId)
    .maybeSingle();
  if (convError) throw convError;
  if (!convRow) return null;

  const { data: msgRows, error: msgError } = await supabase
    .from("tutor_messages")
    .select("*")
    .eq("conversation_id", convRow.id)
    .order("created_at", { ascending: true });
  if (msgError) throw msgError;

  return {
    conversation: {
      id: convRow.id,
      title: convRow.title,
      createdAt: convRow.created_at,
      updatedAt: convRow.updated_at,
    },
    messages: (msgRows ?? []).map((row) => ({
      id: row.id,
      role: row.role as TutorMessage["role"],
      content: row.content,
      mode: row.mode as TutorMode,
      relatedTopicIds: (row.related_topic_ids as string[]) ?? [],
      createdAt: row.created_at,
    })),
  };
}

export async function createTutorConversation(userId: string, conversation: TutorConversation): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("tutor_conversations").insert({
    id: conversation.id,
    user_id: userId,
    title: conversation.title,
  });
  if (error) throw error;
}

export async function appendTutorMessage(userId: string, conversationId: string, message: TutorMessage): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("tutor_messages").insert({
    id: message.id,
    conversation_id: conversationId,
    user_id: userId,
    role: message.role,
    content: message.content,
    mode: message.mode,
    related_topic_ids: message.relatedTopicIds,
    created_at: message.createdAt,
  });
  if (error) throw error;
}

/** A lightweight list for the Phase 14 conversation-history menu — titles
 * and timestamps only, never message content, so browsing history stays
 * cheap. Cloud-mode only (see lib/tutorConversation.ts's header comment for
 * why Local Demo Mode keeps the single-running-conversation Phase 6
 * behavior). RLS (auth.uid() = user_id) is what actually prevents this from
 * ever returning another account's conversations. */
export async function fetchTutorConversationList(userId: string, limit = 20): Promise<TutorConversation[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("tutor_conversations")
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false })
    .limit(limit);
  if (error || !data) throw error ?? new Error("Failed to load conversation history");
  return data.map((row) => ({ id: row.id, title: row.title, createdAt: row.created_at, updatedAt: row.updated_at }));
}

export async function fetchTutorConversationById(userId: string, conversationId: string): Promise<CloudTutorConversation | null> {
  const supabase = getSupabaseClient();
  if (!supabase) return null;
  const { data: convRow, error: convError } = await supabase
    .from("tutor_conversations")
    .select("*")
    .eq("id", conversationId)
    .eq("user_id", userId)
    .maybeSingle();
  if (convError) throw convError;
  if (!convRow) return null;

  const { data: msgRows, error: msgError } = await supabase
    .from("tutor_messages")
    .select("*")
    .eq("conversation_id", convRow.id)
    .order("created_at", { ascending: true });
  if (msgError) throw msgError;

  return {
    conversation: { id: convRow.id, title: convRow.title, createdAt: convRow.created_at, updatedAt: convRow.updated_at },
    messages: (msgRows ?? []).map((row) => ({
      id: row.id,
      role: row.role as TutorMessage["role"],
      content: row.content,
      mode: row.mode as TutorMode,
      relatedTopicIds: (row.related_topic_ids as string[]) ?? [],
      createdAt: row.created_at,
    })),
  };
}

/** Renames a conversation — used to auto-title it from the learner's first
 * message (see lib/tutorConversation.ts), never editable free-form in this
 * phase ("do not create an overcomplicated ChatGPT clone"). */
export async function renameTutorConversation(userId: string, conversationId: string, title: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("tutor_conversations").update({ title }).eq("id", conversationId).eq("user_id", userId);
  if (error) throw error;
}

/** Deletes one conversation (and, via the FK's on-delete-cascade, its
 * messages) — RLS's existing tutor_conversations_delete_own policy already
 * scopes this to the caller's own rows. */
export async function deleteTutorConversation(userId: string, conversationId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("tutor_conversations").delete().eq("id", conversationId).eq("user_id", userId);
  if (error) throw error;
}

/** "Clear history" — deletes every conversation the caller owns. Still
 * RLS-scoped to auth.uid() = user_id like every other call here; the
 * .eq("user_id", userId) is redundant with RLS but kept explicit so the
 * intent of the query is clear from reading it alone. */
export async function deleteAllTutorConversations(userId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("tutor_conversations").delete().eq("user_id", userId);
  if (error) throw error;
}
