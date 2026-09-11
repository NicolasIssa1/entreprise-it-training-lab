import { AdminLearnerRecord, AutomationLabAttempt, AutomationLabScore, InvestigationCompletionRecord, QuizAttempt } from "@/lib/types";
import { learningPaths, getPathById } from "@/lib/data/learning";
import { quizzes, getQuizById } from "@/lib/data/quizzes";
import { investigationScenarios, getScenarioById } from "@/lib/data/investigations";
import { automationLabScenarios, getAutomationLabScenarioById } from "@/lib/data/automationLab";
import { getAssignmentById } from "@/lib/data/assignments";
import { getAutomationLabCompletions } from "@/lib/automationLabProgress";
import { DemoLearnerSeed, EngagementProfile, demoLearnerSeeds } from "@/lib/data/admin/demoLearners";
import { mulberry32, hashSeed, pickInt, pickScore, categoryForScore, correctCountForPercentage } from "@/lib/data/admin/demoGeneratorMath";

interface EngagementConfig {
  topicRatioPercent: [number, number];
  quizScoreRange: [number, number];
  quizAttemptRatio: [number, number]; // fraction (0-1) of relevant quizzes attempted
  investigationCount: [number, number];
  investigationScoreRange: [number, number];
  automationCount: [number, number];
  automationScoreRange: [number, number];
  activityWindowDaysAgo: [number, number];
  extraStruggleRetries: boolean;
}

const ENGAGEMENT_CONFIG: Record<EngagementProfile, EngagementConfig> = {
  strong: {
    topicRatioPercent: [65, 90],
    quizScoreRange: [80, 96],
    quizAttemptRatio: [0.8, 1],
    investigationCount: [2, 4],
    investigationScoreRange: [70, 95],
    automationCount: [2, 4],
    automationScoreRange: [75, 95],
    activityWindowDaysAgo: [1, 20],
    extraStruggleRetries: false,
  },
  average: {
    topicRatioPercent: [40, 65],
    quizScoreRange: [58, 76],
    quizAttemptRatio: [0.5, 0.8],
    investigationCount: [1, 2],
    investigationScoreRange: [55, 75],
    automationCount: [1, 2],
    automationScoreRange: [55, 75],
    activityWindowDaysAgo: [3, 30],
    extraStruggleRetries: false,
  },
  struggling: {
    topicRatioPercent: [18, 38],
    quizScoreRange: [30, 52],
    quizAttemptRatio: [0.4, 0.7],
    investigationCount: [0, 1],
    investigationScoreRange: [25, 48],
    automationCount: [0, 1],
    automationScoreRange: [25, 48],
    activityWindowDaysAgo: [5, 35],
    extraStruggleRetries: true,
  },
  inactive: {
    topicRatioPercent: [8, 22],
    quizScoreRange: [30, 55],
    quizAttemptRatio: [0.15, 0.35],
    investigationCount: [0, 1],
    investigationScoreRange: [30, 55],
    automationCount: [0, 1],
    automationScoreRange: [30, 55],
    activityWindowDaysAgo: [25, 75],
    extraStruggleRetries: false,
  },
  new: {
    topicRatioPercent: [0, 10],
    quizScoreRange: [50, 70],
    quizAttemptRatio: [0, 0.15],
    investigationCount: [0, 0],
    investigationScoreRange: [50, 70],
    automationCount: [0, 0],
    automationScoreRange: [50, 70],
    activityWindowDaysAgo: [0, 6],
    extraStruggleRetries: false,
  },
};

function daysAgoToIso(now: Date, daysAgo: number): string {
  return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
}

/** A minimal, structurally-valid AutomationLabScore for fictional demo
 * learners — the Enterprise Admin area only ever shows the aggregate
 * `overall` figure for a demo learner's automation builds, never the
 * block-by-block breakdown (that level of detail only makes sense for the
 * real signed-in learner reviewing their own attempt), so the
 * category/correct/missing arrays are deliberately left empty rather than
 * fabricating fictional block-level detail nobody will read. */
function fabricateAutomationScore(overall: number): AutomationLabScore {
  return {
    categories: [{ label: "Overall", score: overall, weight: 1 }],
    overall,
    overallCategory: categoryForScore(overall),
    correct: [],
    missing: [],
    incorrectlyIncluded: [],
    orderingNotes: [],
    modelOrder: [],
  };
}

function buildQuizAttempt(quizId: string, totalQuestions: number, percentage: number, learnerId: string, index: number, completedAt: string, questions: { id: string; correctOptionIds: string[]; options: { id: string }[] }[]): QuizAttempt {
  const correctCount = correctCountForPercentage(totalQuestions, percentage);
  const answers = questions.map((q, i) => {
    const correct = i < correctCount;
    const wrongOptionId = q.options.find((o) => !q.correctOptionIds.includes(o.id))?.id ?? q.options[0]?.id ?? "";
    return { questionId: q.id, selectedOptionIds: correct ? q.correctOptionIds : [wrongOptionId], correct };
  });
  return { attemptId: `${learnerId}-quiz-${quizId}-${index}`, quizId, completedAt, correctCount, totalQuestions, percentage, answers };
}

