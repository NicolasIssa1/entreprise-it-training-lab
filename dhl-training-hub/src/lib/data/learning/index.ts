import { LearningCategory, LearningPath, LearningTopic, TeamId } from "@/lib/types";
import { itsmTopics } from "./itsm";
import { infrastructureTopics } from "./infrastructure";
import { networkingTopics } from "./networking";
import { applicationsTopics } from "./applications";
import { securityTopics } from "./security";
import { businessLogisticsTopics } from "./businessLogistics";
import { learningPaths } from "./paths";
import { tickets } from "@/lib/data/tickets";

// Single combined topic list. Kept as flat, typed local data for Phase 2 — could
// move to Supabase/a CMS later without the UI changing, since pages only ever read
// through the helpers below. See root CLAUDE.md: general enterprise IT knowledge
// only, never a confirmed description of DHL specifically.
export const learningTopics: LearningTopic[] = [
  ...itsmTopics,
  ...infrastructureTopics,
  ...networkingTopics,
  ...applicationsTopics,
  ...securityTopics,
  ...businessLogisticsTopics,
];

export { learningPaths };

export const LEARNING_CATEGORIES: LearningCategory[] = [
  "IT Service Management",
  "Infrastructure",
  "Networking",
  "Applications",
  "Security Fundamentals",
  "Business & Logistics",
];

export function getTopicById(id: string): LearningTopic | undefined {
  return learningTopics.find((t) => t.id === id);
}

export function getTopicsByIds(ids: string[]): LearningTopic[] {
  return ids.map(getTopicById).filter((t): t is LearningTopic => t !== undefined);
}

export function getTopicsByCategory(category: LearningCategory): LearningTopic[] {
  return learningTopics.filter((t) => t.category === category);
}

/** Each team's "home" learning category, for the Team page's "Recommended
 * Learning" section. IT Service Management, Security Fundamentals, and Business &
 * Logistics topics apply broadly (any team can own a ticket/incident/escalation,
 * security genuinely crosses all three teams, and business/logistics context is
 * equally relevant regardless of which team a system sits in — see root
 * CLAUDE.md, no dedicated "security team" or "business team" is assumed), so all
 * three are shown across all three teams rather than assigned to one. This is
 * deliberately category-based, not derived from each topic's
 * primaryTeam/relatedTeams (which describe the topic's own most-involved teams,
 * not "which team page should recommend it") — using team fields here would make
 * these cross-cutting categories flood every team's list rather than staying a
 * clean, curated recommendation set. */
const TEAM_HOME_CATEGORY: Record<TeamId, LearningCategory> = {
  infrastructure: "Infrastructure",
  applications: "Applications",
  "support-network": "Networking",
};

const CROSS_TEAM_CATEGORIES: LearningCategory[] = ["IT Service Management", "Security Fundamentals", "Business & Logistics"];

export function getTopicsForTeam(teamId: TeamId): LearningTopic[] {
  const homeCategory = TEAM_HOME_CATEGORY[teamId];
  return learningTopics.filter((t) => t.category === homeCategory || CROSS_TEAM_CATEGORIES.includes(t.category));
}

/** Simple client-side search over title/category/short description/keywords — no
 * external search package, matches Phase 2 scope. */
export function searchTopics(query: string): LearningTopic[] {
  const q = query.trim().toLowerCase();
  if (!q) return learningTopics;
  return learningTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q) ||
      t.keywords.some((k) => k.toLowerCase().includes(q)),
  );
}

export function getPathById(id: string): LearningPath | undefined {
  return learningPaths.find((p) => p.id === id);
}

/** Path progress is always derived from topic completion — never stored
 * separately, so it can never drift out of sync with actual topic state. */
export function getPathProgress(path: LearningPath, completed: Record<string, boolean>) {
  const completedCount = path.topicIds.filter((id) => completed[id]).length;
  return { completedCount, total: path.topicIds.length };
}

/** First not-yet-completed topic in a given ordered list — used for the Learn
 * landing page's deterministic "suggested next topic," not an AI recommendation. */
export function getNextIncompleteTopicId(
  topicIds: string[],
  completed: Record<string, boolean>,
): string | undefined {
  return topicIds.find((id) => !completed[id]);
}

// ---------------------------------------------------------------------------
// Lightweight content validation. Runs once at module load (so it fires during
// `next build` and in dev) and throws if content is internally inconsistent —
// catching a bad topic/path/ticket reference at build time instead of a broken
// link discovered later at runtime. Intentionally a small typed check, not a
// validation library — the dataset is small (56 topics, 6 paths, ~34 tickets).
// ---------------------------------------------------------------------------
function validateLearningContent(): void {
  const errors: string[] = [];
  const ids = new Set<string>();

  for (const topic of learningTopics) {
    if (ids.has(topic.id)) errors.push(`Duplicate learning topic id: "${topic.id}"`);
    ids.add(topic.id);
  }

  for (const topic of learningTopics) {
    for (const relatedId of topic.relatedTopicIds) {
      if (!ids.has(relatedId)) {
        errors.push(`Topic "${topic.id}" has relatedTopicIds referencing unknown id "${relatedId}"`);
      }
    }
    for (const prereqId of topic.prerequisiteTopicIds ?? []) {
      if (!ids.has(prereqId)) {
        errors.push(`Topic "${topic.id}" has prerequisiteTopicIds referencing unknown id "${prereqId}"`);
      }
    }
    for (const contrast of topic.dontConfuseWith ?? []) {
      if (!ids.has(contrast.topicId)) {
        errors.push(`Topic "${topic.id}" has dontConfuseWith referencing unknown id "${contrast.topicId}"`);
      }
    }
  }

  for (const path of learningPaths) {
    for (const topicId of path.topicIds) {
      if (!ids.has(topicId)) {
        errors.push(`Learning path "${path.id}" references unknown topic id "${topicId}"`);
      }
    }
  }

  for (const ticket of tickets) {
    for (const topicId of ticket.topicIds) {
      if (!ids.has(topicId)) {
        errors.push(`Ticket "${ticket.id}" references unknown learning topic id "${topicId}"`);
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(`Learning content validation failed:\n${errors.join("\n")}`);
  }
}

validateLearningContent();
