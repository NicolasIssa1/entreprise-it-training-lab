import { getSupabaseClient } from "@/lib/supabase/client";
import { InvestigationCompletionRecord, InvestigationProgress } from "@/lib/types";

function toProgress(row: {
  scenario_id: string;
  current_node_id: string;
  history: unknown;
  actions_taken: unknown;
  asked_question_ids: unknown;
  hypothesis_history: unknown;
  business_impact: string | null;
  documentation: unknown;
  completed: boolean;
  score: unknown;
}): InvestigationProgress {
  return {
    scenarioId: row.scenario_id,
    currentNodeId: row.current_node_id,
    history: (row.history as InvestigationProgress["history"]) ?? [],
    actionsTaken: (row.actions_taken as InvestigationProgress["actionsTaken"]) ?? [],
    askedQuestionIds: (row.asked_question_ids as string[]) ?? [],
    hypothesisHistory: (row.hypothesis_history as InvestigationProgress["hypothesisHistory"]) ?? [],
    businessImpact: (row.business_impact as InvestigationProgress["businessImpact"]) ?? undefined,
    documentation: (row.documentation as InvestigationProgress["documentation"]) ?? {},
    completed: row.completed,
    score: (row.score as InvestigationProgress["score"]) ?? undefined,
  };
}

export async function fetchInvestigationProgress(userId: string): Promise<Record<string, InvestigationProgress>> {
  const supabase = getSupabaseClient();
  if (!supabase) return {};
  const { data, error } = await supabase.from("investigation_progress").select("*").eq("user_id", userId);
  if (error || !data) throw error ?? new Error("Failed to load investigation progress");

  const result: Record<string, InvestigationProgress> = {};
  for (const row of data) result[row.scenario_id] = toProgress(row);
  return result;
}

export async function upsertInvestigationProgress(userId: string, progress: InvestigationProgress): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("investigation_progress").upsert(
    {
      user_id: userId,
      scenario_id: progress.scenarioId,
      current_node_id: progress.currentNodeId,
      history: progress.history,
      actions_taken: progress.actionsTaken,
      asked_question_ids: progress.askedQuestionIds,
      hypothesis_history: progress.hypothesisHistory,
      business_impact: progress.businessImpact ?? null,
      documentation: progress.documentation,
      completed: progress.completed,
      score: progress.score ?? null,
    },
    { onConflict: "user_id,scenario_id" },
  );
  if (error) throw error;
}

/** Used by "Restart Scenario" — removes cloud state entirely rather than
 * upserting a reset row, so a stale row never lingers with the wrong shape. */
export async function deleteInvestigationProgress(userId: string, scenarioId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase
    .from("investigation_progress")
    .delete()
    .eq("user_id", userId)
    .eq("scenario_id", scenarioId);
  if (error) throw error;
}

export async function bulkUpsertInvestigationProgress(
  userId: string,
  progressMap: Record<string, InvestigationProgress>,
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const rows = Object.values(progressMap).map((progress) => ({
    user_id: userId,
    scenario_id: progress.scenarioId,
    current_node_id: progress.currentNodeId,
    history: progress.history,
    actions_taken: progress.actionsTaken,
    asked_question_ids: progress.askedQuestionIds,
    hypothesis_history: progress.hypothesisHistory,
    business_impact: progress.businessImpact ?? null,
    documentation: progress.documentation,
    completed: progress.completed,
    score: progress.score ?? null,
  }));
  if (rows.length === 0) return;
  const { error } = await supabase.from("investigation_progress").upsert(rows, { onConflict: "user_id,scenario_id" });
  if (error) throw error;
}

export async function fetchInvestigationCompletions(userId: string): Promise<InvestigationCompletionRecord[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase.from("investigation_completions").select("*").eq("user_id", userId);
  if (error || !data) throw error ?? new Error("Failed to load investigation completions");

  return data.map((row) => ({
    scenarioId: row.scenario_id,
    completedAt: row.completed_at,
    score: row.score,
    resultCategory: row.result_category as InvestigationCompletionRecord["resultCategory"],
  }));
}

export async function upsertInvestigationCompletion(userId: string, record: InvestigationCompletionRecord): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("investigation_completions").upsert(
    {
      user_id: userId,
      scenario_id: record.scenarioId,
      completed_at: record.completedAt,
      score: record.score,
      result_category: record.resultCategory,
    },
    { onConflict: "user_id,scenario_id" },
  );
  if (error) throw error;
}

export async function bulkUpsertInvestigationCompletions(
  userId: string,
  records: InvestigationCompletionRecord[],
): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const rows = records.map((record) => ({
    user_id: userId,
    scenario_id: record.scenarioId,
    completed_at: record.completedAt,
    score: record.score,
    result_category: record.resultCategory,
  }));
  if (rows.length === 0) return;
  const { error } = await supabase.from("investigation_completions").upsert(rows, { onConflict: "user_id,scenario_id" });
  if (error) throw error;
}
