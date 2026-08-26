import { getSupabaseClient } from "@/lib/supabase/client";
import { CvAchievement, InvolvementLevel, TeamId } from "@/lib/types";

function toAchievement(row: {
  id: string;
  date: string;
  team: string;
  raw_note: string;
  involvement_level: string;
  skills_involved: string;
  what_learned: string;
  suggested_cv_wording: string;
  evidence_notes: string;
}): CvAchievement {
  return {
    id: row.id,
    date: row.date,
    team: row.team as TeamId | "General",
    rawNote: row.raw_note,
    involvementLevel: row.involvement_level as InvolvementLevel,
    skillsInvolved: row.skills_involved,
    whatLearned: row.what_learned,
    suggestedCvWording: row.suggested_cv_wording,
    evidenceNotes: row.evidence_notes,
  };
}

function toRow(userId: string, achievement: CvAchievement) {
  return {
    id: achievement.id,
    user_id: userId,
    date: achievement.date,
    team: achievement.team,
    raw_note: achievement.rawNote,
    involvement_level: achievement.involvementLevel,
    skills_involved: achievement.skillsInvolved,
    what_learned: achievement.whatLearned,
    suggested_cv_wording: achievement.suggestedCvWording,
    evidence_notes: achievement.evidenceNotes,
  };
}

export async function fetchCvAchievements(userId: string): Promise<CvAchievement[]> {
  const supabase = getSupabaseClient();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("cv_achievements")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error || !data) throw error ?? new Error("Failed to load CV achievements");
  return data.map(toAchievement);
}

export async function insertCvAchievement(userId: string, achievement: CvAchievement): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("cv_achievements").upsert(toRow(userId, achievement));
  if (error) throw error;
}

export async function deleteCvAchievement(userId: string, achievementId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("cv_achievements").delete().eq("user_id", userId).eq("id", achievementId);
  if (error) throw error;
}

export async function bulkUpsertCvAchievements(userId: string, achievements: CvAchievement[]): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const rows = achievements.map((achievement) => toRow(userId, achievement));
  if (rows.length === 0) return;
  const { error } = await supabase.from("cv_achievements").upsert(rows);
  if (error) throw error;
}
