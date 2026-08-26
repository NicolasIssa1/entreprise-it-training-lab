import { Quiz } from "@/lib/types";
import { learningTopics, learningPaths } from "@/lib/data/learning";
import { itsmQuiz } from "./itsm";
import { infrastructureQuiz } from "./infrastructure";
import { networkingQuiz } from "./networking";
import { applicationsQuiz } from "./applications";
import { securityQuiz } from "./security";
import { troubleshootingQuiz } from "./troubleshooting";
import { pathCheckpointQuizzes } from "./pathCheckpoints";

// Quiz library (Phase 4) — 6 Foundation Assessments (one per major skill area)
// plus one checkpoint per Learning Path. Kept as flat, typed local data, same
// architecture as the Learn library and Advanced Investigations. All content is
// fictional generic enterprise IT training material — see root CLAUDE.md.
export const quizzes: Quiz[] = [
  itsmQuiz,
  infrastructureQuiz,
  networkingQuiz,
  applicationsQuiz,
  securityQuiz,
  troubleshootingQuiz,
  ...pathCheckpointQuizzes,
];

export function getQuizById(id: string): Quiz | undefined {
  return quizzes.find((q) => q.id === id);
}

/** Quizzes relevant to a Learn topic's "Knowledge Check" link — derived from
 * each quiz's own relatedTopicIds (single source of truth), same reverse-
 * derivation pattern as getTicketsForTopic / getScenariosForTopic. */
export function getQuizzesForTopic(topicId: string): Quiz[] {
  return quizzes.filter((q) => q.relatedTopicIds.includes(topicId));
}

/** Quizzes relevant to a Learning Path's checkpoint section — derived from each
 * quiz's own relatedPathIds. Usually resolves to exactly one checkpoint quiz. */
export function getQuizzesForPath(pathId: string): Quiz[] {
  return quizzes.filter((q) => q.relatedPathIds.includes(pathId));
}

// ---------------------------------------------------------------------------
// Lightweight content validation, mirroring lib/data/learning/index.ts and
// lib/data/investigations/index.ts. Runs at module load and throws on
// internally inconsistent quiz data.
// ---------------------------------------------------------------------------
function validateQuizzes(): void {
  const errors: string[] = [];
  const quizIds = new Set<string>();
  const questionIds = new Set<string>();
  const topicIds = new Set(learningTopics.map((t) => t.id));
  const pathIds = new Set(learningPaths.map((p) => p.id));

  for (const quiz of quizzes) {
    if (quizIds.has(quiz.id)) errors.push(`Duplicate quiz id: "${quiz.id}"`);
    quizIds.add(quiz.id);

    if (quiz.questions.length === 0) {
      errors.push(`Quiz "${quiz.id}" has no questions`);
    }

    for (const topicId of quiz.relatedTopicIds) {
      if (!topicIds.has(topicId)) {
        errors.push(`Quiz "${quiz.id}" references unknown learning topic id "${topicId}"`);
      }
    }
    for (const pathId of quiz.relatedPathIds) {
      if (!pathIds.has(pathId)) {
        errors.push(`Quiz "${quiz.id}" references unknown learning path id "${pathId}"`);
      }
    }

    for (const question of quiz.questions) {
      if (questionIds.has(question.id)) errors.push(`Duplicate quiz question id: "${question.id}"`);
      questionIds.add(question.id);

      const optionIds = new Set<string>();
      for (const option of question.options) {
        if (optionIds.has(option.id)) {
          errors.push(`Question "${question.id}" has duplicate option id "${option.id}"`);
        }
        optionIds.add(option.id);
      }

      if (question.correctOptionIds.length === 0) {
        errors.push(`Question "${question.id}" has no correct answer defined`);
      }
      if (question.type === "single-choice" && question.correctOptionIds.length !== 1) {
        errors.push(`Question "${question.id}" is single-choice but has ${question.correctOptionIds.length} correct answers (must be exactly 1)`);
      }
      for (const correctId of question.correctOptionIds) {
        if (!optionIds.has(correctId)) {
          errors.push(`Question "${question.id}" has correctOptionIds referencing unknown option id "${correctId}"`);
        }
      }
      for (const key of Object.keys(question.misconceptionExplanations ?? {})) {
        if (!optionIds.has(key)) {
          errors.push(`Question "${question.id}" has misconceptionExplanations referencing unknown option id "${key}"`);
        }
      }
      for (const topicId of question.relatedTopicIds) {
        if (!topicIds.has(topicId)) {
          errors.push(`Question "${question.id}" references unknown learning topic id "${topicId}"`);
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Quiz content validation failed:\n${errors.join("\n")}`);
  }
}

validateQuizzes();
