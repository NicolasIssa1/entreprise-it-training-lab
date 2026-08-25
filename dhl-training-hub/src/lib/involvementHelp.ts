import { INVOLVEMENT_LEVELS, InvolvementLevel } from "@/lib/types";

/** Short description of each involvement level, shown as tooltip + inline help text
 * so "Observed" vs "Performed" vs "Implemented" are never ambiguous when logging. */
export const INVOLVEMENT_HELP: Record<InvolvementLevel, string> = {
  Observed: "I watched or reviewed someone else doing the work.",
  Learned: "I studied or absorbed new knowledge, without performing the task myself.",
  Assisted: "I directly helped someone perform the work.",
  Participated: "I took an active part in a group activity or process.",
  Performed: "I personally completed the task.",
  Built: "I created a technical solution.",
  Implemented: "I put a solution into actual use.",
};

// Simple keyword → minimum-required-level check. Not sophisticated AI detection —
// just a lightweight nudge to re-read the wording, per Phase 1 scope.
const STRONG_WORDING: { keyword: string; minLevel: InvolvementLevel }[] = [
  { keyword: "implemented", minLevel: "Implemented" },
  { keyword: "deployed", minLevel: "Implemented" },
  { keyword: "shipped", minLevel: "Implemented" },
  { keyword: "built", minLevel: "Built" },
  { keyword: "developed", minLevel: "Built" },
  { keyword: "engineered", minLevel: "Built" },
  { keyword: "designed", minLevel: "Built" },
  { keyword: "created", minLevel: "Built" },
  { keyword: "performed", minLevel: "Performed" },
  { keyword: "completed", minLevel: "Performed" },
  { keyword: "resolved", minLevel: "Performed" },
  { keyword: "fixed", minLevel: "Performed" },
  { keyword: "executed", minLevel: "Performed" },
  { keyword: "led", minLevel: "Performed" },
];

/** Returns a warning string if the wording implies stronger involvement than the
 * selected level, or null if there's no obvious mismatch. */
export function checkWordingAgainstLevel(wording: string, level: InvolvementLevel): string | null {
  const levelIndex = INVOLVEMENT_LEVELS.indexOf(level);
  const lower = wording.toLowerCase();
  for (const { keyword, minLevel } of STRONG_WORDING) {
    if (lower.includes(keyword) && INVOLVEMENT_LEVELS.indexOf(minLevel) > levelIndex) {
      return `This wording sounds stronger ("${keyword}") than your selected involvement level (${level}). Consider adjusting the wording or the level.`;
    }
  }
  return null;
}
