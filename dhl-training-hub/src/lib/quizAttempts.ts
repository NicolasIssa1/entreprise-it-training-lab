"use client";

import { useEffect, useState } from "react";
import { useLocalStorageState } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fetchQuizAttempts, insertQuizAttempt, bulkUpsertQuizAttempts } from "@/lib/repositories/quizAttemptsRepository";
import { mergeMapOfArraysByIdPreferCloud } from "@/lib/mergeCloudState";
import { QuizAttempt, QuizResultGuidance } from "@/lib/types";

const STORAGE_KEY = "quiz-attempts";
const MAX_ATTEMPTS_PER_QUIZ = 10;

export type QuizAttemptsMap = Record<string, QuizAttempt[]>;

const isAttemptsMap = (value: unknown): value is QuizAttemptsMap =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/** Best (highest-percentage) attempt among a quiz's kept history. Since history
 * is capped at MAX_ATTEMPTS_PER_QUIZ, this is "best of recent attempts," not a
 * guaranteed all-time best — a documented, acceptable trade-off for a local,
 * no-backend training tool. */
export function bestAttempt(attempts: QuizAttempt[]): QuizAttempt | undefined {
  return attempts.reduce<QuizAttempt | undefined>(
    (best, a) => (!best || a.percentage > best.percentage ? a : best),
    undefined,
  );
}

export function latestAttempt(attempts: QuizAttempt[]): QuizAttempt | undefined {
  return attempts[attempts.length - 1];
}

/** Learning-descriptor-only result guidance for a percentage score — shared by
 * QuizRunner's post-submission result and Quiz Analytics (Phase 8) so the
 * score bands only ever live in one place. Never "Certified"/"Expert". */
export function quizResultGuidance(percentage: number): { label: QuizResultGuidance; variant: "success" | "accent" | "warning" | "danger" } {
  if (percentage >= 85) return { label: "Strong understanding", variant: "success" };
  if (percentage >= 70) return { label: "Good foundation", variant: "accent" };
  if (percentage >= 50) return { label: "Developing", variant: "warning" };
  return { label: "Review recommended", variant: "danger" };
}

/**
 * Persists quiz attempts under a single "quiz-attempts" key
 * (Record<quizId, QuizAttempt[]>, capped at the last 10 attempts per quiz),
 * built on the same useLocalStorageState core as every other storage hook.
 * Older attempts are never deleted outright — only trimmed once a quiz's own
 * history exceeds the cap.
 *
 * Phase 5: signed-in + configured fetches the full attempt history from
 * Supabase on mount and merges it with local (see lib/mergeCloudState.ts) —
 * cloud wins per attempt id, but a just-recorded attempt cloud doesn't know
 * about yet is preserved and re-pushed rather than dropped (a blind overwrite
 * here used to be able to silently erase a fresh attempt on a fast refresh);
 * each new attempt is also written through to Supabase in the background,
 * with the same 10-per-quiz cap enforced server-side by the repository and
 * re-applied client-side after every merge. Local Demo Mode is unchanged from
 * Phase 4.
 */
export function useQuizAttempts(quizId?: string) {
  const { user, isConfigured } = useAuth();
  const cloudMode = isConfigured && !!user;

  const { state: allAttempts, setState: setAllAttempts, loaded } = useLocalStorageState<QuizAttemptsMap>(
    STORAGE_KEY,
    {},
    isAttemptsMap,
  );
  const [syncError, setSyncError] = useState(false);

  useEffect(() => {
    if (!cloudMode || !user) return;
    let cancelled = false;
    fetchQuizAttempts(user.id)
      .then((cloud) => {
        if (cancelled) return;
        setAllAttempts((prevLocal) => {
          const { merged, localOnly } = mergeMapOfArraysByIdPreferCloud(prevLocal, cloud, (a) => a.attemptId);
          if (Object.keys(localOnly).length > 0) bulkUpsertQuizAttempts(user.id, localOnly).catch(() => setSyncError(true));
          // Re-apply the per-quiz cap after merging — mirrors recordAttempt's own trim.
          const capped: QuizAttemptsMap = {};
          for (const [quizId, list] of Object.entries(merged)) capped[quizId] = list.slice(-MAX_ATTEMPTS_PER_QUIZ);
          return capped;
        });
      })
      .catch(() => {
        if (!cancelled) setSyncError(true);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cloudMode, user?.id]);

  function recordAttempt(attempt: QuizAttempt) {
    setAllAttempts((prev) => {
      const existing = prev[attempt.quizId] ?? [];
      return { ...prev, [attempt.quizId]: [...existing, attempt].slice(-MAX_ATTEMPTS_PER_QUIZ) };
    });
    if (cloudMode && user) {
      insertQuizAttempt(user.id, attempt).catch(() => setSyncError(true));
    }
  }

  const attempts = quizId ? allAttempts[quizId] ?? [] : [];

  return {
    allAttempts,
    attempts,
    latest: latestAttempt(attempts),
    best: bestAttempt(attempts),
    recordAttempt,
    loaded,
    syncError,
  };
}
