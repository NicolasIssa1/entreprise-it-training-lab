import { HintLevel, InterviewCategory, TroubleshootCategory, TutorMode } from "@/lib/types";

// ---------------------------------------------------------------------------
// Provider-agnostic AI types. Kept separate from lib/types.ts because these
// describe the /api/tutor wire contract and provider plumbing, not persisted
// domain data — see root CLAUDE.md and docs/AI-TUTOR.md.
// ---------------------------------------------------------------------------

/** One block of the system prompt. `cache: true` marks the large, stable base
 * instructions (see tutorPrompt.ts) so providers that support prompt caching
 * (Anthropic) can avoid re-billing full price on every message in a
 * conversation — a real cost-control lever, not just an optimization detail. */
export interface AiSystemBlock {
  text: string;
  cache?: boolean;
}

export interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface AiGenerateInput {
  system: AiSystemBlock[];
  messages: AiChatMessage[];
}

/**
 * Minimal provider interface. Anthropic is the only implementation in Phase 6
 * (see anthropic.ts) — this exists only so a future second provider wouldn't
 * require rewriting the Tutor UI or the /api/tutor route, not because a
 * second provider is planned yet.
 */
export interface AiProvider {
  isConfigured(): boolean;
  generateReply(input: AiGenerateInput): Promise<string>;
}

// ---------------------------------------------------------------------------
// Structured context passed from trusted client state into the system prompt.
// Each of these is either resolved server-side from static curriculum data
// (quiz review) or a small, capped/allowlisted set of fields the server
// renders itself (never a free-form blob the client controls the wording of)
// — see /api/tutor/route.ts's sanitize* functions and docs/AI-TUTOR.md's
// "trust boundary" note.
// ---------------------------------------------------------------------------

export interface TutorProgressSummary {
  completedTopicIds: string[];
  quizBestPercentages: Record<string, number>;
  completedInvestigationIds: string[];
  skillLevels: Record<string, string>;
  topRecommendationTitles: string[];
  /** Phase 9 Part S — optional context so the Tutor can answer things like
   * "what should I focus on for my Infrastructure internship?" Validated
   * server-side against real assignment titles / focus area labels (see
   * /api/tutor/route.ts's sanitizeProgressSummary) — never free text, and
   * never anything that could name a real employer's systems. */
  currentAssignmentTitle?: string;
  onboardingFocusArea?: string;
  /** Phase 14 — compact additions to the learner-context summary. Every
   * field is capped/id-based, resolved server-side against real static
   * content or real SKILL_IDS (see /api/tutor/route.ts's
   * sanitizeProgressSummary) — never free text the client wrote itself.
   * Overall readiness is the exact same number /progress and the Skills
   * Passport already show — never a second, independently-computed figure. */
  readinessOverall?: number;
  strongestSkillIds?: string[];
  weakestSkillIds?: string[];
  completedProjectTitles?: string[];
  achievementTitles?: string[];
  certificateProgrammeTitles?: string[];
}

/** What the client sends for quiz-review — deliberately just ids + the
 * learner's own selected option ids. The server resolves the actual question
 * text, correct answer, explanation, and misconceptions from static quiz data
 * itself (lib/data/quizzes), so the client can never inject arbitrary
 * "explanation" text into the prompt. */
export interface QuizReviewRequestContext {
  quizId: string;
  questionId: string;
  selectedOptionIds: string[];
}

/** Server-rendered quiz review context, resolved from static data — see above. */
export interface QuizReviewContext {
  questionPrompt: string;
  questionType: string;
  optionLabels: string[];
  selectedOptionLabels: string[];
  correctOptionLabels: string[];
  correct: boolean;
  explanation: string;
  misconceptionNotes: string[];
  relatedTopicIds: string[];
}

/** What the client sends for investigation-coach — a small set of fields
 * describing what's already visible on-screen to the learner (current node
 * prompt/evidence, hypothesis, business impact), capped and length-limited
 * server-side. Never includes the hidden outcome/root cause. */
export interface InvestigationCoachStatus {
  currentNodePrompt: string;
  evidence: string[];
  hypothesis?: string;
  businessImpact?: string;
  actionsTakenCount: number;
}

/** What the client sends for investigation-review — only usable once a
 * scenario is completed, all fields copied from data already shown on the
 * InvestigationResult page the learner is looking at. */
export interface InvestigationReviewRequestContext {
  scenarioId: string;
  outcomeSummary: string;
  whatWentWell: string[];
  whatCouldImprove: string[];
  betterReasoningPath: string;
}

/** What the client sends for automation-coach — deliberately lighter than
 * InvestigationCoachStatus: the Automation Lab builder's in-progress block
 * selection is local component state, never persisted (only a final submitted
 * attempt is saved — see lib/automationLabProgress.ts), so there is no
 * "current live selection" to sync from. This just gives the Tutor the same
 * scenario brief/tools the learner is already looking at. */
export interface AutomationCoachStatus {
  scenarioBrief: string;
  toolsInvolved: string[];
}

/** What the client sends for automation-review — only usable once a scenario
 * has at least one submitted attempt, all fields copied from data already
 * shown on the AutomationLabResult page the learner is looking at. */
export interface AutomationReviewRequestContext {
  scenarioId: string;
  overallScore: number;
  correctLabels: string[];
  missingLabels: string[];
  incorrectlyIncludedLabels: string[];
  modelWorkflowSummary: string;
}

export interface TutorApiRequest {
  message: string;
  mode: TutorMode;
  currentTopicId?: string;
  currentQuizId?: string;
  currentScenarioId?: string;
  currentAutomationScenarioId?: string;
  selectedTopicIds?: string[];
  history?: AiChatMessage[];
  progressSummary?: TutorProgressSummary;
  quizReviewContext?: QuizReviewRequestContext;
  investigationCoachStatus?: InvestigationCoachStatus;
  investigationReviewContext?: InvestigationReviewRequestContext;
  automationCoachStatus?: AutomationCoachStatus;
  automationReviewContext?: AutomationReviewRequestContext;
  /** Phase 14 mode-specific session parameters — each validated against a
   * fixed allowlist server-side (see /api/tutor/route.ts), never free text. */
  troubleshootCategory?: TroubleshootCategory;
  interviewCategory?: InterviewCategory;
  hintLevel?: HintLevel;
  /** Quiz Me — a real SkillId to ground questions in, or omitted for a
   * general mixed session. */
  quizMeSkillId?: string;
}

export interface TutorApiResponse {
  answer: string;
  relatedTopicIds: string[];
  mode: TutorMode;
}

export type TutorApiErrorCode = "not_configured" | "rate_limited" | "invalid_request" | "provider_error";

export interface TutorApiError {
  error: TutorApiErrorCode;
}
