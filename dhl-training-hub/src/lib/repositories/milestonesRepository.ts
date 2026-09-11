import { getSupabaseClient } from "@/lib/supabase/client";
import { MilestoneUnlock } from "@/lib/types";

export async function fetchMilestoneUnlocks(userId: string): Promise<MilestoneUnlock[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("milestone_unlocks").select("*").eq("user_id", userId);
  if (error || !data) throw error ?? new Error("Failed to load milestone unlocks");
  return data.map((row) => ({ milestoneId: row.milestone_id, unlockedAt: row.unlocked_at }));
}

export async function insertMilestoneUnlock(userId: string, unlock: MilestoneUnlock): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase
    .from("milestone_unlocks")
    .upsert(
      { user_id: userId, milestone_id: unlock.milestoneId, unlocked_at: unlock.unlockedAt },
      { onConflict: "user_id,milestone_id", ignoreDuplicates: true },
    );
  if (error) throw error;
}

/** Used only by bulk re-push of local-only unlock records after a cloud merge. */
export async function bulkUpsertMilestoneUnlocks(userId: string, unlocks: MilestoneUnlock[]): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase || unlocks.length === 0) return;
  const rows = unlocks.map((u) => ({ user_id: userId, milestone_id: u.milestoneId, unlocked_at: u.unlockedAt }));
  const { error } = await supabase.from("milestone_unlocks").upsert(rows, { onConflict: "user_id,milestone_id", ignoreDuplicates: true });
  if (error) throw error;
}
