import { NextRequest, NextResponse } from "next/server";
import { SKILL_IDS, SKILL_LEVELS, TUTOR_MODES, TutorMode } from "@/lib/types";
import {
  AiChatMessage,
  InvestigationCoachStatus,
  InvestigationReviewRequestContext,
  QuizReviewContext,
  QuizReviewRequestContext,
  TutorApiRequest,
  TutorApiResponse,
  TutorProgressSummary,
} from "@/lib/ai/types";
import { buildTutorContext } from "@/lib/ai/tutorContext";
import { buildSystemBlocks } from "@/lib/ai/tutorPrompt";
import { getAiProvider, isAiConfigured } from "@/lib/ai/provider";
import { checkRateLimit } from "@/lib/ai/rateLimit";
import { getTopicById } from "@/lib/data/learning";
import { getQuizById } from "@/lib/data/quizzes";
import { getScenarioById } from "@/lib/data/investigations";

// Phase 6 Part P/T: hard input/cost limits enforced server-side, independent
// of whatever the client already caps — never trust the client alone.
const MAX_MESSAGE_LENGTH = 2000;
const MAX_HISTORY_TURNS = 12;
const MAX_HISTORY_MESSAGE_LENGTH = 4000;
const MAX_SELECTED_TOPICS = 5;
const MAX_TEXT_FIELD = 800;
const MAX_ARRAY_ITEMS = 8;

function isTutorMode(value: unknown): value is TutorMode {
  return typeof value === "string" && (TUTOR_MODES as readonly string[]).includes(value);
}

function sanitizeHistory(raw: unknown): AiChatMessage[] {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter(
      (t): t is AiChatMessage =>
        !!t && typeof t === "object" && (t.role === "user" || t.role === "assistant") && typeof t.content === "string",
    )
    .slice(-MAX_HISTORY_TURNS)
    .map((t) => ({ role: t.role, content: t.content.slice(0, MAX_HISTORY_MESSAGE_LENGTH) }));
}

function sanitizeProgressSummary(raw: unknown): TutorProgressSummary | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;

  const completedTopicIds = Array.isArray(r.completedTopicIds)
    ? r.completedTopicIds.filter((id): id is string => typeof id === "string" && !!getTopicById(id)).slice(0, 60)
    : [];

  const quizBestPercentages: Record<string, number> = {};
  if (r.quizBestPercentages && typeof r.quizBestPercentages === "object") {
    for (const [quizId, pct] of Object.entries(r.quizBestPercentages as Record<string, unknown>)) {
      if (getQuizById(quizId) && typeof pct === "number" && pct >= 0 && pct <= 100) quizBestPercentages[quizId] = pct;
    }
  }

  const completedInvestigationIds = Array.isArray(r.completedInvestigationIds)
    ? r.completedInvestigationIds.filter((id): id is string => typeof id === "string" && !!getScenarioById(id)).slice(0, 20)
    : [];

  const skillLevels: Record<string, string> = {};
  if (r.skillLevels && typeof r.skillLevels === "object") {
    for (const [skillId, level] of Object.entries(r.skillLevels as Record<string, unknown>)) {
      if (
        (SKILL_IDS as readonly string[]).includes(skillId) &&
        typeof level === "string" &&
        (SKILL_LEVELS as readonly string[]).includes(level)
      ) {
        skillLevels[skillId] = level;
      }
    }
  }

  const topRecommendationTitles = Array.isArray(r.topRecommendationTitles)
    ? r.topRecommendationTitles.filter((t): t is string => typeof t === "string").slice(0, 5).map((t) => t.slice(0, 120))
    : [];

  return { completedTopicIds, quizBestPercentages, completedInvestigationIds, skillLevels, topRecommendationTitles };
}

/** Resolves quiz review context entirely from static curriculum data — the
 * client only supplies ids plus the learner's own selected option ids
 * (validated against real options), so it can never inject arbitrary
 * "explanation" or "correct answer" text into the prompt. See root CLAUDE.md
 * and lib/ai/types.ts's QuizReviewRequestContext doc comment. */
function resolveQuizReviewContext(raw: unknown): QuizReviewContext | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Partial<QuizReviewRequestContext>;
  if (typeof r.quizId !== "string" || typeof r.questionId !== "string") return undefined;

  const quiz = getQuizById(r.quizId);
  const question = quiz?.questions.find((q) => q.id === r.questionId);
  if (!quiz || !question) return undefined;

  const validOptionIds = new Set(question.options.map((o) => o.id));
  const selectedOptionIds = Array.isArray(r.selectedOptionIds)
    ? r.selectedOptionIds.filter((id): id is string => typeof id === "string" && validOptionIds.has(id))
    : [];

  const optionLabel = (id: string) => question.options.find((o) => o.id === id)?.text ?? id;
  const correct =
    selectedOptionIds.length === question.correctOptionIds.length &&
    question.correctOptionIds.every((id) => selectedOptionIds.includes(id));

  const misconceptionNotes = selectedOptionIds
    .filter((id) => !question.correctOptionIds.includes(id))
    .map((id) => question.misconceptionExplanations?.[id])
    .filter((note): note is string => !!note);

  return {
    questionPrompt: question.prompt,
    questionType: question.type,
    optionLabels: question.options.map((o) => o.text),
    selectedOptionLabels: selectedOptionIds.map(optionLabel),
    correctOptionLabels: question.correctOptionIds.map(optionLabel),
    correct,
    explanation: question.explanation,
    misconceptionNotes,
    relatedTopicIds: question.relatedTopicIds,
  };
}

