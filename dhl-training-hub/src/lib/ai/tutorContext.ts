import { LearningTopic } from "@/lib/types";
import { learningTopics, getTopicById, getTopicsByIds } from "@/lib/data/learning";
import { getQuizById } from "@/lib/data/quizzes";
import { getScenarioById } from "@/lib/data/investigations";

const MAX_TOPICS = 6;

/** Common English words that would otherwise dominate keyword matching without
 * signaling anything about the topic. Small and hand-picked, not a full NLP
 * stopword list — this is deterministic keyword retrieval, not a search engine. */
const STOPWORDS = new Set([
  "the", "and", "for", "are", "but", "not", "you", "your", "can", "why", "how",
  "what", "when", "where", "does", "did", "with", "from", "this", "that", "have",
  "has", "was", "were", "will", "would", "could", "should", "about", "into",
  "than", "then", "there", "their", "also", "just", "like", "some", "any",
  "all", "who", "whom", "which", "explain", "tell", "help", "understand",
  "still", "even", "get", "got", "know", "difference", "between",
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));
}

function scoreTopic(topic: LearningTopic, terms: string[]): number {
  const title = topic.title.toLowerCase();
  const desc = topic.shortDescription.toLowerCase();
  const category = topic.category.toLowerCase();
  const keywords = topic.keywords.map((k) => k.toLowerCase());

  let score = 0;
  for (const term of terms) {
    if (title.includes(term)) score += 3;
    if (keywords.some((k) => k.includes(term) || term.includes(k))) score += 2;
    if (desc.includes(term)) score += 1;
    if (category.includes(term)) score += 1;
  }
  return score;
}

export interface TutorContextInput {
  userMessage: string;
  currentTopicId?: string;
  currentQuizId?: string;
  currentScenarioId?: string;
  selectedTopicIds?: string[];
}

export interface TutorCurriculumContext {
  /** Deduplicated, capped at MAX_TOPICS — the only topics grounded into the
   * system prompt, and the only source for the response's relatedTopicIds
   * (see root CLAUDE.md: never trust a model-generated topic id/URL). */
  topics: LearningTopic[];
  currentTopic?: LearningTopic;
}

/**
 * Deterministic, application-side context retrieval (Phase 6 Part E/F). No
 * embeddings, no vector search, no external RAG — just: always ground the
 * current page's topic/quiz/scenario relations first, then fill remaining
 * slots with simple keyword matching against topic title/keywords/description/
 * category. Never sends the full 56-topic library to the model.
 */
export function buildTutorContext(input: TutorContextInput): TutorCurriculumContext {
  const picked = new Map<string, LearningTopic>();

  const currentTopic = input.currentTopicId ? getTopicById(input.currentTopicId) : undefined;
  if (currentTopic) {
    picked.set(currentTopic.id, currentTopic);
    for (const t of getTopicsByIds(currentTopic.relatedTopicIds).slice(0, 3)) picked.set(t.id, t);
  }

  const quiz = input.currentQuizId ? getQuizById(input.currentQuizId) : undefined;
  if (quiz) {
    for (const t of getTopicsByIds(quiz.relatedTopicIds).slice(0, 4)) picked.set(t.id, t);
  }

  const scenario = input.currentScenarioId ? getScenarioById(input.currentScenarioId) : undefined;
  if (scenario) {
    for (const t of getTopicsByIds(scenario.relatedTopicIds).slice(0, 4)) picked.set(t.id, t);
  }

  for (const id of input.selectedTopicIds ?? []) {
    const t = getTopicById(id);
    if (t) picked.set(t.id, t);
  }

  if (picked.size < MAX_TOPICS) {
    const terms = tokenize(input.userMessage);
    if (terms.length > 0) {
      const scored = learningTopics
        .filter((t) => !picked.has(t.id))
        .map((t) => ({ topic: t, score: scoreTopic(t, terms) }))
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score);
      for (const { topic } of scored) {
        if (picked.size >= MAX_TOPICS) break;
        picked.set(topic.id, topic);
      }
    }
  }

  return { topics: [...picked.values()].slice(0, MAX_TOPICS), currentTopic };
}
