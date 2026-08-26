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
