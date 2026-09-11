// Shared types for the DHL IT Training Hub.
// All data behind these types is fake/generic training content — see root CLAUDE.md.

export type TeamId = "infrastructure" | "applications" | "support-network";

export interface Team {
  id: TeamId;
  name: string;
  tagline: string;
  /** General enterprise IT knowledge — not a confirmed description of any specific
   * organization's team. See root CLAUDE.md. */
  simpleExplanation: string;
  technicalExplanation: string;
  responsibilities: string[];
  exampleProblems: string[];
  universityConnections: { area: string; connection: string }[];
  checklist: string[];
  /** Generic, open learning prompts — not confirmed answers. */
  thingsToLearn: string[];
}

export type UrgencyLevel = "Critical" | "High" | "Medium" | "Low";

export type TicketStatus = "Open" | "In Progress" | "Escalated" | "Resolved";

export interface Ticket {
  id: string;
  title: string;
  department: string;
  problem: string;
  impact: string;
  status: TicketStatus;
  /** Teams a trainee could plausibly pick — used to avoid making every case obvious. */
  plausibleTeams: TeamId[];
  recommendedTeam: TeamId;
  reasoning: string;
  suggestedTroubleshooting: string[];
  escalationNote: string;
  likelyRootCauses: string[];
  exampleResolution: string;
  documentationNotes: string;
  /** True when the ticket intentionally has more than one plausible cause/team. */
  hasMultipleCauses: boolean;
  /** LearningTopic ids this ticket illustrates — the single source of truth for
   * Learn ↔ Ticket Simulator links (see lib/data/learning). Not forced onto every
   * ticket; empty when no topic genuinely applies. */
  topicIds: string[];
}

/** Curated "today" content shown on the Dashboard, deliberately narrower than
 * it used to be: it no longer carries dayNumber/currentTeam/progressSummary,
 * which were the hand-maintained fields behind the "stuck on Day 2" bug — the
 * Dashboard hero now derives day/date live via useInternshipProgress
 * (see lib/useInternshipProgress.ts) instead of reading a stored narrative
 * that had to be remembered and edited every day. */
export interface DashboardData {
  todaysGoals: string[];
  todaysQuestions: string[];
  todaysPractice: string;
}

export interface TeamQuestions {
  team: TeamId;
  questions: string[];
}

export const INVOLVEMENT_LEVELS = [
  "Observed",
  "Learned",
  "Assisted",
  "Participated",
  "Performed",
  "Built",
  "Implemented",
] as const;

export type InvolvementLevel = (typeof INVOLVEMENT_LEVELS)[number];

export interface DailyLogEntry {
  id: string;
  date: string; // ISO date string, e.g. "2026-08-25"
  dayNumber: number;
  team: TeamId | "General";
  observed: string;
  learned: string;
  newTerminology: string;
  toolsConcepts: string;
  questionsAsked: string;
  answerSummary: string;
  didNotUnderstand: string;
  toResearchLater: string;
  practiceCompleted: string;
  tomorrowsGoals: string;
}

// ---------------------------------------------------------------------------
// Learning library (Phase 2A). Content lives in src/lib/data/learning/ — these
// types just describe its shape so it could later move to Supabase/a CMS without
// the UI changing. All content is general enterprise IT knowledge, never a
// confirmed description of DHL specifically — see root CLAUDE.md.
// ---------------------------------------------------------------------------

export type LearningCategory =
  | "IT Service Management"
  | "Infrastructure"
  | "Networking"
  | "Applications"
  | "Security Fundamentals"
  | "Business & Logistics"
  | "BPO & Process Automation"
  | "Enterprise Automation";

export type LearningLevel = "Foundation" | "Intermediate";

export interface LearningPracticeScenario {
  scenario: string;
  question: string;
  /** Model reasoning shown after "Reveal guidance" — not a scored answer. */
  guidance: string;
}

/** A lightweight "don't confuse this with..." callout — only added where mixing
 * two concepts up is a genuinely common beginner mistake, not on every topic. */
export interface LearningContrast {
  topicId: string;
  note: string;
}

export interface LearningTopic {
  id: string;
  title: string;
  category: LearningCategory;
  level: LearningLevel;
  /** Realistic, not scientifically precise — most topics read in ~5-10 min. */
  estimatedMinutes: number;
  shortDescription: string;

  /** Team most likely to be involved — framed as "commonly," never absolute. */
  primaryTeam: TeamId;
  relatedTeams: TeamId[];

  /** 2-4 short "after this lesson you should be able to..." outcomes. */
  learningOutcomes: string[];

  simpleExplanation: string;
  eli10: string;
  technicalExplanation: string;
  businessPurpose: string;

  commonProblems: string[];
  /** Ordered steps teaching a troubleshooting thought process, not just facts. */
  troubleshootingSteps: string[];

  universityConnections: { area: string; connection: string }[];

  practiceScenario: LearningPracticeScenario;
  questionToAskAtWork: string;

  relatedTopicIds: string[];
  /** Extra search terms (synonyms/jargon) beyond title/description/category. */
  keywords: string[];
  /** Recommended, not required — lessons are never hard-locked. */
  prerequisiteTopicIds?: string[];
  /** Only where mixing the two up is a common beginner mistake. */
  dontConfuseWith?: LearningContrast[];
}

export interface LearningPath {
  id: string;
  title: string;
  purpose: string;
  /** Ordered topic ids — path progress is derived from topic completion at
   * render time, never stored separately. */
  topicIds: string[];
}

export interface CvAchievement {
  id: string;
  date: string; // ISO date string
  team: TeamId | "General";
  rawNote: string;
  involvementLevel: InvolvementLevel;
  skillsInvolved: string;
  whatLearned: string;
  suggestedCvWording: string;
  evidenceNotes: string;
  /** Where this achievement came from. Undefined/"internship" = a real internship
   * observation logged by hand (the original CV Tracker behavior). "portfolio-project"
   * = generated from a completed Enterprise Project in the Automation Lab — always
   * rendered with a visible "Portfolio / simulated project" badge so it's never
   * mistaken for real internship work. See root CLAUDE.md's CV honesty rule. */
  source?: "internship" | "portfolio-project";
}

