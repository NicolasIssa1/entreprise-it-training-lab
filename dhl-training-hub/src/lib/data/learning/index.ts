import { LearningCategory, LearningTopic, TeamId } from "@/lib/types";
import { itsmTopics } from "./itsm";
import { infrastructureTopics } from "./infrastructure";
import { networkingTopics } from "./networking";
import { applicationsTopics } from "./applications";

// Single combined topic list. Kept as flat, typed local data for Phase 2A — could
// move to Supabase/a CMS later without the UI changing, since pages only ever read
// through the helpers below. See root CLAUDE.md: general enterprise IT knowledge
// only, never a confirmed description of DHL specifically.
export const learningTopics: LearningTopic[] = [
  ...itsmTopics,
  ...infrastructureTopics,
  ...networkingTopics,
  ...applicationsTopics,
];

export const LEARNING_CATEGORIES: LearningCategory[] = [
  "IT Service Management",
  "Infrastructure",
  "Networking",
  "Applications",
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
 * Learning" section. IT Service Management topics apply broadly (any team can own
 * a ticket/incident/escalation), so they're shown across all three teams rather
 * than assigned to one. This is deliberately category-based, not derived from each
 * topic's primaryTeam/relatedTeams (which describe the topic's own most-involved
 * teams, not "which team page should recommend it") — using team fields here would
 * make ITSM topics flood every team's list rather than staying a clean, curated
 * recommendation set. */
const TEAM_HOME_CATEGORY: Record<TeamId, LearningCategory> = {
  infrastructure: "Infrastructure",
  applications: "Applications",
  "support-network": "Networking",
};

export function getTopicsForTeam(teamId: TeamId): LearningTopic[] {
  const homeCategory = TEAM_HOME_CATEGORY[teamId];
  return learningTopics.filter((t) => t.category === homeCategory || t.category === "IT Service Management");
}

/** Simple client-side substring search over title/category/short description —
 * no external search package, matches Phase 2A scope. */
export function searchTopics(query: string): LearningTopic[] {
  const q = query.trim().toLowerCase();
  if (!q) return learningTopics;
  return learningTopics.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.shortDescription.toLowerCase().includes(q),
  );
}