/**
 * Deterministically expands one fictional roster entry into a full
 * AdminLearnerRecord — every derived number the Enterprise Admin area shows
 * for this learner is then computed from this generated evidence by the
 * SAME real engines (calculateAllSkillProgress, computeAssignmentProgress,
 * etc.) every other page in the app already uses. See demoLearners.ts's
 * header comment for the "never a fabricated aggregate" reasoning.
 */
export function expandDemoLearner(seed: DemoLearnerSeed, now: Date): AdminLearnerRecord {
  const rng = mulberry32(hashSeed(seed.id));
  const cfg = ENGAGEMENT_CONFIG[seed.engagement];
  const programme = seed.programmeId ? getAssignmentById(seed.programmeId) : undefined;

  const paths = (programme ? programme.requiredPathIds.map(getPathById) : [learningPaths[0]]).filter((p): p is NonNullable<typeof p> => !!p);
  const topicIds = [...new Set(paths.flatMap((p) => p.topicIds))];
  const topicRatio = pickInt(rng, cfg.topicRatioPercent) / 100;
  const completeCount = Math.round(topicRatio * topicIds.length);
  const completedTopics: Record<string, boolean> = {};
  for (const id of topicIds.slice(0, completeCount)) completedTopics[id] = true;

  const daysAgoSeen: number[] = [];

  // --- Quizzes ---
  const quizIdPool = programme && programme.requiredQuizIds.length > 0 ? programme.requiredQuizIds : quizzes.slice(0, 2).map((q) => q.id);
  const attemptCount = Math.min(quizIdPool.length, Math.round(pickInt(rng, [Math.round(cfg.quizAttemptRatio[0] * 100), Math.round(cfg.quizAttemptRatio[1] * 100)]) / 100 * quizIdPool.length));
  const quizAttemptsMap: Record<string, QuizAttempt[]> = {};
  for (let i = 0; i < attemptCount; i++) {
    const quiz = getQuizById(quizIdPool[i]);
    if (!quiz) continue;
    const attempts: QuizAttempt[] = [];
    const retries = cfg.extraStruggleRetries && i === 0 ? 2 : 1;
    for (let r = 0; r < retries; r++) {
      const pct = pickScore(rng, cfg.quizScoreRange);
      const daysAgo = pickInt(rng, cfg.activityWindowDaysAgo);
      daysAgoSeen.push(daysAgo);
      attempts.push(buildQuizAttempt(quiz.id, quiz.questions.length, pct, seed.id, r, daysAgoToIso(now, daysAgo), quiz.questions));
    }
    quizAttemptsMap[quiz.id] = attempts;
  }

  // --- Advanced Investigations ---
  const investigationCandidates = (programme?.requiredScenarioIds ?? []).filter((id) => getScenarioById(id));
  const investigationPool = investigationCandidates.length > 0 ? investigationCandidates : investigationScenarios.slice(0, 2).map((s) => s.id);
  const investigationCount = Math.min(pickInt(rng, cfg.investigationCount), investigationPool.length);
  const investigationCompletions: InvestigationCompletionRecord[] = [];
  for (let i = 0; i < investigationCount; i++) {
    const scenario = getScenarioById(investigationPool[i]);
    if (!scenario) continue;
    const score = pickScore(rng, cfg.investigationScoreRange);
    const daysAgo = pickInt(rng, cfg.activityWindowDaysAgo);
    daysAgoSeen.push(daysAgo);
    investigationCompletions.push({ scenarioId: scenario.id, completedAt: daysAgoToIso(now, daysAgo), score, resultCategory: categoryForScore(score) });
  }

  // --- Automation Lab ---
  const automationCandidates = (programme?.requiredScenarioIds ?? []).filter((id) => getAutomationLabScenarioById(id));
  const automationPool = automationCandidates.length > 0 ? automationCandidates : automationLabScenarios.slice(0, 2).map((s) => s.id);
  const automationCount = Math.min(pickInt(rng, cfg.automationCount), automationPool.length);
  const automationLabAttemptsMap: Record<string, AutomationLabAttempt[]> = {};
  for (let i = 0; i < automationCount; i++) {
    const scenario = getAutomationLabScenarioById(automationPool[i]);
    if (!scenario) continue;
    const overall = pickScore(rng, cfg.automationScoreRange);
    const daysAgo = pickInt(rng, cfg.activityWindowDaysAgo);
    daysAgoSeen.push(daysAgo);
    automationLabAttemptsMap[scenario.id] = [
      {
        attemptId: `${seed.id}-automation-${scenario.id}`,
        scenarioId: scenario.id,
        completedAt: daysAgoToIso(now, daysAgo),
        submittedBlockIds: [],
        score: fabricateAutomationScore(overall),
      },
    ];
  }

  const lastActivityAt = daysAgoSeen.length > 0 ? daysAgoToIso(now, Math.min(...daysAgoSeen)) : null;

  return {
    id: seed.id,
    name: seed.name,
    isYou: false,
    cohortIds: seed.cohortIds,
    programmeId: seed.programmeId,
    joinedDate: daysAgoToIso(now, seed.joinedDaysAgo),
    completedTopics,
    quizAttemptsMap,
    investigationCompletions,
    automationLabCompletions: getAutomationLabCompletions(automationLabAttemptsMap),
    automationLabAttemptsMap,
    lastActivityAt,
  };
}

export function generateDemoRoster(now: Date = new Date()): AdminLearnerRecord[] {
  return demoLearnerSeeds.map((seed) => expandDemoLearner(seed, now));
}
