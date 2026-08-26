"use client";

import { useEffect, useState } from "react";
import { useLocalStorageState } from "@/lib/storage";
import { useAuth } from "@/lib/auth/AuthProvider";
import { fetchQuizAttempts, insertQuizAttempt } from "@/lib/repositories/quizAttemptsRepository";
import { QuizAttempt } from "@/lib/types";

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

/**
 * Persists quiz attempts under a single "quiz-attempts" key
 * (Record<quizId, QuizAttempt[]>, capped at the last 10 attempts per quiz),
 * built on the same useLocalStorageState core as every other storage hook.
 * Older attempts are never deleted outright — only trimmed once a quiz's own
 * history exceeds the cap.
 *
 * Phase 5: signed-in + configured fetches the full attempt history from
 * Supabase on mount and uses it as the source of truth going forward (local
 * storage becomes an optimistic cache); each new attempt is written through to
 * Supabase in the background, with the same 10-per-quiz cap enforced
 * server-side by the repository. Local Demo Mode is unchanged from Phase 4.
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
        if (!cancelled) setAllAttempts(cloud);
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
