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
  | "Applications";

export interface LearningPracticeScenario {
  scenario: string;
  question: string;
  /** Model reasoning shown after "Reveal guidance" — not a scored answer. */
  guidance: string;
}

export interface LearningTopic {
  id: string;
  title: string;
  category: LearningCategory;
  shortDescription: string;

  /** Team most likely to be involved — framed as "commonly," never absolute. */
  primaryTeam: TeamId;
  relatedTeams: TeamId[];

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
