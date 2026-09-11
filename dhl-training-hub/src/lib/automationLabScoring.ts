import {
  AutomationBlock,
  AutomationLabCategoryScore,
  AutomationLabScenario,
  AutomationLabScore,
  PerformanceCategory,
} from "@/lib/types";

/**
 * Generic, scenario-agnostic scoring engine for the Automation Lab — mirrors
 * lib/investigationScoring.ts's philosophy exactly: every scenario just tags its
 * own blocks (`role`, `idealPosition`); this engine only ever reads those tags,
 * never a hand-written per-scenario answer key. A training indicator, not a
 * scientifically validated assessment (surfaced explicitly in the UI).
 */
function overallCategoryFor(overall: number): PerformanceCategory {
  if (overall >= 85) return "Excellent";
  if (overall >= 70) return "Strong";
  if (overall >= 50) return "Developing";
  return "Needs Review";
}

/** Fraction (0-100) of blocks in `pool` that are present in `submittedIds`. */
function coverageScore(pool: AutomationBlock[], submittedIds: Set<string>): number {
  if (pool.length === 0) return 100;
  const present = pool.filter((b) => submittedIds.has(b.id)).length;
  return Math.round((present / pool.length) * 100);
}

export function scoreAutomationLab(scenario: AutomationLabScenario, submittedBlockIds: string[]): AutomationLabScore {
  const submitted = new Set(submittedBlockIds);
  const essential = scenario.blocks.filter((b) => b.role === "essential");
  const recommended = scenario.blocks.filter((b) => b.role === "recommended");
  const distractors = scenario.blocks.filter((b) => b.role === "distractor");

  const triggers = essential.filter((b) => b.category === "trigger");
  const conditions = essential.filter((b) => b.category === "condition");
  const actions = essential.filter((b) => b.category === "action");

  // Trigger correctness: the right trigger present, and appearing first in the
  // learner's submitted sequence (a trigger anywhere else in the order is a real
  // mistake — nothing else can run before something starts the flow).
  const triggerPresentScore = coverageScore(triggers, submitted);
  const firstSubmittedId = submittedBlockIds[0];
  const firstIsCorrectTrigger = triggers.length === 0 || (firstSubmittedId !== undefined && triggers.some((t) => t.id === firstSubmittedId));
  const triggerScore = triggers.length === 0 ? 100 : Math.round(triggerPresentScore * (firstIsCorrectTrigger ? 1 : 0.6));

  // Filtering/condition logic and core actions are straightforward coverage of
  // the essential blocks in each category.
  const conditionScore = coverageScore(conditions, submitted);
  const actionScore = coverageScore(actions, submitted);

  // Sequencing: for every pair of essential blocks the learner included, did they
  // appear in an order consistent with their idealPosition? Pairwise, not exact
  // position — a reasonable reordering that still respects real dependencies
  // shouldn't be penalized as heavily as a genuinely backwards sequence.
  const includedEssential = essential.filter((b) => submitted.has(b.id));
  const submittedIndex = new Map(submittedBlockIds.map((id, i) => [id, i]));
  let pairs = 0;
  let correctPairs = 0;
  for (let i = 0; i < includedEssential.length; i++) {
    for (let j = i + 1; j < includedEssential.length; j++) {
      const a = includedEssential[i];
      const b = includedEssential[j];
      if (a.idealPosition === undefined || b.idealPosition === undefined || a.idealPosition === b.idealPosition) continue;
      pairs++;
      const idealOrderCorrect = a.idealPosition < b.idealPosition;
      const actualOrderCorrect = (submittedIndex.get(a.id) ?? 0) < (submittedIndex.get(b.id) ?? 0);
      if (idealOrderCorrect === actualOrderCorrect) correctPairs++;
    }
  }
  const sequencingScore = pairs === 0 ? 100 : Math.round((correctPairs / pairs) * 100);

  // Resilience: recommended logic blocks (duplicate protection, error handling,
  // etc.) present.
  const resilienceScore = coverageScore(recommended, submitted);

  // Precision: penalized per included distractor, floor at 0.
  const includedDistractors = distractors.filter((d) => submitted.has(d.id));
  const precisionScore = distractors.length === 0 ? 100 : Math.max(0, 100 - includedDistractors.length * Math.ceil(100 / Math.max(distractors.length, 3)));

  const categories: AutomationLabCategoryScore[] = [
    { label: "Trigger correctness", score: triggerScore, weight: 0.1 },
    { label: "Filtering / condition logic", score: conditionScore, weight: 0.2 },
    { label: "Core actions present", score: actionScore, weight: 0.25 },
    { label: "Sequencing", score: sequencingScore, weight: 0.15 },
    { label: "Resilience (duplicate protection & error handling)", score: resilienceScore, weight: 0.15 },
    { label: "Precision (avoiding distractors)", score: precisionScore, weight: 0.15 },
  ];

  const overall = Math.round(categories.reduce((sum, c) => sum + c.score * c.weight, 0));

  const correct = scenario.blocks.filter((b) => b.role !== "distractor" && submitted.has(b.id));
  const missing = scenario.blocks.filter((b) => b.role !== "distractor" && !submitted.has(b.id));
  const incorrectlyIncluded = includedDistractors;

  const orderingNotes: string[] = [];
  if (!firstIsCorrectTrigger && triggers.length > 0) {
    orderingNotes.push("Your workflow's trigger wasn't the first block — nothing else in a flow can run before something starts it.");
  }
  if (pairs > 0 && correctPairs < pairs) {
    orderingNotes.push("Some of your blocks were in a different order than the model solution expects — double-check what needs to happen before what.");
  }
  if (orderingNotes.length === 0) {
    orderingNotes.push("Your block order matched the expected sequence well.");
  }

  const modelOrder = [...essential, ...recommended]
    .filter((b) => b.idealPosition !== undefined)
    .sort((a, b) => (a.idealPosition ?? 0) - (b.idealPosition ?? 0));

  return {
    categories,
    overall,
    overallCategory: overallCategoryFor(overall),
    correct,
    missing,
    incorrectlyIncluded,
    orderingNotes,
    modelOrder,
  };
}
