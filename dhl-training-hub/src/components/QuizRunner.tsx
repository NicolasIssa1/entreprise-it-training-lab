"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { Badge } from "@/components/Badge";
import { SectionHeading } from "@/components/SectionHeading";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { RelatedTopics } from "@/components/RelatedTopics";
import { SyncErrorNotice } from "@/components/SyncErrorNotice";
import { useQuizAttempts } from "@/lib/quizAttempts";
import { Quiz, QuizAnswer, QuizAttempt, QuizQuestion, QuizResultGuidance } from "@/lib/types";

function arraysEqualAsSets(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const setB = new Set(b);
  return a.every((x) => setB.has(x));
}

function resultGuidance(percentage: number): { label: QuizResultGuidance; variant: "success" | "accent" | "warning" | "danger" } {
  if (percentage >= 85) return { label: "Strong understanding", variant: "success" };
  if (percentage >= 70) return { label: "Good foundation", variant: "accent" };
  if (percentage >= 50) return { label: "Developing", variant: "warning" };
  return { label: "Review recommended", variant: "danger" };
}

/** Full quiz-taking flow: one question at a time, no correctness leaked before
 * submission, then a detailed answer review. Deterministic scoring, no AI. */
export function QuizRunner({ quiz }: { quiz: Quiz }) {
  const { recordAttempt } = useQuizAttempts(quiz.id);
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [result, setResult] = useState<QuizAttempt | null>(null);

  const question = quiz.questions[index];
  const total = quiz.questions.length;
  const selected = answers[question.id] ?? [];
  const answeredCount = quiz.questions.filter((q) => (answers[q.id] ?? []).length > 0).length;

  function toggleOption(optionId: string) {
    setAnswers((prev) => {
      const current = prev[question.id] ?? [];
      if (question.type === "single-choice") {
        return { ...prev, [question.id]: [optionId] };
      }
      const next = current.includes(optionId) ? current.filter((id) => id !== optionId) : [...current, optionId];
      return { ...prev, [question.id]: next };
    });
  }

  function submit() {
    const answerRecords: QuizAnswer[] = quiz.questions.map((q) => {
      const selectedOptionIds = answers[q.id] ?? [];
      return { questionId: q.id, selectedOptionIds, correct: arraysEqualAsSets(selectedOptionIds, q.correctOptionIds) };
    });
    const correctCount = answerRecords.filter((a) => a.correct).length;
    const attempt: QuizAttempt = {
      attemptId: `${quiz.id}-${Date.now()}`,
      quizId: quiz.id,
      completedAt: new Date().toISOString(),
      correctCount,
      totalQuestions: total,
      percentage: Math.round((correctCount / total) * 100),
      answers: answerRecords,
    };
    recordAttempt(attempt);
    setResult(attempt);
  }

  function retake() {
    setResult(null);
    setAnswers({});
    setIndex(0);
  }

  if (result) {
    return <QuizReview quiz={quiz} attempt={result} onRetake={retake} />;
  }

  return (
    <div className="space-y-6">
      <PrivacyNotice context="Fictional generic knowledge check — not real DHL data or terminology." />

      <Card>
        <div className="mb-3 flex items-center justify-between text-sm">
          <p className="font-medium text-slate-900 dark:text-slate-100">
            Question {index + 1} of {total}
          </p>
          <p className="text-slate-500 dark:text-slate-400">{answeredCount}/{total} answered</p>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div className="h-2 rounded-full bg-blue-600 transition-all" style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </Card>

      <Card>
        <fieldset>
          <legend className="text-base font-medium text-slate-900 dark:text-slate-100">{question.prompt}</legend>
          {question.type === "multi-select" && <p className="mt-1 text-xs text-slate-400">Select all that apply.</p>}
          <div className="mt-4 space-y-2">
            {question.options.map((option) => {
              const isSelected = selected.includes(option.id);
              return (
                <label
                  key={option.id}
                  className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition focus-within:ring-2 focus-within:ring-blue-500/40 ${
                    isSelected
                      ? "border-blue-500 bg-blue-50 dark:bg-blue-950/40"
                      : "border-slate-200 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700"
                  }`}
                >
                  <input
                    type={question.type === "single-choice" ? "radio" : "checkbox"}
                    name={question.id}
                    checked={isSelected}
                    onChange={() => toggleOption(option.id)}
                    className="mt-0.5"
                  />
                  <span className="text-slate-800 dark:text-slate-200">{option.text}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Back
        </button>

        {index < total - 1 ? (
          <button
            onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            Next
          </button>
        ) : (
          <button
            onClick={submit}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
          >
            Submit Assessment
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Jump to question">
        {quiz.questions.map((q, i) => (
          <button
            key={q.id}
            onClick={() => setIndex(i)}
            aria-current={i === index ? "step" : undefined}
            aria-label={`Question ${i + 1}${(answers[q.id] ?? []).length > 0 ? ", answered" : ", not answered"}`}
            className={`h-8 w-8 rounded-md border text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
              i === index
                ? "border-blue-600 bg-blue-600 text-white"
                : (answers[q.id] ?? []).length > 0
                  ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300"
                  : "border-slate-300 text-slate-600 dark:border-slate-700 dark:text-slate-400"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

function QuizReview({ quiz, attempt, onRetake }: { quiz: Quiz; attempt: QuizAttempt; onRetake: () => void }) {
  const { best, syncError } = useQuizAttempts(quiz.id);
  const guidance = resultGuidance(attempt.percentage);

  return (
    <div className="space-y-6">
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">Assessment complete</p>
            <p className="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
              {attempt.correctCount} / {attempt.totalQuestions} &middot; {attempt.percentage}%
            </p>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{guidance.label}</p>
          </div>
          <Badge variant={guidance.variant}>{guidance.label}</Badge>
        </div>
        <p className="mt-3 text-xs text-slate-400">{quiz.passingGuidance}</p>
        {syncError && (
          <div className="mt-3">
            <SyncErrorNotice message="We couldn't save this result to your account right now. It's saved on this device and will sync on your next attempt." />
          </div>
        )}
      </Card>

      {best && (
        <Card>
          <div className="flex flex-wrap gap-8 text-sm">
            <div>
              <p className="text-slate-500 dark:text-slate-400">Best score</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{best.percentage}%</p>
            </div>
            <div>
              <p className="text-slate-500 dark:text-slate-400">This attempt</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">{attempt.percentage}%</p>
            </div>
          </div>
        </Card>
      )}

      <section className="space-y-4">
        <SectionHeading title="Answer review" subtitle="Every question, with the reasoning behind the correct answer" />
        {quiz.questions.map((q, i) => (
          <QuestionReviewCard
            key={q.id}
            index={i}
            question={q}
            answer={attempt.answers.find((a) => a.questionId === q.id)}
          />
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-4 border-t border-slate-200 pt-4 dark:border-slate-800">
        <button
          onClick={onRetake}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Retake Assessment
        </button>
        <Link
          href="/quizzes"
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          Back to Assessments
        </Link>
        <Link href="/progress" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          View Progress →
        </Link>
      </div>
    </div>
  );
}

function QuestionReviewCard({ index, question, answer }: { index: number; question: QuizQuestion; answer?: QuizAnswer }) {
  const correct = answer?.correct ?? false;
  const selectedIds = answer?.selectedOptionIds ?? [];
  const missedMisconceptions = selectedIds
    .filter((id) => !question.correctOptionIds.includes(id))
    .map((id) => question.misconceptionExplanations?.[id])
    .filter((text): text is string => !!text);

  return (
    <Card>
      <div className="flex flex-wrap items-start justify-between gap-3">
        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
          Q{index + 1}. {question.prompt}
        </p>
        <Badge variant={correct ? "success" : "danger"}>{correct ? "Correct" : "Incorrect"}</Badge>
      </div>
      <ul className="mt-3 space-y-1.5">
        {question.options.map((option) => {
          const wasSelected = selectedIds.includes(option.id);
          const isCorrectOption = question.correctOptionIds.includes(option.id);
          return (
            <li
              key={option.id}
              className={`rounded-md border px-3 py-2 text-sm ${
                isCorrectOption
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
                  : wasSelected
                    ? "border-red-300 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
                    : "border-slate-200 text-slate-600 dark:border-slate-800 dark:text-slate-400"
              }`}
            >
              {option.text}
              {isCorrectOption && <span className="ml-2 text-xs font-medium">(correct answer)</span>}
              {wasSelected && !isCorrectOption && <span className="ml-2 text-xs font-medium">(your answer)</span>}
              {wasSelected && isCorrectOption && <span className="ml-2 text-xs font-medium">(your answer)</span>}
            </li>
          );
        })}
      </ul>
      <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">{question.explanation}</p>
      {missedMisconceptions.map((text) => (
        <p
          key={text}
          className="mt-2 rounded-md bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:bg-amber-950/40 dark:text-amber-200"
        >
          {text}
        </p>
      ))}
      {question.relatedTopicIds.length > 0 && (
        <div className="mt-3">
          <RelatedTopics topicIds={question.relatedTopicIds} />
        </div>
      )}
    </Card>
  );
}
