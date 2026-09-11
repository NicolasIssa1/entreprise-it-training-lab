import type { TutorMode } from "../types.ts";

/**
 * Pure decision logic for Phase 14's new Tutor modes — deterministic rules
 * the AI must be TOLD to follow (skill picking, quiz-me difficulty stepping,
 * the interview rubric), never left for the model to invent. This keeps the
 * "AI explains/reinforces the deterministic engine, never secretly replaces
 * it" boundary testable in isolation from the AI call itself.
 *
 * Deliberately zero `@/`-aliased imports (same testability pattern as
 * entitlementRules.ts/adminKpiRules.ts) so this runs under plain
 * `node --test`. The strength/gap thresholds below are duplicated from
 * lib/readiness.ts's classifySkillGap rather than imported from it — same
 * "small, explicitly-commented duplication for testability" trade-off
 * lib/data/admin/demoGeneratorMath.ts already makes for
 * investigationScoring.ts's bands. Keep the two in sync if either changes.
 */

interface SkillLikeProgress {
  skill: { id: string };
  overall: number;
  evidence: {
    learning: { completed: number };
    knowledge: { attempted: number };
    practical: { completed: number };
  };
}

const STRENGTH_THRESHOLD = 65;
const GAP_THRESHOLD = 25;

/** Strongest skills by score, capped — used to compose the compact
 * learner-context summary sent to the Tutor (never the full 9-skill
 * breakdown). */
export function pickStrongestSkillIds(skillProgresses: SkillLikeProgress[], limit = 2): string[] {
  return skillProgresses
    .filter((s) => s.overall >= STRENGTH_THRESHOLD)
    .sort((a, b) => b.overall - a.overall)
    .slice(0, limit)
    .map((s) => s.skill.id);
}

/** Weakest skills, capped, and only among skills with at least some recorded
 * evidence — a skill nobody has touched yet is "not started," not a
 * weakness worth flagging. */
export function pickWeakestSkillIds(skillProgresses: SkillLikeProgress[], limit = 2): string[] {
  return skillProgresses
    .filter((s) => s.overall <= GAP_THRESHOLD)
    .filter((s) => s.evidence.learning.completed > 0 || s.evidence.knowledge.attempted > 0 || s.evidence.practical.completed > 0)
    .sort((a, b) => a.overall - b.overall)
    .slice(0, limit)
    .map((s) => s.skill.id);
}

// ---------------------------------------------------------------------------
// Quiz Me — adaptive difficulty. The model is instructed (see tutorPrompt.ts)
// to pick its next question at the returned difficulty band; the actual
// stepping rule lives here, not left to the model to decide inconsistently.
// ---------------------------------------------------------------------------
export const QUIZ_ME_DIFFICULTIES = ["foundation", "intermediate", "challenging"] as const;
export type QuizMeDifficulty = (typeof QUIZ_ME_DIFFICULTIES)[number];

/** Steps up after 2 consecutive correct answers, steps down immediately on a
 * miss, otherwise holds — a simple, explainable adaptive rule (not an ML
 * model), consistent with this app's "deterministic, explainable" ethos. */
export function nextQuizMeDifficulty(current: QuizMeDifficulty, wasCorrect: boolean, correctStreak: number): QuizMeDifficulty {
  const index = QUIZ_ME_DIFFICULTIES.indexOf(current);
  if (!wasCorrect) return QUIZ_ME_DIFFICULTIES[Math.max(0, index - 1)];
  if (correctStreak >= 2) return QUIZ_ME_DIFFICULTIES[Math.min(QUIZ_ME_DIFFICULTIES.length - 1, index + 1)];
  return current;
}

// ---------------------------------------------------------------------------
// Interview — a transparent, fixed rubric. Never a hiring probability/score
// out of a fabricated total — each dimension gets one of 3 grounded labels.
// ---------------------------------------------------------------------------
export const INTERVIEW_RUBRIC_DIMENSIONS = ["Technical Understanding", "Problem-Solving Approach", "Communication Clarity", "Practical Awareness"] as const;
export type InterviewRubricDimension = (typeof INTERVIEW_RUBRIC_DIMENSIONS)[number];

export const INTERVIEW_RUBRIC_RATINGS = ["Needs Development", "Adequate", "Strong"] as const;
export type InterviewRubricRating = (typeof INTERVIEW_RUBRIC_RATINGS)[number];

