import { getSupabaseClient } from "@/lib/supabase/client";
import { TeamId } from "@/lib/types";

export async function fetchTeamChecklist(userId: string, teamId: TeamId): Promise<Record<string, boolean>> {
  const supabase = getSupabaseClient();
  if (!supabase) return {};
  const { data, error } = await supabase
    .from("team_checklist_progress")
    .select("item, completed")
    .eq("user_id", userId)
    .eq("team_id", teamId);
  if (error || !data) throw error ?? new Error("Failed to load team checklist");

  const result: Record<string, boolean> = {};
  for (const row of data) result[row.item] = row.completed;
  return result;
}

export async function upsertChecklistItem(userId: string, teamId: TeamId, item: string, completed: boolean): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase
    .from("team_checklist_progress")
    .upsert({ user_id: userId, team_id: teamId, item, completed }, { onConflict: "user_id,team_id,item" });
  if (error) throw error;
}

/** Used only by the one-time local->cloud migration — uploads every team's
 * checklist state at once, reading directly from the three legacy
 * "checklist-<teamId>" keys. */
export async function bulkUpsertTeamChecklists(
  userId: string,
  byTeam: Partial<Record<TeamId, Record<string, boolean>>>,
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const rows = Object.entries(byTeam).flatMap(([teamId, items]) =>
    Object.entries(items ?? {}).map(([item, completed]) => ({
      user_id: userId,
      team_id: teamId,
      item,
      completed,
    })),
  );
  if (rows.length === 0) return;
  const { error } = await supabase.from("team_checklist_progress").upsert(rows, { onConflict: "user_id,team_id,item" });
  if (error) throw error;
}
