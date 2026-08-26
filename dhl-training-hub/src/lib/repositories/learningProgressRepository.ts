import { getSupabaseClient } from "@/lib/supabase/client";

export async function fetchLearningProgress(userId: string): Promise<Record<string, boolean>> {
  const supabase = getSupabaseClient();
  if (!supabase) return {};
  const { data, error } = await supabase.from("learning_progress").select("topic_id, completed").eq("user_id", userId);
  if (error || !data) throw error ?? new Error("Failed to load learning progress");

  const result: Record<string, boolean> = {};
  for (const row of data) result[row.topic_id] = row.completed;
  return result;
}

export async function upsertTopicCompletion(userId: string, topicId: string, completed: boolean): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase
    .from("learning_progress")
    .upsert(
      { user_id: userId, topic_id: topicId, completed, completed_at: completed ? new Date().toISOString() : null },
      { onConflict: "user_id,topic_id" },
    );
  if (error) throw error;
}

/** Used only by the one-time local->cloud migration. */
export async function bulkUpsertLearningProgress(userId: string, completed: Record<string, boolean>): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const rows = Object.entries(completed).map(([topicId, isCompleted]) => ({
    user_id: userId,
    topic_id: topicId,
    completed: isCompleted,
    completed_at: isCompleted ? new Date().toISOString() : null,
  }));
  if (rows.length === 0) return;
  const { error } = await supabase.from("learning_progress").upsert(rows, { onConflict: "user_id,topic_id" });
  if (error) throw error;
}