// ---------------------------------------------------------------------------
// Mode instructions — the exact behavioral rule sent to the model for each
// TutorMode. Pure (a switch over string literals, no dependencies) so the
// non-disclosure/scope rules for every mode are directly testable — e.g.
// "coach-family modes never reveal the answer outright" is asserted in
// coachingRules.test.ts rather than only discoverable by manually chatting
// with the model. Used by lib/ai/tutorPrompt.ts's buildSystemBlocks().
// ---------------------------------------------------------------------------
export function modeInstructions(mode: TutorMode): string {
  switch (mode) {
    case "tutor":
      return "Mode: General tutor. Answer freely within the rules above.";
    case "topic-tutor":
      return "Mode: Topic tutor. The learner is reading a specific Learn topic (the first one in CURRICULUM CONTEXT below) — ground your answer in it first before adding anything else.";
    case "quiz-coach":
      return "Mode: Quiz coach — an assessment is IN PROGRESS and not yet submitted. Do not reveal or hint at which option is correct. Explain the underlying concept, give a different example, or ask a guiding question instead.";
    case "quiz-review":
      return "Mode: Quiz review — the assessment has already been submitted. You may fully explain why the learner's answer was right or wrong, using the QUIZ REVIEW CONTEXT below.";
    case "investigation-coach":
      return "Mode: Investigation coach — a scenario is IN PROGRESS. Do not reveal the hidden root cause, the best next action, or the outcome. Ask guiding questions about what evidence would help distinguish between possibilities, based on CURRENT INVESTIGATION STATUS below.";
    case "investigation-review":
      return "Mode: Investigation review — the scenario is completed. You may fully discuss the reasoning path, mistakes, and alternative actions, using INVESTIGATION REVIEW CONTEXT below.";
    case "progress-coach":
      return "Mode: Progress coach. Explain the learner's PROGRESS SUMMARY and the deterministic recommendations already generated by this application below — you are explaining and encouraging, not generating new recommendations or overriding the app's own engine.";
    case "automation-coach":
      return "Mode: Automation Lab coach — the learner is IN PROGRESS building a workflow out of trigger/action/condition/logic blocks and hasn't submitted yet. Do not reveal which blocks are correct, missing, or distractors, or describe the model solution. Ask guiding questions (e.g. \"what should happen before that step?\", \"how would you avoid processing the same item twice?\") using AUTOMATION LAB SCENARIO below.";
    case "automation-review":
      return "Mode: Automation Lab review — the learner has already submitted an attempt. You may fully discuss what was correct, what was missing, any distractors they included, and the model workflow, using AUTOMATION LAB REVIEW CONTEXT below.";
    case "coach":
      return "Mode: Coach. The learner wants to be guided through a concept or problem, not handed the final answer immediately. Ask guiding questions, offer one step at a time, and only give the direct answer if they explicitly ask you to just explain it or they're clearly stuck after a couple of guided attempts.";
    case "quiz-me":
      return "Mode: Quiz Me — an adaptive, conversational knowledge check, NOT the app's real quiz/assessment system. Ask exactly one question at a time, grounded in CURRICULUM CONTEXT and (if given) the requested skill area in SESSION PARAMETERS below. Wait for the learner's answer before revealing whether it was correct, then briefly explain why. Adapt difficulty as you go, starting at foundation level: step up one band (foundation -> intermediate -> challenging) only after two consecutive correct answers, step down one band immediately after a miss, otherwise hold steady — infer this from the conversation so far, never ask the learner to self-report it. This is a conversational practice session only and never changes the app's own recorded quiz scores — say so if asked. When the learner says they're done (or after a natural stopping point), give a short summary: strengths shown this session, gaps shown this session, and 1-2 concrete things to study next — grounded only in what actually came up, never fabricated.";
    case "troubleshoot":
      return "Mode: Troubleshoot. Run a realistic but entirely FICTIONAL enterprise IT troubleshooting scenario in the category given in SESSION PARAMETERS below — invent a plausible fictional company/system, never a real one, and never reuse any real company's actual name/branding. Open with a short, realistic initial report (like a ticket description), then let the learner drive the investigation: reveal logs, evidence, or details ONLY in response to what they actually ask or check — never dump the full picture up front, and never punish a reasonable investigative question. Once they reach a diagnosis, ask them to state it and their proposed remediation before confirming whether it's right, and explain why. Keep it strictly defensive/investigative — no exploit or offensive-security content, matching the rest of this app's Security Fundamentals scope.";
    case "project-mentor":
      return "Mode: Project Mentor. Help the learner plan or review a practical/Automation Lab project. Ask probing questions about their design before offering solutions, help them notice missing considerations (error handling, duplicate protection, edge cases, security/permissions), and explain any errors in their reasoning. Do not just build the solution for them — calibrate how much you reveal using the PROJECT MENTOR HINT LEVEL in SESSION PARAMETERS below (1 = a nudge/question only, 2 = a stronger hint pointing at the specific gap, 3 = a fuller explanation) — never skip straight to level 3 unless the learner is at hint level 3 or has asked you directly to just explain it.";
    case "interview":
      return "Mode: Interview. Conduct a realistic mock interview for the category in SESSION PARAMETERS below, calibrated to what the learner has actually studied/built (see PROGRESS SUMMARY). Ask exactly one question at a time; you may ask a natural follow-up before moving on. After each answer, give brief, constructive feedback. When the interview naturally concludes (or the learner asks to stop), give a final summary rated against the INTERVIEW RUBRIC below — one of the three ratings per dimension, with a one-line reason each. Never state or imply a hiring probability, a numeric score out of some total, or whether they'd \"pass\" a real interview — this is skills-feedback practice, not a hiring decision.";
    case "review":
      return "Mode: Review. The learner wants their reasoning, an answer, or a piece of project thinking reviewed against the relevant platform competency (see PROGRESS SUMMARY for their current skill levels). Assess what they present on its own merits, connect it explicitly to the relevant skill area, and be specific about what's strong and what to improve — never a generic \"good job.\"";
  }
}
