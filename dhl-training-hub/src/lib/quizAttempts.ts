"use client";

import { useLocalStorageState } from "@/lib/storage";
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
 */
export function useQuizAttempts(quizId?: string) {
  const { state: allAttempts, setState: setAllAttempts, loaded } = useLocalStorageState<QuizAttemptsMap>(
    STORAGE_KEY,
    {},
    isAttemptsMap,
  );

  function recordAttempt(attempt: QuizAttempt) {
    setAllAttempts((prev) => {
      const existing = prev[attempt.quizId] ?? [];
      return { ...prev, [attempt.quizId]: [...existing, attempt].slice(-MAX_ATTEMPTS_PER_QUIZ) };
    });
  }

  const attempts = quizId ? allAttempts[quizId] ?? [] : [];

  return {
    allAttempts,
    attempts,
    latest: latestAttempt(attempts),
    best: bestAttempt(attempts),
    recordAttempt,
    loaded,
  };
}