// ---------------------------------------------------------------------------
// Advanced Investigations (Phase 3). Content lives in
// src/lib/data/investigations/ — a branching, evolving-evidence layer on top of
// the fixed-scenario Quick Practice tickets (lib/data/tickets.ts), which remain
// unchanged. All scenarios are fictional generic enterprise IT training content
// — see root CLAUDE.md. The engine here is deliberately company-agnostic: no
// scenario, team id, or escalation path assumes anything DHL-specific.
// ---------------------------------------------------------------------------

export const BUSINESS_IMPACT_SCOPES = [
  "One user",
  "A small team",
  "A department",
  "Multiple departments",
  "Organization-wide",
] as const;
export type BusinessImpactScope = (typeof BUSINESS_IMPACT_SCOPES)[number];

/** Generic training hypotheses a learner can hold/change during an investigation
 * — deliberately not tied to any one team, since real evidence often points
 * somewhere unexpected. */
export const INVESTIGATION_HYPOTHESES = [
  { id: "dns", label: "DNS issue" },
  { id: "network", label: "Network issue" },
  { id: "application", label: "Application issue" },
  { id: "database", label: "Database issue" },
  { id: "authentication", label: "Authentication issue" },
  { id: "authorization", label: "Authorization issue" },
  { id: "infrastructure", label: "Infrastructure issue" },
  { id: "unknown", label: "Unknown / need more evidence" },
] as const;
export type InvestigationHypothesis = (typeof INVESTIGATION_HYPOTHESES)[number]["id"];

/** Fixed set of resolution-documentation fields, shared by every scenario so the
 * UI/scoring never needs per-scenario field config — only the model example
 * answers (InvestigationScenario.modelDocumentation) vary. */
export const DOCUMENTATION_FIELDS = [
  { id: "issueSummary", label: "Issue summary", placeholder: "What was reported, in your own words..." },
  { id: "scopeImpact", label: "Scope / impact", placeholder: "Who or what was affected, and how widely..." },
  { id: "evidenceGathered", label: "Evidence gathered", placeholder: "What you checked and what you found..." },
  { id: "likelyCause", label: "Likely / root cause", placeholder: "What the evidence points to..." },
  { id: "actionTaken", label: "Action taken", placeholder: "What you did, or recommended doing..." },
  { id: "escalation", label: "Escalation", placeholder: "Who this was escalated to, if anyone, and why..." },
  { id: "verification", label: "Verification", placeholder: "How you confirmed the issue was actually resolved..." },
] as const;
export type DocumentationFieldId = (typeof DOCUMENTATION_FIELDS)[number]["id"];

/** How good a choice was — real troubleshooting often has more than one
 * reasonable option, so "reasonable" is a genuine, non-penalized second choice,
 * not a watered-down "wrong." */
export type ActionQuality = "strong" | "reasonable" | "weak" | "unnecessary";

/** Which stage of the Scope → Symptoms → Isolate → Test → Gather Evidence → Fix
 * or Escalate → Verify → Document framework an action belongs to (Symptoms/Test
 * fold into "evidence" and "diagnose" respectively — this is the scoring-facing
 * subset, not a literal 1:1 restatement of all 8 framework labels). */
export type InvestigationStage = "scope" | "evidence" | "diagnose" | "resolve" | "escalate" | "verify";

export interface DiagnosticQuestion {
  id: string;
  question: string;
  /** Revealed inline when asked — counts as evidence gathering, but never forces
   * navigation, so asking questions is always safe to do liberally. */
  answer: string;
}

export interface InvestigationAction {
  id: string;
  label: string;
  description: string;
  /** Node this action leads to — may be the current node itself (a deliberate
   * self-loop, used for weak/unnecessary actions so a poor choice teaches a
   * lesson via feedback without dead-ending the investigation). */
  nextNodeId: string;
  quality: ActionQuality;
  stage: InvestigationStage;
  /** Shown immediately after the action is chosen — explains *why* it was a
   * good/weak/unnecessary choice, never just labels it. */
  feedback: string;
}

export interface InvestigationNode {
  id: string;
  prompt: string;
  /** Fictional training evidence revealed on arrival — always rendered labeled
   * as such in the UI. Never real DHL logs, hostnames, IPs, or systems. */
  evidence?: string[];
  diagnosticQuestions?: DiagnosticQuestion[];
  /** Empty/absent only on a terminal node (one that carries `outcome`). */
  actions: InvestigationAction[];
  outcome?: InvestigationOutcome;
}

export type InvestigationResultType = "resolved" | "escalated";

export interface InvestigationOutcome {
  result: InvestigationResultType;
  /** Overall quality of this specific ending — an escalation with strong
   * evidence and a resolution reached directly can both be "strong"; there is
   * no single correct ending. */
  quality: ActionQuality;
  summary: string;
  /** Only meaningful when result is "escalated". Framed as "commonly involves,"
   * never asserted as the one true owner — see root CLAUDE.md. */
  escalatedTeam?: TeamId;
  /** The model reasoning path shown in "Better reasoning path" feedback. */
  modelResolution: string;
}

export interface InvestigationScenario {
  id: string;
  title: string;
  description: string;
  difficulty: LearningLevel;
  estimatedMinutes: number;
  initialReport: string;
  suggestedBusinessImpact: BusinessImpactScope;
  businessImpactNote: string;
  relatedTopicIds: string[];
  likelyTeams: TeamId[];
  learningObjectives: string[];
  startNodeId: string;
  nodes: Record<string, InvestigationNode>;
  modelFinalHypothesis: InvestigationHypothesis;
  modelDocumentation: Record<DocumentationFieldId, string>;
  /** Learn topics recommended in the post-scenario "Recommended Review" —
   * usually related topics, occasionally a superset (e.g. also pointing back to
   * an Escalation lesson even if not directly tagged). */
  topicsToReview: string[];
}

// ---- Learner progress through a scenario (persisted, see investigationProgress.ts) ----

export interface TimelineEntry {
  id: string;
  /** Local timestamp for ordering only — not a real incident log. */
  timestamp: number;
  kind: "start" | "action" | "question" | "hypothesis" | "impact" | "verify" | "document";
  label: string;
  detail?: string;
}

