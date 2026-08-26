import {
  ActionQuality,
  ActionTakenRecord,
  CategoryScore,
  DocumentationFieldId,
  DOCUMENTATION_FIELDS,
  InvestigationProgress,
  InvestigationScenario,
  InvestigationScore,
  PerformanceCategory,
} from "@/lib/types";

/**
 * Generic, scenario-agnostic scoring engine — every scenario just tags its own
 * actions with `stage`/`quality`; the engine turns that into the six weighted
 * categories from CLAUDE.md's Phase 3 spec. This is a training indicator, not a
 * scientifically validated assessment (surfaced explicitly in the UI).
 */
const QUALITY_SCORE: Record<ActionQuality, number> = {
  strong: 100,
  reasonable: 70,
  weak: 35,
  unnecessary: 10,
};

function average(scores: number[], fallback: number): number {
  if (scores.length === 0) return fallback;
  return Math.round(scores.reduce((sum, s) => sum + s, 0) / scores.length);
}

function qualityScores(actions: ActionTakenRecord[]): number[] {
  return actions.map((a) => QUALITY_SCORE[a.quality]);
}

function documentationScore(documentation: Partial<Record<DocumentationFieldId, string>>): number {
  const filled = DOCUMENTATION_FIELDS.filter((f) => (documentation[f.id] ?? "").trim().length >= 15);
  return Math.round((filled.length / DOCUMENTATION_FIELDS.length) * 100);
}

function overallCategoryFor(overall: number): PerformanceCategory {
  if (overall >= 85) return "Excellent";
  if (overall >= 70) return "Strong";
  if (overall >= 50) return "Developing";
  return "Needs Review";
}

export function scoreInvestigation(
  progress: InvestigationProgress,
  scenario: InvestigationScenario,
): InvestigationScore {
  const actions = progress.actionsTaken;

  const infoActions = actions.filter((a) => a.stage === "scope" || a.stage === "evidence");
  const diagnoseActions = actions.filter((a) => a.stage === "diagnose");
  const decisionActions = actions.filter((a) => a.stage === "resolve" || a.stage === "escalate");
  const verifyActions = actions.filter((a) => a.stage === "verify");

  const questionBonus = Math.min(progress.askedQuestionIds.length * 4, 12);
  const infoScore = Math.min(100, average(qualityScores(infoActions), 30) + questionBonus);
  const diagnoseScore = diagnoseActions.length > 0 ? average(qualityScores(diagnoseActions), 40) : average(qualityScores(infoActions), 40);
  const actionQualityScore = average(qualityScores(actions), 30);
  const escalationScore = decisionActions.length > 0 ? average(qualityScores(decisionActions), 50) : 30;
  const verifyScore = verifyActions.length > 0 ? average(qualityScores(verifyActions), 50) : 40;
  const docScore = documentationScore(progress.documentation);

  const categories: CategoryScore[] = [
    { label: "Information Gathering", score: infoScore, weight: 0.25 },
    { label: "Isolation / Diagnosis", score: diagnoseScore, weight: 0.25 },
    { label: "Action Quality", score: actionQualityScore, weight: 0.2 },
    { label: "Escalation", score: escalationScore, weight: 0.1 },
    { label: "Verification", score: verifyScore, weight: 0.1 },
    { label: "Documentation", score: docScore, weight: 0.1 },
  ];

  const overall = Math.round(categories.reduce((sum, c) => sum + c.score * c.weight, 0));
  const overallCategory = overallCategoryFor(overall);

  const strongActions = actions.filter((a) => a.quality === "strong");
  const weakActions = actions.filter((a) => a.quality === "weak" || a.quality === "unnecessary");

  const whatWentWell = buildWhatWentWell(strongActions, progress, scenario);
  const whatCouldImprove = buildWhatCouldImprove(weakActions, verifyActions, progress);

  const outcomeNode = scenario.nodes[progress.currentNodeId];
  const betterReasoningPath = outcomeNode?.outcome?.modelResolution ?? scenario.learningObjectives.join(" ");

  return { categories, overall, overallCategory, whatWentWell, whatCouldImprove, betterReasoningPath };
}

function buildWhatWentWell(
  strongActions: ActionTakenRecord[],
  progress: InvestigationProgress,
  scenario: InvestigationScenario,
): string[] {
  const notes: string[] = [];
  if (progress.askedQuestionIds.length > 0) {
    notes.push(`You asked ${progress.askedQuestionIds.length} diagnostic question${progress.askedQuestionIds.length === 1 ? "" : "s"} before acting — gathering context before touching anything.`);
  }
  const scopeActions = strongActions.filter((a) => a.stage === "scope");
  if (scopeActions.length > 0) {
    notes.push("You confirmed scope (who/how many were affected) early, rather than assuming it from the first report.");
  }
  const evidenceActions = strongActions.filter((a) => a.stage === "evidence" || a.stage === "diagnose");
  if (evidenceActions.length > 0) {
    notes.push(`You made ${evidenceActions.length} strong evidence-gathering move${evidenceActions.length === 1 ? "" : "s"} instead of jumping straight to a fix.`);
  }
  const decisionActions = strongActions.filter((a) => a.stage === "resolve" || a.stage === "escalate");
  if (decisionActions.length > 0) {
    notes.push("Your final resolve/escalate decision was backed by the specific evidence you'd gathered, not a guess.");
  }
  if (strongActions.some((a) => a.stage === "verify")) {
    notes.push("You verified the fix actually worked for the people who reported it, rather than assuming a change was enough.");
  }
  if (notes.length === 0) {
    notes.push(`You completed the investigation through to a ${scenario.title.toLowerCase().includes("endpoint") ? "resolution" : "decision"} — review the reasoning path below for a stronger route through this scenario.`);
  }
  return notes.slice(0, 4);
}

function buildWhatCouldImprove(
  weakActions: ActionTakenRecord[],
  verifyActions: ActionTakenRecord[],
  progress: InvestigationProgress,
): string[] {
  const notes: string[] = [];
  const weakCount = weakActions.length;
  if (weakCount > 0) {
    notes.push(`You chose ${weakCount} weak or unnecessary action${weakCount === 1 ? "" : "s"} along the way — see the feedback shown at the time for why each one fell short.`);
  }
  if (verifyActions.length === 0) {
    notes.push("You didn't take a dedicated verification step before finishing — confirming a fix actually worked is what separates \"a change was made\" from \"the problem is resolved.\"");
  }
  if (progress.askedQuestionIds.length === 0) {
    notes.push("You didn't ask any of the available diagnostic questions — they're free evidence and cost nothing to check.");
  }
  const docFilled = DOCUMENTATION_FIELDS.filter((f) => (progress.documentation[f.id] ?? "").trim().length >= 15).length;
  if (docFilled < DOCUMENTATION_FIELDS.length) {
    notes.push(`Your resolution documentation had ${docFilled}/${DOCUMENTATION_FIELDS.length} fields filled in with real detail — thorough documentation is what makes an incident useful for the next person.`);
  }
  if (notes.length === 0) {
    notes.push("Strong run — no significant gaps stood out; compare your path against \"Better reasoning path\" below out of curiosity.");
  }
  return notes.slice(0, 4);
}
