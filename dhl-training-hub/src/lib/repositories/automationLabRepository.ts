import { getSupabaseClient } from "@/lib/supabase/client";
import { AutomationLabAttempt, AutomationLabScore } from "@/lib/types";

/** Kept in sync with MAX_ATTEMPTS_PER_SCENARIO in lib/automationLabProgress.ts —
 * mirrors quizAttemptsRepository.ts's trim-after-insert pattern exactly. */
const MAX_ATTEMPTS_PER_SCENARIO = 5;

function toAttempt(row: {
  id: string;
  scenario_id: string;
  completed_at: string;
  submitted_block_ids: unknown;
  score: unknown;
}): AutomationLabAttempt {
  return {
    attemptId: row.id,
    scenarioId: row.scenario_id,
    completedAt: row.completed_at,
    submittedBlockIds: (row.submitted_block_ids as string[]) ?? [],
    score: row.score as AutomationLabScore,
  };
}

export async function fetchAutomationLabAttempts(userId: string): Promise<Record<string, AutomationLabAttempt[]>> {
  const supabase = getSupabaseClient();
  if (!supabase) return {};
  const { data, error } = await supabase
    .from("automation_lab_attempts")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: true });
  if (error || !data) throw error ?? new Error("Failed to load automation lab attempts");

  const grouped: Record<string, AutomationLabAttempt[]> = {};
  for (const row of data) {
    (grouped[row.scenario_id] ??= []).push(toAttempt(row));
  }
  return grouped;
}

export async function insertAutomationLabAttempt(userId: string, attempt: AutomationLabAttempt): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("automation_lab_attempts").upsert({
    id: attempt.attemptId,
    user_id: userId,
    scenario_id: attempt.scenarioId,
    completed_at: attempt.completedAt,
    submitted_block_ids: attempt.submittedBlockIds,
    score: attempt.score,
  });
  if (error) throw error;
  await trimOldAttempts(userId, attempt.scenarioId);
}

async function trimOldAttempts(userId: string, scenarioId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { data } = await supabase
    .from("automation_lab_attempts")
    .select("id, completed_at")
    .eq("user_id", userId)
    .eq("scenario_id", scenarioId)
    .order("completed_at", { ascending: false });
  if (!data || data.length <= MAX_ATTEMPTS_PER_SCENARIO) return;

  const idsToDelete = data.slice(MAX_ATTEMPTS_PER_SCENARIO).map((r) => r.id);
  await supabase.from("automation_lab_attempts").delete().in("id", idsToDelete);
}

/** Used only by the one-time local->cloud migration. */
export async function bulkUpsertAutomationLabAttempts(userId: string, attemptsMap: Record<string, AutomationLabAttempt[]>): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const rows = Object.values(attemptsMap)
    .flat()
    .map((a) => ({
      id: a.attemptId,
      user_id: userId,
      scenario_id: a.scenarioId,
      completed_at: a.completedAt,
      submitted_block_ids: a.submittedBlockIds,
      score: a.score,
    }));
  if (rows.length === 0) return;
  const { error } = await supabase.from("automation_lab_attempts").upsert(rows);
  if (error) throw error;

  for (const scenarioId of Object.keys(attemptsMap)) {
    await trimOldAttempts(userId, scenarioId);
  }
}