export interface ActionTakenRecord {
  actionId: string;
  nodeId: string;
  quality: ActionQuality;
  stage: InvestigationStage;
}

export interface InvestigationProgress {
  scenarioId: string;
  currentNodeId: string;
  history: TimelineEntry[];
  actionsTaken: ActionTakenRecord[];
  askedQuestionIds: string[];
  /** Ordered — first entry is the initial hypothesis, last is the final one. */
  hypothesisHistory: InvestigationHypothesis[];
  businessImpact?: BusinessImpactScope;
  documentation: Partial<Record<DocumentationFieldId, string>>;
  completed: boolean;
  score?: InvestigationScore;
}

export type PerformanceCategory = "Excellent" | "Strong" | "Developing" | "Needs Review";

export interface CategoryScore {
  label: string;
  score: number; // 0-100
  weight: number; // 0-1, sums to 1 across all categories
}

export interface InvestigationScore {
  categories: CategoryScore[];
  overall: number; // 0-100, weighted
  overallCategory: PerformanceCategory;
  whatWentWell: string[];
  whatCouldImprove: string[];
  betterReasoningPath: string;
}

/** Lightweight completion record — Phase 4 analytics builds on this (see
 * SkillProgress below), not on anything added here. */
export interface InvestigationCompletionRecord {
  scenarioId: string;
  completedAt: string; // ISO date string
  score: number;
  resultCategory: PerformanceCategory;
}

// ---------------------------------------------------------------------------
// Automation Lab (Enterprise Automation track). A hands-on, block-assembly
// workflow builder sitting alongside Advanced Investigations — genuinely
// different interaction model (construct-and-submit vs. branching dialogue), so
// it gets its own type rather than being forced into InvestigationScenario's
// node-graph shape. The grading *philosophy* is the same as Investigations,
// though: each scenario tags its own fictional content (here, blocks tagged
// `role`), and lib/automationLabScoring.ts is a generic engine that only reads
// those tags — never a hand-written per-scenario answer key. All scenario
// content is fictional generic enterprise automation training material (e.g.
// "Global Logistics Co.", "Supplier ABC") — see root CLAUDE.md.
// ---------------------------------------------------------------------------

export type AutomationBlockCategory = "trigger" | "action" | "condition" | "logic";

/** essential = must be in a correct workflow; recommended = good practice, partial
 * credit if missing (e.g. duplicate protection, error handling); distractor = a
 * plausible-looking block that is wrong or unnecessary for this scenario —
 * including it costs points. Every block a scenario offers carries exactly one
 * of these, and the generic scoring engine only ever reads this tag. */
export type AutomationBlockRole = "essential" | "recommended" | "distractor";

export interface AutomationBlock {
  id: string;
  category: AutomationBlockCategory;
  label: string;
  description: string;
  role: AutomationBlockRole;
  /** Shown in the result screen's Correct/Missing/Distractor lists regardless of
   * outcome — explanations, not just a label. */
  feedback: string;
  /** 1-based position in the model solution. Only set for essential/recommended
   * blocks (distractors don't belong in any solution, so have no position). */
  idealPosition?: number;
}

export interface AutomationLabScenario {
  id: string;
  title: string;
  description: string;
  /** false = Automation Lab practice exercise, true = Enterprise Project capstone
   * (see /projects). Both are built with the same engine/UI — this only changes
   * which listing page shows the scenario and whether it carries CV fields. */
  isEnterpriseProject: boolean;
  difficulty: LearningLevel;
  estimatedMinutes: number;
  /** The business ask, shown before the learner starts building. */
  scenarioBrief: string;
  /** e.g. ["Outlook","Power Automate","SharePoint","Excel","Power BI"] — shown as badges. */
  toolsInvolved: string[];
  relatedTopicIds: string[];
  likelyTeams: TeamId[];
  learningObjectives: string[];
  /** The full offered palette for this scenario — essential + recommended + a few
   * distractors. Self-contained per scenario, like each ticket/investigation
   * defines its own fictional evidence, rather than one shared global catalog. */
  blocks: AutomationBlock[];
  /** Narrative walkthrough of the ideal solution, shown on the result screen. */
  modelWorkflowSummary: string;
  /** Only set when isEnterpriseProject is true. */
  projectAudience?: string;
  /** Only set when isEnterpriseProject is true — the Feature 6 CV connection.
   * Always rendered with a "Portfolio / simulated project" label; never implies
   * real deployment. See CvAchievement.source. */
  cvDescription?: string;
  skillsDemonstrated?: string[];
}

export interface AutomationLabCategoryScore {
  label: string;
  score: number; // 0-100
  weight: number; // 0-1, sums to 1
}

export interface AutomationLabScore {
  categories: AutomationLabCategoryScore[];
  overall: number; // 0-100, weighted
  overallCategory: PerformanceCategory; // reuses the same Excellent/Strong/Developing/Needs Review bands
  correct: AutomationBlock[];
  missing: AutomationBlock[]; // essential/recommended blocks not included
  incorrectlyIncluded: AutomationBlock[]; // distractor blocks the learner included
  orderingNotes: string[];
  /** Essential + recommended blocks in idealPosition order — rendered via the
   * existing FlowDiagram component on the result screen. */
  modelOrder: AutomationBlock[];
}

export interface AutomationLabAttempt {
  attemptId: string;
  scenarioId: string;
  completedAt: string; // ISO date string
  submittedBlockIds: string[]; // learner's built, ordered sequence
  score: AutomationLabScore;
}

/** Lightweight completion shape mirroring InvestigationCompletionRecord — derived
 * at read time from the best attempt per scenario (see
 * lib/automationLabProgress.ts's getAutomationLabCompletions), never a second
 * stored "completions" domain. */
export interface AutomationLabCompletionRecord {
  scenarioId: string;
  completedAt: string;
  score: number;
}

// ---------------------------------------------------------------------------
// Quizzes (Phase 4). Content lives in src/lib/data/quizzes/ — a knowledge-check
// layer on top of the Learn library and Advanced Investigations. All content is
// fictional generic enterprise IT training material — see root CLAUDE.md.
// ---------------------------------------------------------------------------

