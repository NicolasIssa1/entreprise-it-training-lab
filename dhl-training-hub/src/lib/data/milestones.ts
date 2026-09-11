import type { MilestoneDefinition, SkillProgress } from "@/lib/types";

/**
 * Professional Milestones (Phase 11). Deliberately grounded, resume-appropriate
 * language — no cartoon badges, no XP, no streak pressure, per root CLAUDE.md's
 * gamification ban. Every milestone's unlock RULE is a pure function of
 * existing progress data (see MILESTONE_ELIGIBILITY below); the only thing
 * ever persisted is WHEN it was first observed to be true (see
 * lib/milestoneUnlocks.ts), never a second stored "is it earned" flag.
 */
export interface MilestoneEvaluationContext {
  topicsCompletedCount: number;
  quizzesPassedCount: number; // best attempt >= 70% on distinct quizzes
  investigationsResolvedCount: number; // completions scoring >= 60
  automationBuildsCompletedCount: number;
  enterpriseProjectsCompletedCount: number;
  pathsCompletedCount: number;
  assignmentsCompletedCount: number;
  skillProgresses: SkillProgress[];
  totalActivityCount: number; // total timestamped training activity events
}

export const milestoneDefinitions: MilestoneDefinition[] = [
  {
    id: "first-topic-completed",
    title: "First Lesson Complete",
    description: "Completed your first Learn topic.",
    category: "learning",
    criteriaDescription: "Complete any 1 Learn topic.",
  },
  {
    id: "first-quiz-passed",
    title: "Knowledge Check Passed",
    description: "Scored 70% or higher on a scenario-based assessment.",
    category: "knowledge",
    criteriaDescription: "Score 70%+ on any quiz.",
  },
  {
    id: "first-investigation-resolved",
    title: "First Investigation Resolved",
    description: "Completed an Advanced Investigation with a solid outcome.",
    category: "practical",
    criteriaDescription: "Score 60 or higher on any Advanced Investigation.",
  },
  {
    id: "first-automation-build",
    title: "First Automation Build",
    description: "Completed a hands-on Automation Lab workflow build.",
    category: "practical",
    criteriaDescription: "Complete any Automation Lab scenario.",
  },
  {
    id: "first-enterprise-project",
    title: "Enterprise Project Delivered",
    description: "Completed a full Enterprise Project capstone build.",
    category: "practical",
    criteriaDescription: "Complete any Enterprise Project in the Automation Lab.",
  },
  {
    id: "first-path-completed",
    title: "Learning Path Complete",
    description: "Completed every topic in a full Learning Path.",
    category: "path",
    criteriaDescription: "Complete 100% of any Learning Path.",
  },
  {
    id: "well-rounded-foundation",
    title: "Well-Rounded Foundation",
    description: "Reached at least a Building Foundation level across every skill area.",
    category: "learning",
    criteriaDescription: "Every skill area reaches 25/100 or higher.",
  },
  {
    id: "strong-foundation-skill",
    title: "Strong Foundation in a Skill",
    description: "Reached the Strong Foundation level in at least one skill area.",
    category: "practical",
    criteriaDescription: "Any single skill area reaches 75/100 or higher.",
  },
  {
    id: "assignment-completed",
    title: "Training Assignment Completed",
    description: "Completed every requirement in an activated Training Assignment.",
    category: "assignment",
    criteriaDescription: "Complete 100% of any Training Assignment's requirements.",
  },
  {
    id: "consistently-engaged",
    title: "Consistently Engaged",
    description: "Logged 10 or more recorded training activities.",
    category: "knowledge",
    criteriaDescription: "Record 10 or more quiz attempts, investigation completions, or Automation Lab builds.",
  },
];

type EligibilityFn = (ctx: MilestoneEvaluationContext) => boolean;

const MILESTONE_ELIGIBILITY: Record<string, EligibilityFn> = {
  "first-topic-completed": (ctx) => ctx.topicsCompletedCount >= 1,
  "first-quiz-passed": (ctx) => ctx.quizzesPassedCount >= 1,
  "first-investigation-resolved": (ctx) => ctx.investigationsResolvedCount >= 1,
  "first-automation-build": (ctx) => ctx.automationBuildsCompletedCount >= 1,
  "first-enterprise-project": (ctx) => ctx.enterpriseProjectsCompletedCount >= 1,
  "first-path-completed": (ctx) => ctx.pathsCompletedCount >= 1,
  "well-rounded-foundation": (ctx) => ctx.skillProgresses.length > 0 && ctx.skillProgresses.every((s) => s.overall >= 25),
  "strong-foundation-skill": (ctx) => ctx.skillProgresses.some((s) => s.overall >= 75),
  "assignment-completed": (ctx) => ctx.assignmentsCompletedCount >= 1,
  "consistently-engaged": (ctx) => ctx.totalActivityCount >= 10,
};

/** Deterministic, derived — reads only the evaluation context built from
 * existing progress data (see lib/milestoneUnlocks.ts's
 * buildMilestoneEvaluationContext). Never a hand-authored per-user flag. */
export function isMilestoneEligible(milestoneId: string, ctx: MilestoneEvaluationContext): boolean {
  return MILESTONE_ELIGIBILITY[milestoneId]?.(ctx) ?? false;
}

export function getEligibleMilestoneIds(ctx: MilestoneEvaluationContext): string[] {
  return milestoneDefinitions.filter((m) => isMilestoneEligible(m.id, ctx)).map((m) => m.id);
}

// ---------------------------------------------------------------------------
// Lightweight validation, mirroring every other content module (Learn,
// Investigations, Quizzes, Skills, Assignments) — fails loudly at build/dev
// load time if a milestone is missing its eligibility rule or duplicated.
// ---------------------------------------------------------------------------
function validateMilestones(): void {
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const m of milestoneDefinitions) {
    if (ids.has(m.id)) errors.push(`Duplicate milestone id: "${m.id}"`);
    ids.add(m.id);
    if (!MILESTONE_ELIGIBILITY[m.id]) errors.push(`Milestone "${m.id}" has no eligibility rule`);
  }
  if (errors.length > 0) {
    throw new Error(`Milestone content validation failed:\n${errors.join("\n")}`);
  }
}

validateMilestones();
