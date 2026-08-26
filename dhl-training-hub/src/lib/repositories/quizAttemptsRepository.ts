import { getSupabaseClient } from "@/lib/supabase/client";
import { QuizAnswer, QuizAttempt } from "@/lib/types";

/** Kept in sync with MAX_ATTEMPTS_PER_QUIZ in lib/quizAttempts.ts — the same
 * "keep the 10 most recent attempts per quiz" rule from Phase 4, enforced here
 * via a delete-after-insert rather than a query-time limit, so a signed-out
 * fallback read of the local cache never has more than 10 to begin with. */
const MAX_ATTEMPTS_PER_QUIZ = 10;

function toAttempt(row: {
  id: string;
  quiz_id: string;
  completed_at: string;
  correct_count: number;
  total_questions: number;
  percentage: number;
  answers: unknown;
}): QuizAttempt {
  return {
    attemptId: row.id,
    quizId: row.quiz_id,
    completedAt: row.completed_at,
    correctCount: row.correct_count,
    totalQuestions: row.total_questions,
    percentage: row.percentage,
    answers: (row.answers as QuizAnswer[]) ?? [],
  };
}

export async function fetchQuizAttempts(userId: string): Promise<Record<string, QuizAttempt[]>> {
  const supabase = getSupabaseClient();
  if (!supabase) return {};
  const { data, error } = await supabase
    .from("quiz_attempts")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: true });
  if (error || !data) throw error ?? new Error("Failed to load quiz attempts");

  const grouped: Record<string, QuizAttempt[]> = {};
  for (const row of data) {
    (grouped[row.quiz_id] ??= []).push(toAttempt(row));
  }
  return grouped;
}

export async function insertQuizAttempt(userId: string, attempt: QuizAttempt): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { error } = await supabase.from("quiz_attempts").upsert({
    id: attempt.attemptId,
    user_id: userId,
    quiz_id: attempt.quizId,
    completed_at: attempt.completedAt,
    correct_count: attempt.correctCount,
    total_questions: attempt.totalQuestions,
    percentage: attempt.percentage,
    answers: attempt.answers,
  });
  if (error) throw error;
  await trimOldAttempts(userId, attempt.quizId);
}

async function trimOldAttempts(userId: string, quizId: string): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const { data } = await supabase
    .from("quiz_attempts")
    .select("id, completed_at")
    .eq("user_id", userId)
    .eq("quiz_id", quizId)
    .order("completed_at", { ascending: false });
  if (!data || data.length <= MAX_ATTEMPTS_PER_QUIZ) return;

  const idsToDelete = data.slice(MAX_ATTEMPTS_PER_QUIZ).map((r) => r.id);
  await supabase.from("quiz_attempts").delete().in("id", idsToDelete);
}

/** Used only by the one-time local->cloud migration — uploads everything kept
 * locally (already capped at 10/quiz client-side), then trims per quiz in case
 * cloud + local histories combined exceed the cap. */
export async function bulkUpsertQuizAttempts(userId: string, attemptsMap: Record<string, QuizAttempt[]>): Promise<void> {
  const supabase = getSupabaseClient();
  if (!supabase) return;
  const rows = Object.values(attemptsMap)
    .flat()
    .map((a) => ({
      id: a.attemptId,
      user_id: userId,
      quiz_id: a.quizId,
      completed_at: a.completedAt,
      correct_count: a.correctCount,
      total_questions: a.totalQuestions,
      percentage: a.percentage,
      answers: a.answers,
    }));
  if (rows.length === 0) return;
  const { error } = await supabase.from("quiz_attempts").upsert(rows);
  if (error) throw error;

  for (const quizId of Object.keys(attemptsMap)) {
    await trimOldAttempts(userId, quizId);
  }
}
