import { AutomationLabCompletionRecord, CvEvidenceItem } from "@/lib/types";
import { automationLabScenarios, getAutomationLabScenarioById } from "@/lib/data/automationLab";

/**
 * Structured CV/portfolio evidence + an interview-ready STAR narrative (Phase
 * 11), derived entirely from a completed Enterprise Project's own static
 * content (already written for the CV prefill flow — see
 * AutomationLabScenario.cvDescription/skillsDemonstrated) plus the learner's
 * actual recorded score. Nothing here is invented: the "result" line is
 * generated from the real score band, never a fabricated outcome. Reuses the
 * existing "Add to CV Tracker" query-param prefill flow rather than building
 * a second CV feature.
 */
export function buildCvEvidenceItems(automationLabCompletions: AutomationLabCompletionRecord[]): CvEvidenceItem[] {
  const projectIds = new Set(automationLabScenarios.filter((s) => s.isEnterpriseProject).map((s) => s.id));

  const items: CvEvidenceItem[] = [];
  for (const completion of automationLabCompletions) {
    if (!projectIds.has(completion.scenarioId)) continue;
    const scenario = getAutomationLabScenarioById(completion.scenarioId);
    if (!scenario) continue;

    const resultText =
      completion.score >= 85
        ? `Delivered a strong, near-complete solution — scored ${completion.score}/100 in training.`
        : completion.score >= 60
          ? `Delivered a working solution with a few gaps identified during review — scored ${completion.score}/100 in training.`
          : `Completed the exercise; several key elements were missing on this attempt — scored ${completion.score}/100 in training.`;

    items.push({
      id: scenario.id,
      title: scenario.title,
      kind: "enterprise-project",
      dateCompleted: completion.completedAt,
      score: completion.score,
      toolsOrSkills: scenario.skillsDemonstrated && scenario.skillsDemonstrated.length > 0 ? scenario.skillsDemonstrated : scenario.toolsInvolved,
      cvWording: scenario.cvDescription ?? scenario.description,
      interviewStory: {
        situation: scenario.scenarioBrief,
        task: scenario.learningObjectives.join(" "),
        action: scenario.modelWorkflowSummary,
        result: resultText,
      },
      addToCvHref: `/cv-tracker?prefillProject=${scenario.id}&attemptScore=${completion.score}`,
    });
  }
  return items;
}