export type QuizQuestionType = "single-choice" | "multi-select";

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  type: QuizQuestionType;
  options: QuizOption[];
  /** Exactly one id for single-choice; one or more for multi-select. */
  correctOptionIds: string[];
  explanation: string;
  /** Keyed by a specific wrong option id — a more targeted "why that's wrong"
   * than the general explanation. Only added where a genuinely common
   * misconception exists, not on every option. */
  misconceptionExplanations?: Record<string, string>;
  relatedTopicIds: string[];
  difficulty: LearningLevel;
}

export type QuizCategory = LearningCategory | "Enterprise Troubleshooting";

export interface Quiz {
  id: string;
  title: string;
  description: string;
  category: QuizCategory;
  difficulty: LearningLevel;
  estimatedMinutes: number;
  relatedTopicIds: string[];
  relatedPathIds: string[];
  questions: QuizQuestion[];
  /** What a strong score on this specific quiz suggests — shown alongside the
   * generic score-band guidance, not a numeric pass/fail threshold. */
  passingGuidance: string;
}

export interface QuizAnswer {
  questionId: string;
  selectedOptionIds: string[];
  correct: boolean;
}

export interface QuizAttempt {
  attemptId: string;
  quizId: string;
  completedAt: string; // ISO date string
  correctCount: number;
  totalQuestions: number;
  percentage: number; // 0-100
  answers: QuizAnswer[];
}

/** Learning descriptors only — never "Certified"/"Expert"/"Job Ready". */
export type QuizResultGuidance = "Strong understanding" | "Good foundation" | "Developing" | "Review recommended";

// ---------------------------------------------------------------------------
// Skill / readiness model (Phase 4). Always derived from existing activity —
// completed Learn topics, quiz attempts, Advanced Investigation completions —
// never stored as a second, independent readiness score. See root CLAUDE.md:
// this is a training indicator, not a validated professional assessment.
// ---------------------------------------------------------------------------

export const SKILL_IDS = [
  "itsm",
  "infrastructure",
  "networking",
  "applications",
  "security",
  "troubleshooting",
  "business-logistics",
  "process-optimization-automation",
  "enterprise-automation",
] as const;
export type SkillId = (typeof SKILL_IDS)[number];

export interface SkillDefinition {
  id: SkillId;
  name: string;
  description: string;
}

/** Grounded, non-inflated labels — deliberately never "Expert"/"Professional"/"Certified". */
export const SKILL_LEVELS = ["Not Started", "Getting Started", "Building Foundation", "Practicing", "Strong Foundation"] as const;
export type SkillLevel = (typeof SKILL_LEVELS)[number];

export interface SkillEvidence {
  learning: { completed: number; total: number; percentage: number };
  knowledge: { attempted: number; total: number; percentage: number };
  practical: { completed: number; total: number; percentage: number };
}

export interface SkillProgress {
  skill: SkillDefinition;
  overall: number; // 0-100, weighted 30/30/40 across the evidence above
  level: SkillLevel;
  evidence: SkillEvidence;
}

export interface Recommendation {
  id: string;
  /** Internal sort key only — higher is more important; never shown in the UI. */
  priority: number;
  title: string;
  description: string;
  href: string;
  skillId?: SkillId;
}

// ---------------------------------------------------------------------------
// AI Tutor (Phase 6). Conversation state is a persisted domain model like every
// other Phase 1-5 hook (see lib/tutorConversation.ts), so it lives here. The
// request/response wire contract with /api/tutor, system-prompt construction,
// and curriculum retrieval are NOT persisted — they live in lib/ai/ instead.
// See root CLAUDE.md: the tutor is grounded in this app's own curriculum and
// must never invent DHL-specific facts or receive confidential data.
// ---------------------------------------------------------------------------

/** Trusted application context, not user-chosen — always set by the page/link
 * that opened the tutor, never inferred from free-text alone. */
export const TUTOR_MODES = [
  "tutor",
  "topic-tutor",
  "quiz-coach",
  "quiz-review",
  "investigation-coach",
  "investigation-review",
  "progress-coach",
  "automation-coach",
  "automation-review",
  // Phase 14 — AI Learning Coach 2.0. Additive top-level modes the learner
  // picks directly from the Tutor's own mode selector — distinct from the
  // modes above, which are always set by a trusted deep link from a specific
  // page (e.g. an active quiz/investigation/automation attempt) and never
  // shown in the picker. "tutor" itself is reused/relabeled "Explain" in the
  // UI rather than duplicated, since its existing behavior already is that.
  "coach",
  "quiz-me",
  "troubleshoot",
  "project-mentor",
  "interview",
  "review",
] as const;
export type TutorMode = (typeof TUTOR_MODES)[number];

/** Fictional-only troubleshoot scenario categories (Phase 14) — the learner
 * picks one, the Tutor generates and runs a progressive-disclosure scenario
 * within it. See lib/ai/tutorPrompt.ts's troubleshoot mode instructions for
 * the "fictional, generic, no real company" rule this list is used under. */
export const TROUBLESHOOT_CATEGORIES = [
  "dns",
  "authentication",
  "networking",
  "email-delivery",
  "permissions",
  "endpoint",
  "cloud-availability",
  "automation-workflow",
] as const;
export type TroubleshootCategory = (typeof TROUBLESHOOT_CATEGORIES)[number];

/** Mock-interview categories (Phase 14). Never used to fabricate a hiring
 * probability — see lib/ai/tutorPrompt.ts's interview mode instructions. */
export const INTERVIEW_CATEGORIES = [
  "graduate-it",
  "infrastructure",
  "cybersecurity",
  "automation",
  "applications-support",
  "general-enterprise-it",
] as const;
export type InterviewCategory = (typeof INTERVIEW_CATEGORIES)[number];

/** Project Mentor's reveal-level control (Phase 14) — sent per-message, never
 * stored, so a learner can dial it up/down turn to turn. */
export const HINT_LEVELS = [1, 2, 3] as const;
export type HintLevel = (typeof HINT_LEVELS)[number];
export const HINT_LEVEL_LABELS: Record<HintLevel, string> = { 1: "Nudge", 2: "Strong hint", 3: "Explanation" };

export type TutorRole = "user" | "assistant";