function sanitizeInvestigationCoachStatus(raw: unknown): InvestigationCoachStatus | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Partial<InvestigationCoachStatus>;
  if (typeof r.currentNodePrompt !== "string") return undefined;

  return {
    currentNodePrompt: r.currentNodePrompt.slice(0, MAX_TEXT_FIELD),
    evidence: Array.isArray(r.evidence)
      ? r.evidence.filter((e): e is string => typeof e === "string").slice(0, MAX_ARRAY_ITEMS).map((e) => e.slice(0, 300))
      : [],
    hypothesis: typeof r.hypothesis === "string" ? r.hypothesis.slice(0, 200) : undefined,
    businessImpact: typeof r.businessImpact === "string" ? r.businessImpact.slice(0, 200) : undefined,
    actionsTakenCount: typeof r.actionsTakenCount === "number" ? Math.max(0, Math.min(200, Math.round(r.actionsTakenCount))) : 0,
  };
}

function sanitizeInvestigationReviewContext(
  raw: unknown,
): { scenarioId: string; outcomeSummary: string; whatWentWell: string[]; whatCouldImprove: string[]; betterReasoningPath: string } | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Partial<InvestigationReviewRequestContext>;
  if (typeof r.scenarioId !== "string" || !getScenarioById(r.scenarioId)) return undefined;
  if (typeof r.outcomeSummary !== "string" || typeof r.betterReasoningPath !== "string") return undefined;

  const capArray = (v: unknown) =>
    Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, MAX_ARRAY_ITEMS).map((x) => x.slice(0, MAX_TEXT_FIELD)) : [];

  return {
    scenarioId: r.scenarioId,
    outcomeSummary: r.outcomeSummary.slice(0, MAX_TEXT_FIELD),
    whatWentWell: capArray(r.whatWentWell),
    whatCouldImprove: capArray(r.whatCouldImprove),
    betterReasoningPath: r.betterReasoningPath.slice(0, MAX_TEXT_FIELD),
  };
}

export async function GET() {
  return NextResponse.json({ configured: isAiConfigured() });
}

export async function POST(request: NextRequest) {
  if (!isAiConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  let body: TutorApiRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const message = typeof body.message === "string" ? body.message.trim().slice(0, MAX_MESSAGE_LENGTH) : "";
  if (!message) {
    return NextResponse.json({ error: "invalid_request" }, { status: 400 });
  }

  const mode: TutorMode = isTutorMode(body.mode) ? body.mode : "tutor";

  const currentTopicId = typeof body.currentTopicId === "string" && getTopicById(body.currentTopicId) ? body.currentTopicId : undefined;
  const currentQuizId = typeof body.currentQuizId === "string" && getQuizById(body.currentQuizId) ? body.currentQuizId : undefined;
  const currentScenarioId =
    typeof body.currentScenarioId === "string" && getScenarioById(body.currentScenarioId) ? body.currentScenarioId : undefined;

  const selectedTopicIds = Array.isArray(body.selectedTopicIds)
    ? body.selectedTopicIds.filter((id): id is string => typeof id === "string" && !!getTopicById(id)).slice(0, MAX_SELECTED_TOPICS)
    : [];

  const history = sanitizeHistory(body.history);
  const progressSummary = sanitizeProgressSummary(body.progressSummary);
  const quizReviewContext = mode === "quiz-review" ? resolveQuizReviewContext(body.quizReviewContext) : undefined;
  const investigationCoachStatus = mode === "investigation-coach" ? sanitizeInvestigationCoachStatus(body.investigationCoachStatus) : undefined;
  const investigationReviewContext =
    mode === "investigation-review" ? sanitizeInvestigationReviewContext(body.investigationReviewContext) : undefined;

  const { topics } = buildTutorContext({
    userMessage: message,
    currentTopicId,
    currentQuizId,
    currentScenarioId,
    selectedTopicIds,
  });

  const system = buildSystemBlocks({
    mode,
    curriculumTopics: topics,
    progressSummary,
    quizReviewContext,
    investigationCoachStatus,
    investigationReviewContext,
  });

  try {
    const answer = await getAiProvider().generateReply({
      system,
      messages: [...history, { role: "user", content: message }],
    });

    const response: TutorApiResponse = {
      answer: answer || "I couldn't generate a response just now — please try again in a moment.",
      relatedTopicIds: topics.map((t) => t.id),
      mode,
    };
    return NextResponse.json(response);
  } catch (err) {
    // Never expose raw provider/API errors or stack traces to the client —
    // see root CLAUDE.md Part V.
    console.error("Tutor API error:", err);
    return NextResponse.json({ error: "provider_error" }, { status: 502 });
  }
}
