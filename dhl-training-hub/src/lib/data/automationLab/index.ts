import { AutomationLabScenario, LearningCategory, TeamId } from "@/lib/types";
import { learningTopics } from "@/lib/data/learning";
import { filterAndSaveAttachmentScenario } from "./filterAndSaveAttachment";
import { simpleApprovalFlowScenario } from "./simpleApprovalFlow";
import { supplierDailyReportAutomationScenario } from "./supplierDailyReportAutomation";
import { employeeOnboardingWorkflowScenario } from "./employeeOnboardingWorkflow";
import { itTicketEscalationScenario } from "./itTicketEscalation";
import { invoiceProcessingScenario } from "./invoiceProcessing";
import { assetInventoryDashboardScenario } from "./assetInventoryDashboard";

// Automation Lab (Enterprise Automation track) — block-assembly workflow scenarios,
// sitting alongside Advanced Investigations. Kept as flat, typed local data, same
// architecture as every other content module — see root CLAUDE.md and
// lib/types.ts's Automation Lab section for the full rationale. Practice scenarios
// (isEnterpriseProject: false) come first, then the five Enterprise Project capstones.
export const automationLabScenarios: AutomationLabScenario[] = [
  filterAndSaveAttachmentScenario,
  simpleApprovalFlowScenario,
  supplierDailyReportAutomationScenario,
  employeeOnboardingWorkflowScenario,
  itTicketEscalationScenario,
  invoiceProcessingScenario,
  assetInventoryDashboardScenario,
];

export function getAutomationLabScenarioById(id: string): AutomationLabScenario | undefined {
  return automationLabScenarios.find((s) => s.id === id);
}

export function getPracticeAutomationLabScenarios(): AutomationLabScenario[] {
  return automationLabScenarios.filter((s) => !s.isEnterpriseProject);
}

export function getEnterpriseProjectScenarios(): AutomationLabScenario[] {
  return automationLabScenarios.filter((s) => s.isEnterpriseProject);
}

/** Mirrors getScenariosForTeam in lib/data/investigations/index.ts. */
export function getAutomationLabScenariosForTeam(teamId: TeamId, limit = 4): AutomationLabScenario[] {
  return automationLabScenarios.filter((s) => s.likelyTeams.includes(teamId)).slice(0, limit);
}

/** Mirrors getScenariosForTopic in lib/data/investigations/index.ts. */
export function getAutomationLabScenariosForTopic(topicId: string, limit = 3): AutomationLabScenario[] {
  return automationLabScenarios.filter((s) => s.relatedTopicIds.includes(topicId)).slice(0, limit);
}

/** Used by lib/data/skills.ts's getAutomationLabScenariosForSkill — every scenario
 * relevant to a Learn category, derived from relatedTopicIds, same pattern as
 * getInvestigationsForSkill. */
export function getAutomationLabScenariosForCategory(category: LearningCategory): AutomationLabScenario[] {
  const categoryTopicIds = new Set(learningTopics.filter((t) => t.category === category).map((t) => t.id));
  return automationLabScenarios.filter((s) => s.relatedTopicIds.some((id) => categoryTopicIds.has(id)));
}

// ---------------------------------------------------------------------------
// Lightweight content validation, mirroring lib/data/investigations/index.ts's
// validateInvestigations(). Runs at module load and throws on internally
// inconsistent scenario data.
// ---------------------------------------------------------------------------
function validateAutomationLab(): void {
  const errors: string[] = [];
  const scenarioIds = new Set<string>();
  const topicIds = new Set(learningTopics.map((t) => t.id));

  for (const scenario of automationLabScenarios) {
    if (scenarioIds.has(scenario.id)) errors.push(`Duplicate automation lab scenario id: "${scenario.id}"`);
    scenarioIds.add(scenario.id);
  }

  for (const scenario of automationLabScenarios) {
    if (scenario.blocks.length === 0) {
      errors.push(`Scenario "${scenario.id}" has no blocks`);
    }

    const blockIds = new Set<string>();
    for (const block of scenario.blocks) {
      if (blockIds.has(block.id)) errors.push(`Scenario "${scenario.id}" has duplicate block id "${block.id}"`);
      blockIds.add(block.id);

      if (block.role === "distractor" && block.idealPosition !== undefined) {
        errors.push(`Scenario "${scenario.id}" block "${block.id}" is a distractor but has an idealPosition set`);
      }
      if (block.role !== "distractor" && block.idealPosition === undefined) {
        errors.push(`Scenario "${scenario.id}" block "${block.id}" has role "${block.role}" but no idealPosition set`);
      }
    }

    const essentialAndRecommended = scenario.blocks.filter((b) => b.role !== "distractor");
    if (essentialAndRecommended.length === 0) {
      errors.push(`Scenario "${scenario.id}" has no essential/recommended blocks — nothing to grade against`);
    }
    // Filters out undefined rather than asserting non-null — a block missing
    // idealPosition was already reported above; this just avoids also
    // corrupting the contiguity check below with a NaN comparison.
    const positions = essentialAndRecommended
      .map((b) => b.idealPosition)
      .filter((p): p is number => p !== undefined)
      .sort((a, b) => a - b);
    for (let i = 0; i < positions.length; i++) {
      if (positions[i] !== i + 1) {
        errors.push(`Scenario "${scenario.id}" idealPosition values aren't a contiguous 1..n sequence (got: ${positions.join(", ")})`);
        break;
      }
    }

    if (!scenario.blocks.some((b) => b.category === "trigger" && b.role === "essential")) {
      errors.push(`Scenario "${scenario.id}" has no essential trigger block`);
    }
    if (!scenario.blocks.some((b) => b.category === "action" && b.role === "essential")) {
      errors.push(`Scenario "${scenario.id}" has no essential action block`);
    }

    if (scenario.isEnterpriseProject && (!scenario.cvDescription || !scenario.skillsDemonstrated || scenario.skillsDemonstrated.length === 0)) {
      errors.push(`Scenario "${scenario.id}" is an Enterprise Project but is missing cvDescription/skillsDemonstrated`);
    }

    for (const topicId of scenario.relatedTopicIds) {
      if (!topicIds.has(topicId)) {
        errors.push(`Scenario "${scenario.id}" references unknown learning topic id "${topicId}"`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Automation Lab content validation failed:\n${errors.join("\n")}`);
  }
}

validateAutomationLab();
