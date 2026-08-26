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

export interface DashboardData {
  dayNumber: number;
  currentTeam: TeamId;
  todaysGoals: string[];
  todaysQuestions: string[];
  todaysPractice: string;
  progressSummary: string;
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
  | "Security Fundamentals";

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

export const SKILL_IDS = ["itsm", "infrastructure", "networking", "applications", "security", "troubleshooting"] as const;
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
