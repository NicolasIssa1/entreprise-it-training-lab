import { getSupabaseClient } from "@/lib/supabase/client";
import { DailyLogEntry, TeamId } from "@/lib/types";

function toEntry(row: {
  id: string;
  date: string;
  day_number: number;
  team: string;
  observed: string;
  learned: string;
  new_terminology: string;
  tools_concepts: string;
  questions_asked: string;
  answer_summary: string;
  did_not_understand: string;
  to_research_later: string;
  practice_completed: string;
  tomorrows_goals: string;
}): DailyLogEntry {
  return {
    id: row.id,
    date: row.date,
    dayNumber: row.day_number,
    team: row.team as TeamId | "General",
    observed: row.observed,
    learned: row.learned,
    newTerminology: row.new_terminology,
    toolsConcepts: row.tools_concepts,
    questionsAsked: row.questions_asked,
    answerSummary: row.answer_summary,
    didNotUnderstand: row.did_not_understand,
    toResearchLater: row.to_research_later,
    practiceCompleted: row.practice_completed,
    tomorrowsGoals: row.tomorrows_goals,
  };
}

function toRow(userId: string, entry: DailyLogEntry) {
  return {
    id: entry.id,
    user_id: userId,
    date: entry.date,
    day_number: entry.dayNumber,
    team: entry.team,
    observed: entry.observed,
    learned: entry.learned,
    new_terminology: entry.newTerminology,
    tools_concepts: entry.toolsConcepts,
    questions_asked: entry.questionsAsked,
    answer_summary: entry.answerSummary,
    did_not_understand: entry.didNotUnderstand,
    to_research_later: entry.toResearchLater,
    practice_completed: entry.practiceCompleted,
    tomorrows_goals: entry.tomorrowsGoals,
  };
}

export async function fetchDailyLogs(userId: string): Promise<DailyLogEntry[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("daily_logs")
    .select("*")
    .eq("user_id", userId)
    .order("day_number", { ascending: false });
  if (error || !data) throw error ?? new Error("Failed to load daily log entries");
  return data.map(toEntry);
}

export async function insertDailyLog(userId: string, entry: DailyLogEntry): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("daily_logs").upsert(toRow(userId, entry));
  if (error) throw error;
}

export async function deleteDailyLog(userId: string, entryId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("daily_logs").delete().eq("user_id", userId).eq("id", entryId);
  if (error) throw error;
}

export async function bulkUpsertDailyLogs(userId: string, entries: DailyLogEntry[]): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const rows = entries.map((entry) => toRow(userId, entry));
  if (rows.length === 0) return;
  const { error } = await supabase.from("daily_logs").upsert(rows);
  if (error) throw error;
}
