import { InvestigationScenario, TeamId } from "@/lib/types";
import { learningTopics, learningPaths } from "@/lib/data/learning";
import { dnsResolutionScenario } from "./dnsResolution";
import { applicationPerformanceScenario } from "./applicationPerformance";
import { vpnConnectivityScenario } from "./vpnConnectivity";
import { authVsAuthorizationScenario } from "./authVsAuthorization";
import { systemIntegrationFailureScenario } from "./systemIntegrationFailure";
import { sharedStorageOutageScenario } from "./sharedStorageOutage";
import { deploymentRegressionScenario } from "./deploymentRegression";
import { endpointSecurityIncidentScenario } from "./endpointSecurityIncident";
import { shipmentVisibilityOutageScenario } from "./shipmentVisibilityOutage";
import { customsDocumentationDelayScenario } from "./customsDocumentationDelay";

// Advanced Investigations (Phase 3) — branching, evolving-evidence scenarios that
// sit alongside the fixed-scenario Quick Practice tickets (lib/data/tickets.ts).
// Kept as flat, typed local data, same architecture as the Learn library, so it
// could move to a CMS/backend later without the UI changing. All content is
// fictional generic enterprise IT training material — see root CLAUDE.md.
export const investigationScenarios: InvestigationScenario[] = [
  dnsResolutionScenario,
  applicationPerformanceScenario,
  vpnConnectivityScenario,
  authVsAuthorizationScenario,
  systemIntegrationFailureScenario,
  sharedStorageOutageScenario,
  deploymentRegressionScenario,
  endpointSecurityIncidentScenario,
  shipmentVisibilityOutageScenario,
  customsDocumentationDelayScenario,
];

export function getScenarioById(id: string): InvestigationScenario | undefined {
  return investigationScenarios.find((s) => s.id === id);
}

/**
 * Scenarios relevant to a team's "Advanced Practice" section — derived from each
 * scenario's own likelyTeams (single source of truth), same pattern as
 * getTicketsForTeam in lib/data/tickets.ts.
 */
export function getScenariosForTeam(teamId: TeamId, limit = 4): InvestigationScenario[] {
  return investigationScenarios.filter((s) => s.likelyTeams.includes(teamId)).slice(0, limit);
}

/**
 * Scenarios relevant to a Learn topic's "Advanced Practice" section — derived from
 * each scenario's own relatedTopicIds (single source of truth), same pattern as
 * getTicketsForTopic in lib/data/tickets.ts.
 */
export function getScenariosForTopic(topicId: string, limit = 3): InvestigationScenario[] {
  return investigationScenarios.filter((s) => s.relatedTopicIds.includes(topicId)).slice(0, limit);
}

/**
 * Scenarios relevant to a Learning Path — derived from whether a scenario's own
 * relatedTopicIds overlap with the path's topicIds, rather than a second
 * hand-maintained path->scenario list. Used by the Learn Path cards.
 */
export function getScenariosForPath(pathId: string, limit = 3): InvestigationScenario[] {
  const path = learningPaths.find((p) => p.id === pathId);
  if (!path) return [];
  const pathTopicIds = new Set(path.topicIds);
  return investigationScenarios.filter((s) => s.relatedTopicIds.some((id) => pathTopicIds.has(id))).slice(0, limit);
}

// ---------------------------------------------------------------------------
// Lightweight content validation. Runs once at module load (mirrors
// lib/data/learning/index.ts's validateLearningContent) and throws on internally
// inconsistent scenario data — duplicate ids, dangling node/topic references, or
// an unreachable node — rather than letting a broken link or dead-end surface at
// runtime. Intentionally a small typed check, not a graph library.
// ---------------------------------------------------------------------------
function validateInvestigations(): void {
  const errors: string[] = [];
  const scenarioIds = new Set<string>();
  const topicIds = new Set(learningTopics.map((t) => t.id));

  for (const scenario of investigationScenarios) {
    if (scenarioIds.has(scenario.id)) errors.push(`Duplicate investigation scenario id: "${scenario.id}"`);
    scenarioIds.add(scenario.id);
  }

  for (const scenario of investigationScenarios) {
    const nodeIds = new Set(Object.keys(scenario.nodes));

    if (!nodeIds.has(scenario.startNodeId)) {
      errors.push(`Scenario "${scenario.id}" has startNodeId "${scenario.startNodeId}" which doesn't exist in nodes`);
    }

    for (const [nodeId, node] of Object.entries(scenario.nodes)) {
      if (node.id !== nodeId) {
        errors.push(`Scenario "${scenario.id}" node key "${nodeId}" doesn't match its own id "${node.id}"`);
      }
      if (node.outcome && node.actions.length > 0) {
        errors.push(`Scenario "${scenario.id}" node "${nodeId}" has both an outcome and actions — terminal nodes must have no actions`);
      }
      if (!node.outcome && node.actions.length === 0) {
        errors.push(`Scenario "${scenario.id}" node "${nodeId}" has no actions and no outcome — dead end`);
      }
      for (const action of node.actions) {
        if (!nodeIds.has(action.nextNodeId)) {
          errors.push(`Scenario "${scenario.id}" action "${action.id}" on node "${nodeId}" references unknown nextNodeId "${action.nextNodeId}"`);
        }
      }
    }

    for (const topicId of [...scenario.relatedTopicIds, ...scenario.topicsToReview]) {
      if (!topicIds.has(topicId)) {
        errors.push(`Scenario "${scenario.id}" references unknown learning topic id "${topicId}"`);
      }
    }

    // Reachability: every node should be reachable from startNodeId, or it's dead content.
    if (nodeIds.has(scenario.startNodeId)) {
      const visited = new Set<string>([scenario.startNodeId]);
      const queue = [scenario.startNodeId];
      while (queue.length > 0) {
        const current = queue.shift()!;
        const node = scenario.nodes[current];
        for (const action of node.actions) {
          if (nodeIds.has(action.nextNodeId) && !visited.has(action.nextNodeId)) {
            visited.add(action.nextNodeId);
            queue.push(action.nextNodeId);
          }
        }
      }
      for (const nodeId of nodeIds) {
        if (!visited.has(nodeId)) {
          errors.push(`Scenario "${scenario.id}" node "${nodeId}" is unreachable from startNodeId "${scenario.startNodeId}"`);
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Investigation content validation failed:\n${errors.join("\n")}`);
  }
}

validateInvestigations();