export interface TutorMessage {
  id: string;
  role: TutorRole;
  content: string;
  mode: TutorMode;
  /** Only ever populated on assistant messages, from server-computed grounding
   * — never a model-generated URL/id (see root CLAUDE.md and lib/ai/tutorContext.ts). */
  relatedTopicIds: string[];
  createdAt: string; // ISO date string
}

/** One lightweight running conversation per learner for Phase 6 — not a full
 * multi-conversation history browser (deliberately out of scope, see
 * docs/AI-TUTOR.md "known limitations"). "Start new conversation" begins a
 * fresh id; older messages are not deleted server-side, just no longer shown. */
export interface TutorConversation {
  id: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// Company context (Phase 7 Part P). A lightweight, deliberately unbuilt-out
// structure so a future organization-specific context (if ever added) has a
// designated home, kept separate from generic, company-agnostic Business &
// Logistics curriculum (src/lib/data/learning/businessLogistics.ts). This is
// NOT a company-management feature — there is exactly one instance of this
// type in the app (see lib/data/companyContext.ts), gated behind Local/Private
// mode (see lib/product.ts). Never invent facts here beyond what's explicitly
// public or explicitly entered by the user — see root CLAUDE.md.
// ---------------------------------------------------------------------------
export interface CompanyContext {
  id: string;
  name: string;
  /** Shown wherever this context is displayed — never optional. */
  disclaimer: string;
  /** Only explicitly public, generic facts — never invented or confidential. */
  publicFacts: string[];
  /** Documentation only — actual observations are always rendered live from
   * Daily Log entries (see useDailyLogEntries), never duplicated/stored here. */
  observations: string[];
}

// ---------------------------------------------------------------------------
// Analytics (Phase 8). Every type below describes DERIVED data only — there is
// no analytics database table and no second stored truth. Each is computed at
// render time in src/lib/analytics/ from the same three evidence sources
// skillProgress.ts already reads (learning-topic-progress, quiz-attempts,
// investigation-completions) plus static curriculum data. See root CLAUDE.md's
// Phase 8 section and docs/ANALYTICS.md for the full derivation/privacy
// writeup. These are educational progress indicators — never job-readiness,
// certification, or professional-competence claims.
// ---------------------------------------------------------------------------

export interface TrainingOverview {
  topicsCompleted: number;
  topicsTotal: number;
  quizzesAttempted: number;
  quizzesTotal: number;
  investigationsCompleted: number;
  investigationsTotal: number;
  automationScenariosCompleted: number;
  automationScenariosTotal: number;
  pathsInProgress: number;
  pathsCompleted: number;
  pathsTotal: number;
  overallProgress: number; // 0-100, same calculateOverallTrainingProgress mean used by /progress
}

export interface QuizAttemptTrendPoint {
  attemptNumber: number;
  percentage: number;
  completedAt: string;
}

export type TrendDirection = "improving" | "declining" | "steady" | "insufficient-data";

export interface QuizAnalyticsEntry {
  quiz: Quiz;
  attemptCount: number;
  latestPercentage: number | null;
  bestPercentage: number | null;
  latestCompletedAt: string | null;
  /** Ordered oldest -> newest, capped at the same 10-attempt history the app
   * already keeps — never a fabricated longer history. */
  trend: QuizAttemptTrendPoint[];
  trendDirection: TrendDirection;
  resultGuidance: QuizResultGuidance | null;
  relatedSkillIds: SkillId[];
}

export interface InvestigationCompletionSummary {
  scenario: InvestigationScenario;
  completedAt: string;
  score: number;
  resultCategory: PerformanceCategory;
  /** Learn category the scenario is most associated with, via its own
   * relatedTopicIds — used to group "strongest/focus areas," never a second
   * hand-maintained mapping. */
  primaryCategory: LearningCategory | null;
}

export interface InvestigationAreaScore {
  category: LearningCategory;
  averageScore: number;
  completedCount: number;
}

export interface InvestigationAnalytics {
  completions: InvestigationCompletionSummary[];
  completedCount: number;
  totalScenarios: number;
  averageScore: number | null;
  strongestAreas: InvestigationAreaScore[];
  focusAreas: InvestigationAreaScore[];
}

export interface LearningPathAnalyticsEntry {
  path: LearningPath;
  topicsCompleted: number;
  topicsTotal: number;
  progressPercentage: number;
  checkpointQuiz: QuizAnalyticsEntry | null;
  relatedInvestigationsCompleted: number;
  relatedInvestigationsTotal: number;
  /** Next not-yet-completed topic in the path, or null once complete — same
   * "recommend, never hard-lock" rule as everywhere else this path data is used. */
  nextTopic: LearningTopic | null;
}

export type TrainingActivityEventType = "quiz-attempt" | "investigation-completion" | "automation-lab-attempt";

export interface TrainingActivityEvent {
  id: string;
  type: TrainingActivityEventType;
  /** ISO timestamp — always a real timestamp from the underlying record
   * (QuizAttempt.completedAt / InvestigationCompletionRecord.completedAt).
   * Learn topic completions are NOT included here because the current data
   * model doesn't store a per-topic completion timestamp — see
   * docs/ANALYTICS.md rather than inventing one. */
  timestamp: string;
  title: string;
  description: string;
  href: string;
}

export interface WeeklyActivityCount {
  /** ISO date (Monday) of the week this bucket represents. */
  weekStart: string;
  count: number;
}

export interface SkillAnalyticsEntry {
  progress: SkillProgress;
  recommendedAction: Recommendation | null;
  /** Short, human-readable rollup of what evidence actually exists for this
   * skill, e.g. "6/9 lessons, 1 assessment attempted, 2 investigations done." */
  activitySummary: string;
}

/** Shared bundle both /analytics/summary and /manager-preview build from — one
 * computation, two presentations (full page vs. read-only preview), never two
 * separate derivations of the same numbers. */
export interface TrainingSummary {
  overview: TrainingOverview;
  skills: SkillAnalyticsEntry[];
  strongestSkills: SkillDefinition[];
  focusSkills: SkillDefinition[];
  recentActivity: TrainingActivityEvent[];
  generatedAt: string;
}

// ---------------------------------------------------------------------------
// Training Assignments (Phase 9 Part D/E/F). A lightweight, static/config-driven
// concept — NOT a new competency score and NOT organization-wide manager
// functionality. An assignment is just a named bundle of required learning path,
// quiz, and investigation ids (see lib/data/assignments.ts, the single source of
// truth); assignment "completion" is only completion against that required list,
// always derived at render time from the same three evidence sources every other
// derived-progress feature already reads — never a second stored score. See root
// CLAUDE.md's Phase 9 scope.
export interface TrainingAssignment {
  id: string;
  title: string;
  /** Who this template is written for, e.g. "IT interns and graduate hires focusing on core enterprise IT vocabulary." */
  audience: string;
  purpose: string;
  estimatedScope: string;
  requiredPathIds: string[];
  requiredQuizIds: string[];
  requiredScenarioIds: string[];
  /** Recommended, never required — same "recommend, don't hard-lock" rule as prerequisiteTopicIds. */
  recommendedTopicIds?: string[];
}

export interface AssignmentRequirementProgress {
  completed: number;
  total: number;
  percentage: number;
}

export interface AssignmentProgress {
  assignment: TrainingAssignment;
  paths: AssignmentRequirementProgress;
  quizzes: AssignmentRequirementProgress;
  investigations: AssignmentRequirementProgress;
  /** Mean of the three category percentages above — completion against the
   * required list only, never a weighted competency score like SkillProgress.overall. */
  overallCompletion: number;
  /** First not-yet-done required item (a path's next topic, an unattempted
   * required quiz, or an uncompleted required investigation), or null once
   * every requirement is met. Recommend, never hard-lock — same rule as everywhere else. */
  nextRequiredAction: Recommendation | null;
}

// ---------------------------------------------------------------------------
// Onboarding (Phase 9 Part P/Q). Minimal preferences used only to suggest a
// starting TrainingAssignment via a deterministic mapping (lib/onboarding.ts) —
// no AI, no complex personalization. Stored locally (see useOnboardingPreferences)
// — deliberately not a new Supabase table, per Phase 9's "prefer the simplest
// safe option" guidance. Never collects employer, salary, age, or other private
// profile data — see root CLAUDE.md.
export const ONBOARDING_GOALS = [
  "Starting an internship/job",
  "Preparing for enterprise IT",
  "Improving IT support skills",
  "Learning business/logistics technology",
  "Exploring enterprise IT",
] as const;
export type OnboardingGoal = (typeof ONBOARDING_GOALS)[number];

export const ONBOARDING_FOCUS_AREAS = [
  "IT Support",
  "Infrastructure",
  "Networking",
  "Applications",
  "Security",
  "Business & Logistics",
  "Not sure",
] as const;
export type OnboardingFocusArea = (typeof ONBOARDING_FOCUS_AREAS)[number];

export const ONBOARDING_EXPERIENCE_LEVELS = ["Beginner", "CS/IT student", "Graduate", "Junior professional"] as const;
export type OnboardingExperience = (typeof ONBOARDING_EXPERIENCE_LEVELS)[number];

export interface OnboardingPreferences {
  completed: boolean;
  goal: OnboardingGoal | null;
  focusArea: OnboardingFocusArea | null;
  experience: OnboardingExperience | null;
  /** The assignment id the deterministic mapping suggested — recorded for
   * reference, never auto-activated without the learner choosing to. */
  recommendedAssignmentId: string | null;
}

// ---------------------------------------------------------------------------
// BPO Project Prep worksheet (post-Phase-10 BPO & Process Automation learning
// expansion). A PRIVATE, personal, local-only worksheet — see
// lib/bpoProjectPrep.ts and src/app/bpo/project-prep — never synced to
// Supabase, never sent to the AI Tutor, and never surfaced in Analytics/
// Manager Preview/Pilot Report. Fixed field structure, same DOCUMENTATION_FIELDS
// pattern used by Advanced Investigations, so the UI never needs per-field
// config. Nicolas fills this in himself; the app never invents or infers any
// of these values — see root CLAUDE.md's confidentiality rules.
// ---------------------------------------------------------------------------
export const BPO_PROJECT_PREP_FIELDS = [
  { id: "problem", label: "Problem", placeholder: "What problem are we trying to solve?" },
  { id: "asIsProcess", label: "Current As-Is Process", placeholder: "Step 1...\nStep 2...\nStep 3..." },
  { id: "peopleTeams", label: "People / Teams Involved", placeholder: "Who performs each step? Who is affected?" },
  { id: "systemsFiles", label: "Systems / Files Involved", placeholder: "Which systems, files, or tools does this touch?" },
  { id: "trigger", label: "Trigger", placeholder: "What starts this process?" },
  { id: "inputs", label: "Inputs", placeholder: "What information or data is needed?" },
  { id: "businessRules", label: "Business Rules", placeholder: "What rules decide what happens next?" },
  { id: "outputs", label: "Outputs", placeholder: "What does this process produce?" },
  { id: "exceptions", label: "Exceptions", placeholder: "What unusual or edge cases occur?" },
  { id: "currentProblems", label: "Current Problems", placeholder: "What currently goes wrong, and how often?" },
  { id: "desiredToBe", label: "Desired To-Be Process", placeholder: "What would the improved version look like?" },
  { id: "successMeasures", label: "Success Measures", placeholder: "How would we know this actually improved?" },
  { id: "questionsToAsk", label: "Questions Still to Ask", placeholder: "What do you still need to find out before discussing this?" },
] as const;
export type BpoProjectPrepFieldId = (typeof BPO_PROJECT_PREP_FIELDS)[number]["id"];
export type BpoProjectPrepNotes = Partial<Record<BpoProjectPrepFieldId, string>>;

// ---------------------------------------------------------------------------
// Phase 11 — Premium Product Layer. Entitlements, Readiness Score, Skill-Gap
// Engine, Professional Milestones, Certificates, and structured CV Evidence.
// Every score/status here is DERIVED from the same evidence sources
// skillProgress.ts already reads (completed topics, quiz attempts,
// investigation completions, automation lab completions) — never a second,
// independently-stored readiness/competency truth. See root CLAUDE.md's
// repeated "never a second stored score" rule. Milestone/Certificate
// *unlock timestamps* are the one genuinely new kind of persisted state this
// phase adds (lib/data/milestones.ts, lib/data/certificatePrograms.ts) —
// eligibility itself is always recomputed live; only the moment it was first
// observed is recorded, exactly like InvestigationCompletionRecord already
// records a real completedAt rather than inventing one.
// ---------------------------------------------------------------------------

export const PRODUCT_TIERS = ["free", "pro", "enterprise"] as const;
export type ProductTier = (typeof PRODUCT_TIERS)[number];

export type SkillGapClassification = "strength" | "developing" | "gap";

export interface SkillGapEntry {
  progress: SkillProgress;
  classification: SkillGapClassification;
}

export interface ReadinessMomentum {
  activityCount30d: number;
  description: string;
}

/** The Readiness Score / Skill-Gap Engine bundle shown on /passport. Not a
 * new number — `overall` is the same calculateOverallTrainingProgress mean
 * /progress and /analytics already show; this just packages it with the
 * strength/developing/gap classification and a real-activity momentum note. */
export interface ReadinessProfile {
  overall: number;
  skills: SkillGapEntry[];
  strengths: SkillGapEntry[];
  developing: SkillGapEntry[];
  gaps: SkillGapEntry[];
  /** False only when literally zero evidence exists anywhere — used to show an
   * honest "not enough activity yet" state instead of a misleading 0%. */
  hasSufficientData: boolean;
  recentMomentum: ReadinessMomentum;
}

export type MilestoneCategory = "learning" | "knowledge" | "practical" | "path" | "assignment";

/** Static, hand-authored definition — the actual unlock RULE lives in
 * lib/data/milestones.ts's eligibility map, read against a
 * MilestoneEvaluationContext built from existing progress data. No cartoon
 * badge art, no XP — see root CLAUDE.md's gamification ban. */
export interface MilestoneDefinition {
  id: string;
  title: string;
  description: string;
  category: MilestoneCategory;
  /** Shown even before the milestone is earned, so a locked milestone still
   * tells the learner exactly what would unlock it. */
  criteriaDescription: string;
}

/** The only new persisted fact for milestones — WHEN eligibility was first
 * observed. Never itself the truth of whether the milestone is earned; that's
 * always recomputed live (see lib/data/milestones.ts). */
export interface MilestoneUnlock {
  milestoneId: string;
  unlockedAt: string; // ISO date string
}

/** A certificate program maps 1:1 onto an existing Learning Path — awarded on
 * 100% path completion plus (if the path has one) a passing score on any of
 * its related quizzes. skillNames is precomputed from static content (which
 * skills draw learning evidence from this path's topics), not user data. */
export interface CertificateProgramDefinition {
  id: string;
  title: string;
  pathId: string;
  description: string;
  skillNames: string[];
}

/** Unlike a milestone, a certificate's issuedAt/certificateRef must stay fixed
 * once earned — re-deriving them live every render would let a certificate's
 * date silently drift if the underlying data model ever changed, which is
 * wrong for something meant to be printed/shared. So this is a genuine,
 * intentional record, not just a timestamp cache. */
export interface CertificateRecord {
  programId: string;
  certificateRef: string;
  issuedAt: string; // ISO date string
  skillsSummary: string[];
}

/** Structured CV/portfolio evidence + an interview-ready STAR narrative,
 * derived from a completed Enterprise Project (Automation Lab). Reuses the
 * existing "Add to CV Tracker" prefill flow (see cv-tracker/page.tsx) rather
 * than building a second CV feature — addToCvHref is that same query-param
 * link. Every field traces back to data the learner actually produced or to
 * this scenario's own static content; nothing here is invented. */
export interface CvEvidenceItem {
  id: string;
  title: string;
  kind: "enterprise-project";
  dateCompleted: string;
  score: number;
  toolsOrSkills: string[];
  cvWording: string;
  interviewStory: { situation: string; task: string; action: string; result: string };
  addToCvHref: string;
}

// ---------------------------------------------------------------------------
// Phase 12 — Enterprise Admin. Everything here operates on ONE of two kinds of
// learner: the real signed-in user's own account (isYou: true, computed via
// the exact same hooks/engines every other page already uses) or a fictional,
// clearly-labeled demo roster member (isYou: false — see
// lib/data/admin/demoLearners.ts). This is deliberately NOT real multi-tenant
// architecture: there is no cross-user Supabase query anywhere in this phase,
// no other real account's data is ever read, and RLS is untouched — the same
// "read-only preview of the signed-in learner's own data, never another
// user's" boundary Phase 8's /manager-preview already established, just
// extended with a fictional cohort around it. Real multi-tenant organization
// isolation is Phase 13's job. See root CLAUDE.md's Phase 12 section.
// ---------------------------------------------------------------------------

export const USER_ROLES = ["learner", "manager", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

/** A learner as shown in the Enterprise Admin area. Evidence fields are
 * shaped exactly like the real per-user evidence sources
 * (learning-topic-progress / quiz-attempts / investigation-completions /
 * automation-lab-attempts) so every existing derivation engine
 * (calculateAllSkillProgress, computeAssignmentProgress,
 * computeTrainingOverview, computeActivityTimeline, getRecommendations) can
 * run against a demo learner exactly as it would against a real one — no
 * parallel/fabricated aggregate numbers, only fabricated INPUT evidence that
 * real engines then honestly derive numbers from. */
export interface AdminLearnerRecord {
  id: string;
  name: string;
  /** True only for the real signed-in user's own account. */
  isYou: boolean;
  cohortIds: string[];
  programmeId: string | null;
  joinedDate: string; // ISO date
  completedTopics: Record<string, boolean>;
  quizAttemptsMap: Record<string, QuizAttempt[]>;
  investigationCompletions: InvestigationCompletionRecord[];
  automationLabCompletions: AutomationLabCompletionRecord[];
  automationLabAttemptsMap: Record<string, AutomationLabAttempt[]>;
  /** Derived as the max timestamp across all generated/real evidence — null
   * only when the learner has recorded no activity at all. */
  lastActivityAt: string | null;
}

/** Cohorts are local, admin-scoped planning data (see lib/adminCohorts.ts) —
 * not a new Supabase table. There is no real multi-user membership to sync:
 * membership only ever references fictional demo learners or the admin's own
 * "You" record, so cloud persistence would add real multi-tenant surface
 * area for no actual benefit yet. isCustom distinguishes the 3 built-in demo
 * cohorts from ones the admin creates locally. */
export interface AdminCohort {
  id: string;
  name: string;
  description: string;
  memberLearnerIds: string[];
  isCustom: boolean;
}

export type AdminAssignmentTargetType = "learner" | "cohort";
export type AdminAssignmentRequirementType = "path" | "quiz" | "investigation" | "automation-scenario";
export type AdminAssignmentStatus = "assigned" | "started" | "completed" | "overdue";

/** An assignment record issued by the admin — local-only for the same reason
 * cohorts are (see above). Status is always derived at render time by
 * cross-referencing the target learner's actual evidence against
 * requirementId/dueDate — never stored as a fourth, independently-tracked
 * status field. requirementTitle is a display-only snapshot so the UI never
 * needs a second lookup that could go stale if content changes later. */
export interface AdminAssignmentRecord {
  id: string;
  targetType: AdminAssignmentTargetType;
  targetId: string;
  requirementType: AdminAssignmentRequirementType;
  requirementId: string;
  requirementTitle: string;
  dueDate: string | null;
  instructions: string;
  assignedAt: string;
}

/** A custom, locally-defined Programme — the same shape as the existing
 * static TrainingAssignment (Phase 9), reused deliberately rather than
 * duplicated (see lib/data/admin/programmes.ts). Local-only for the same
 * reason cohorts/assignments are. */
export type AdminCustomProgramme = TrainingAssignment;

export type AdminAttentionFlagKind = "overdue-assignment" | "low-quiz-performance" | "inactive" | "repeated-unsuccessful-attempts" | "major-competency-gap";

/** A deterministic, explainable risk flag (see lib/adminRiskSignals.ts) —
 * never an opaque AI-generated score. Every flag names exactly which rule
 * fired and why. */
export interface AdminAttentionFlag {
  learnerId: string;
  kind: AdminAttentionFlagKind;
  severity: "high" | "medium";
  reason: string;
}

// ---------------------------------------------------------------------------
// Phase 13 — Multi-Tenant SaaS Architecture. Real organizations, real
// membership, real cross-user data — the actual authorization boundary is
// Postgres RLS (see supabase/migrations/0006_multi_tenant.sql), never these
// TypeScript types or any client-side check. These types describe the SAME
// entities Phase 12's local/fictional AdminCohort/AdminAssignmentRecord/
// AdminCustomProgramme describe, prefixed "Org" to keep the two families
// visually distinct — Phase 12's types stay exactly as they were and keep
// powering the fictional demo experience; these new "Org" types back real,
// RLS-protected organization data. lib/adminRoster.ts (etc.) is what merges
// both into the single AdminLearnerRecord shape the existing /admin/* pages
// already render, so those pages needed no rewrite for this phase.
// ---------------------------------------------------------------------------

export const ORGANIZATION_ROLES = ["owner", "admin", "manager", "learner"] as const;
export type OrganizationRole = (typeof ORGANIZATION_ROLES)[number];

export const ORGANIZATION_TYPES = ["company", "university", "training_provider", "other"] as const;
export type OrganizationType = (typeof ORGANIZATION_TYPES)[number];

export interface Organization {
  id: string;
  name: string;
  slug: string;
  orgType: OrganizationType;
  createdBy: string;
  createdAt: string;
}

export type OrganizationMemberStatus = "active" | "removed";

/** One row = one user's role within one organization — the trust anchor
 * every RLS policy in 0006_multi_tenant.sql ultimately reduces to. Never
 * mutated by a raw client update — see updateOrganizationMemberRole /
 * removeOrganizationMember in lib/repositories/organizationRepository.ts,
 * both of which call a SECURITY DEFINER RPC that re-validates authorization
 * server-side, never a direct table write. */
export interface OrganizationMembership {
  id: string;
  organizationId: string;
  userId: string;
  role: OrganizationRole;
  status: OrganizationMemberStatus;
  joinedAt: string;
}

/** A membership row joined with the member's display name — used for the
 * roster UI. displayName may be null if a member hasn't set one. */
export interface OrganizationMemberProfile extends OrganizationMembership {
  displayName: string | null;
}

export type OrganizationInviteStatus = "pending" | "accepted" | "revoked";

/** A real invite RECORD — never a real email send, since no email service is
 * configured in this environment. The UI must always label this "not sent"
 * and surface the shareable join link instead. See root CLAUDE.md's Phase
 * 13 section. */
export interface OrganizationInvite {
  id: string;
  organizationId: string;
  email: string;
  role: Exclude<OrganizationRole, "owner">;
  status: OrganizationInviteStatus;
  invitedBy: string;
  token: string;
  createdAt: string;
}

export interface InvitePreview {
  organizationName: string;
  role: Exclude<OrganizationRole, "owner">;
  email: string;
  status: OrganizationInviteStatus;
}

/** Real, organization-scoped cohort — distinct from Phase 12's fictional
 * demo cohorts (lib/data/admin/demoLearners.ts), which remain local-only. */
export interface OrgCohort {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  createdBy: string;
  createdAt: string;
  memberUserIds: string[];
}

/** Real, organization-scoped custom Programme — same shape as the existing
 * static TrainingAssignment (Phase 9/12), stored server-side per organization
 * instead of locally. */
export interface OrgProgramme {
  id: string;
  organizationId: string;
  title: string;
  audience: string;
  purpose: string;
  estimatedScope: string;
  requiredPathIds: string[];
  requiredQuizIds: string[];
  requiredScenarioIds: string[];
  recommendedTopicIds: string[];
  createdBy: string;
  createdAt: string;
}

/** Real, organization-scoped assignment — mirrors Phase 12's local-only
 * AdminAssignmentRecord shape exactly, so the existing status-derivation
 * logic (lib/adminAssignmentStatusRules.ts) works unchanged for either. */
export interface OrgAssignment {
  id: string;
  organizationId: string;
  targetType: AdminAssignmentTargetType;
  targetId: string;
  requirementType: AdminAssignmentRequirementType;
  requirementId: string;
  requirementTitle: string;
  dueDate: string | null;
  instructions: string;
  assignedBy: string;
  assignedAt: string;
}
