import { TrainingAssignment } from "@/lib/types";
import { learningPaths } from "@/lib/data/learning";
import { quizzes } from "@/lib/data/quizzes";
import { investigationScenarios } from "@/lib/data/investigations";

// Training Assignment templates (Phase 9 Part D). Static/config-driven, just a
// named bundle of required learning path / quiz / investigation ids — not a new
// competency score, not organization-wide manager functionality. These are
// generic templates a learner can activate for themselves, not company-specific
// programs — see root CLAUDE.md's confidentiality rules (no DHL-specific facts).
export const trainingAssignments: TrainingAssignment[] = [
  {
    id: "enterprise-it-intern-foundation",
    title: "Enterprise IT Intern Foundation",
    audience: "IT interns and new hires building core enterprise IT vocabulary and support fundamentals.",
    purpose:
      "A broad first assignment covering IT service management basics, general support fundamentals, and hands-on troubleshooting practice — a reasonable default for most interns in their first weeks.",
    estimatedScope: "2 learning paths, 2 assessments, 2 investigations — roughly 1-2 weeks of part-time study.",
    requiredPathIds: ["enterprise-it-foundations", "it-support-foundations"],
    requiredQuizIds: ["quiz-itsm-foundation", "quiz-troubleshooting-foundation"],
    requiredScenarioIds: ["dns-resolution", "auth-vs-authorization"],
    recommendedTopicIds: ["ticket", "incident", "escalation"],
  },
  {
    id: "infrastructure-network-foundation",
    title: "Infrastructure & Network Foundation",
    audience: "Interns focusing on Infrastructure or Support & Network — servers, cloud, storage, and connectivity.",
    purpose:
      "Builds the vocabulary and troubleshooting instincts for infrastructure and networking: servers, storage, availability, IP addressing, DNS, and VPN.",
    estimatedScope: "2 learning paths, 2 assessments, 3 investigations — roughly 2 weeks of part-time study.",
    requiredPathIds: ["infrastructure-foundations", "network-foundations"],
    requiredQuizIds: ["quiz-infrastructure-foundation", "quiz-networking-foundation"],
    requiredScenarioIds: ["vpn-connectivity", "dns-resolution", "shared-storage-outage"],
  },
  {
    id: "applications-support-foundation",
    title: "Applications Support Foundation",
    audience: "Application support graduates and interns — APIs, integrations, deployments, and application logs.",
    purpose:
      "Focuses on how business applications are built, integrated, deployed, and supported — APIs, databases, system integration, and deployment/release troubleshooting.",
    estimatedScope: "1 learning path, 1 assessment, 3 investigations — roughly 1-2 weeks of part-time study.",
    requiredPathIds: ["application-support-foundations"],
    requiredQuizIds: ["quiz-applications-foundation"],
    requiredScenarioIds: ["application-performance", "system-integration-failure", "deployment-regression"],
  },
  {
    id: "business-logistics-technology-foundation",
    title: "Business & Logistics Technology Foundation",
    audience: "Interns connecting enterprise IT to business/logistics context — how technology supports the business.",
    purpose:
      "Pairs core enterprise IT foundations with generic business/freight-forwarding context, practicing how a technical fault translates into business impact.",
    estimatedScope: "2 learning paths, 1 assessment, 2 investigations — roughly 2 weeks of part-time study.",
    requiredPathIds: ["enterprise-it-foundations", "business-logistics-foundations"],
    requiredQuizIds: ["quiz-business-logistics-foundation"],
    requiredScenarioIds: ["shipment-visibility-outage", "customs-documentation-delay"],
  },
  {
    id: "bpo-process-automation-foundation",
    title: "BPO & Process Automation Foundation",
    audience: "Anyone preparing to work on a real business-process-improvement or Power Automate project — understanding a process before automating it, then core Power Automate concepts.",
    purpose:
      "Builds the BPO methodology (As-Is/To-Be, root cause, requirements, automation fit) and the Power Automate fundamentals (triggers, conditions, connectors, exception handling, troubleshooting) needed to responsibly contribute to a real automation project.",
    estimatedScope: "1 learning path, 1 assessment, 3 investigations — roughly 1-2 weeks of part-time study.",
    requiredPathIds: ["bpo-process-automation-foundations"],
    requiredQuizIds: ["quiz-bpo-automation-foundation"],
    requiredScenarioIds: ["excel-reporting-missing-rows", "approval-flow-duplicate-notifications", "previously-working-flow-fails"],
    recommendedTopicIds: ["bpo-method-lifecycle", "requirements-gathering", "automation-governance-and-ownership"],
  },
];

export function getAssignmentById(id: string): TrainingAssignment | undefined {
  return trainingAssignments.find((a) => a.id === id);
}

// ---------------------------------------------------------------------------
// Lightweight content validation, mirroring every other content module (Learn,
// Investigations, Quizzes, Skills). Runs at module load and throws on a dangling
// path/quiz/scenario reference rather than letting a broken assignment surface
// at runtime.
// ---------------------------------------------------------------------------
function validateAssignments(): void {
  const errors: string[] = [];
  const ids = new Set<string>();
  const pathIds = new Set(learningPaths.map((p) => p.id));
  const quizIds = new Set(quizzes.map((q) => q.id));
  const scenarioIds = new Set(investigationScenarios.map((s) => s.id));

  for (const assignment of trainingAssignments) {
    if (ids.has(assignment.id)) errors.push(`Duplicate assignment id: "${assignment.id}"`);
    ids.add(assignment.id);

    if (assignment.requiredPathIds.length === 0 && assignment.requiredQuizIds.length === 0 && assignment.requiredScenarioIds.length === 0) {
      errors.push(`Assignment "${assignment.id}" has no required activities at all`);
    }
    for (const id of assignment.requiredPathIds) {
      if (!pathIds.has(id)) errors.push(`Assignment "${assignment.id}" references unknown learning path id "${id}"`);
    }
    for (const id of assignment.requiredQuizIds) {
      if (!quizIds.has(id)) errors.push(`Assignment "${assignment.id}" references unknown quiz id "${id}"`);
    }
    for (const id of assignment.requiredScenarioIds) {
      if (!scenarioIds.has(id)) errors.push(`Assignment "${assignment.id}" references unknown investigation scenario id "${id}"`);
    }
  }

  if (errors.length > 0) {
    throw new Error(`Assignment content validation failed:\n${errors.join("\n")}`);
  }
}

validateAssignments();
