import { InvestigationScenario, LearningCategory, LearningTopic, Quiz, QuizCategory, SkillDefinition, SkillId, SKILL_IDS } from "@/lib/types";
import { getTopicsByCategory, getTopicsByIds, getTopicById } from "@/lib/data/learning";
import { investigationScenarios } from "@/lib/data/investigations";
import { quizzes } from "@/lib/data/quizzes";

// Skill model (Phase 4, extended by the post-Phase-10 BPO expansion) — each skill has evidence derived from existing
// content (Learn topics, quizzes, Advanced Investigations) rather than a second
// hand-maintained mapping. See root CLAUDE.md and PRODUCT-ROADMAP.md for the
// full readiness-calculation writeup.
export const skillDefinitions: SkillDefinition[] = [
  {
    id: "itsm",
    name: "IT Service Management",
    description: "Tickets, incidents, priority, escalation, and the processes that keep enterprise IT support organized.",
  },
  {
    id: "infrastructure",
    name: "Infrastructure",
    description: "Servers, cloud, storage, availability, and the systems everything else depends on.",
  },
  {
    id: "networking",
    name: "Networking",
    description: "How devices, sites, and services connect — IP addressing, DNS, VPN, and more.",
  },
  {
    id: "applications",
    name: "Applications",
    description: "APIs, databases, integrations, deployments, and the software people actually use.",
  },
  {
    id: "security",
    name: "Security",
    description: "Foundational, defensive security awareness for enterprise IT staff — not a specialist track.",
  },
  {
    id: "troubleshooting",
    name: "Troubleshooting",
    description: "The cross-cutting investigative mindset: scope, evidence, diagnosis, escalation, and verification.",
  },
  {
    id: "business-logistics",
    name: "Business & Logistics Understanding",
    description:
      "Business context, not a technical skill — connecting IT systems to business processes, freight-forwarding/logistics concepts, and operational impact.",
  },
  {
    id: "process-optimization-automation",
    name: "Process Optimization & Automation",
    description:
      "Understanding a business process before changing it, and the Microsoft Power Automate concepts needed to build, test, and troubleshoot a real automation.",
  },
];

export function getSkillById(id: SkillId): SkillDefinition {
  return skillDefinitions.find((s) => s.id === id) ?? skillDefinitions[0];
}

/** The 5 non-cross-cutting skills map 1:1 onto a Learn category — deliberately
 * NOT hand-listing topic/quiz/investigation ids per skill, so this single
 * mapping is the only thing that can ever drift out of sync. */
const SKILL_LEARNING_CATEGORY: Partial<Record<SkillId, LearningCategory>> = {
  itsm: "IT Service Management",
  infrastructure: "Infrastructure",
  networking: "Networking",
  applications: "Applications",
  security: "Security Fundamentals",
  "business-logistics": "Business & Logistics",
  "process-optimization-automation": "BPO & Process Automation",
};

/** Troubleshooting is cross-cutting — no Learn category is dedicated to it, so
 * its learning evidence comes from the topics most directly about the
 * investigate/escalate/document mindset itself, not a full category. */
const TROUBLESHOOTING_TOPIC_IDS = ["ticket", "incident", "problem-management", "root-cause-analysis", "escalation", "change-management"];

export const SKILL_QUIZ_CATEGORY: Record<SkillId, QuizCategory> = {
  itsm: "IT Service Management",
  infrastructure: "Infrastructure",
  networking: "Networking",
  applications: "Applications",
  security: "Security Fundamentals",
  troubleshooting: "Enterprise Troubleshooting",
  "business-logistics": "Business & Logistics",
  "process-optimization-automation": "BPO & Process Automation",
};

export function getTopicsForSkill(skillId: SkillId): LearningTopic[] {
  if (skillId === "troubleshooting") return getTopicsByIds(TROUBLESHOOTING_TOPIC_IDS);
  const category = SKILL_LEARNING_CATEGORY[skillId];
  return category ? getTopicsByCategory(category) : [];
}

export function getQuizzesForSkill(skillId: SkillId): Quiz[] {
  const category = SKILL_QUIZ_CATEGORY[skillId];
  return quizzes.filter((q) => q.category === category);
}

/** Troubleshooting counts every Advanced Investigation as practical evidence —
 * every scenario exercises the same scope/evidence/diagnose/escalate/verify
 * framework, regardless of technical domain. The other 5 skills derive their
 * investigations from whether the scenario's own relatedTopicIds touch that
 * skill's Learn category, so there's never a second hand-maintained list to
 * keep in sync as investigations/topics change. */
export function getInvestigationsForSkill(skillId: SkillId): InvestigationScenario[] {
  if (skillId === "troubleshooting") return investigationScenarios;
  const category = SKILL_LEARNING_CATEGORY[skillId];
  if (!category) return [];
  return investigationScenarios.filter((s) => s.relatedTopicIds.some((id) => getTopicById(id)?.category === category));
}

// ---------------------------------------------------------------------------
// Lightweight validation, mirroring the other content modules. Every skill
// must resolve to at least one topic, one quiz, and one investigation, or the
// 30/30/40 readiness weighting below would divide by an empty evidence pool.
// ---------------------------------------------------------------------------
function validateSkills(): void {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const skill of skillDefinitions) {
    if (ids.has(skill.id)) errors.push(`Duplicate skill id: "${skill.id}"`);
    ids.add(skill.id);
  }
  for (const id of SKILL_IDS) {
    if (!ids.has(id)) errors.push(`Skill id "${id}" from SKILL_IDS has no matching SkillDefinition`);
  }

  for (const skill of skillDefinitions) {
    if (getTopicsForSkill(skill.id).length === 0) errors.push(`Skill "${skill.id}" has no mapped learning topics`);
    if (getQuizzesForSkill(skill.id).length === 0) errors.push(`Skill "${skill.id}" has no mapped quizzes`);
    if (getInvestigationsForSkill(skill.id).length === 0) errors.push(`Skill "${skill.id}" has no mapped investigations`);
  }

  if (errors.length > 0) {
    throw new Error(`Skill content validation failed:\n${errors.join("\n")}`);
  }
}

validateSkills();
