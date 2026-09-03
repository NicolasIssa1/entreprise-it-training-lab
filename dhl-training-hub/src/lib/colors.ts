import { LearningCategory, QuizCategory, SkillId } from "@/lib/types";

/**
 * Category color system (visual overhaul pass). Every Learn category and
 * skill gets one consistent accent color, reused everywhere that category
 * shows up — topic cards, skill cards, quiz category headers, investigation
 * tags, assignment chips. This is presentation-only: it never changes what
 * content belongs to which category/skill, only how it's colored.
 *
 * Tailwind (v4) statically scans source text for class name literals, so
 * every class string below must appear literally (no `${}` interpolation)
 * for the corresponding utility to actually be generated.
 */
export type ColorSlug = "sky" | "blue" | "cyan" | "indigo" | "rose" | "emerald" | "violet" | "amber";

interface ColorStyle {
  /** Soft badge background + ring + text — matches the Badge component's own look. */
  badge: string;
  /** Small solid dot (list bullets, legend markers). */
  dot: string;
  /** Text-only accent, for links/labels. */
  text: string;
  /** Icon chip background + text. */
  chip: string;
  /** Gradient pair for a card's top accent bar. */
  gradient: string;
  /** Border tint for hover/active states. */
  border: string;
  /** Colored shadow tint on hover. */
  shadow: string;
  /** Solid progress-bar fill. */
  bar: string;
}

const COLOR_STYLES: Record<ColorSlug, ColorStyle> = {
  sky: {
    badge: "bg-sky-50 text-sky-700 ring-1 ring-inset ring-sky-200 dark:bg-sky-950/70 dark:text-sky-300 dark:ring-sky-900",
    dot: "bg-sky-500",
    text: "text-sky-600 dark:text-sky-400",
    chip: "bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-300",
    gradient: "from-sky-500 to-sky-600",
    border: "hover:border-sky-300 dark:hover:border-sky-800/70",
    shadow: "hover:shadow-sky-900/[0.08]",
    bar: "bg-sky-500",
  },
  blue: {
    badge: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200 dark:bg-blue-950/70 dark:text-blue-300 dark:ring-blue-900",
    dot: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400",
    chip: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300",
    gradient: "from-blue-500 to-blue-600",
    border: "hover:border-blue-300 dark:hover:border-blue-800/70",
    shadow: "hover:shadow-blue-900/[0.08]",
    bar: "bg-blue-600",
  },
  cyan: {
    badge: "bg-cyan-50 text-cyan-700 ring-1 ring-inset ring-cyan-200 dark:bg-cyan-950/70 dark:text-cyan-300 dark:ring-cyan-900",
    dot: "bg-cyan-500",
    text: "text-cyan-600 dark:text-cyan-400",
    chip: "bg-cyan-100 text-cyan-600 dark:bg-cyan-950 dark:text-cyan-300",
    gradient: "from-cyan-500 to-cyan-600",
    border: "hover:border-cyan-300 dark:hover:border-cyan-800/70",
    shadow: "hover:shadow-cyan-900/[0.08]",
    bar: "bg-cyan-500",
  },
  indigo: {
    badge: "bg-indigo-50 text-indigo-700 ring-1 ring-inset ring-indigo-200 dark:bg-indigo-950/70 dark:text-indigo-300 dark:ring-indigo-900",
    dot: "bg-indigo-500",
    text: "text-indigo-600 dark:text-indigo-400",
    chip: "bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300",
    gradient: "from-indigo-500 to-indigo-600",
    border: "hover:border-indigo-300 dark:hover:border-indigo-800/70",
    shadow: "hover:shadow-indigo-900/[0.08]",
    bar: "bg-indigo-600",
  },
  rose: {
    badge: "bg-rose-50 text-rose-700 ring-1 ring-inset ring-rose-200 dark:bg-rose-950/70 dark:text-rose-300 dark:ring-rose-900",
    dot: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
    chip: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300",
    gradient: "from-rose-500 to-rose-600",
    border: "hover:border-rose-300 dark:hover:border-rose-800/70",
    shadow: "hover:shadow-rose-900/[0.08]",
    bar: "bg-rose-500",
  },
  emerald: {
    badge: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200 dark:bg-emerald-950/70 dark:text-emerald-300 dark:ring-emerald-900",
    dot: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    chip: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300",
    gradient: "from-emerald-500 to-emerald-600",
    border: "hover:border-emerald-300 dark:hover:border-emerald-800/70",
    shadow: "hover:shadow-emerald-900/[0.08]",
    bar: "bg-emerald-500",
  },
  violet: {
    badge: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200 dark:bg-violet-950/70 dark:text-violet-300 dark:ring-violet-900",
    dot: "bg-violet-500",
    text: "text-violet-600 dark:text-violet-400",
    chip: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-300",
    gradient: "from-violet-500 to-violet-600",
    border: "hover:border-violet-300 dark:hover:border-violet-800/70",
    shadow: "hover:shadow-violet-900/[0.08]",
    bar: "bg-violet-600",
  },
  amber: {
    badge: "bg-amber-50 text-amber-800 ring-1 ring-inset ring-amber-200 dark:bg-amber-950/70 dark:text-amber-300 dark:ring-amber-900",
    dot: "bg-amber-500",
    text: "text-amber-700 dark:text-amber-400",
    chip: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    gradient: "from-amber-500 to-amber-600",
    border: "hover:border-amber-300 dark:hover:border-amber-800/70",
    shadow: "hover:shadow-amber-900/[0.08]",
    bar: "bg-amber-500",
  },
};

/** One accent color per Learn category — also doubles as the QuizCategory color
 * (QuizCategory is LearningCategory | "Enterprise Troubleshooting"). */
const CATEGORY_COLOR: Record<QuizCategory, ColorSlug> = {
  "IT Service Management": "sky",
  Infrastructure: "blue",
  Networking: "cyan",
  Applications: "indigo",
  "Security Fundamentals": "rose",
  "Business & Logistics": "emerald",
  "BPO & Process Automation": "violet",
  "Enterprise Troubleshooting": "amber",
};

/** Skills mostly mirror their Learn category 1:1; troubleshooting is
 * cross-cutting (no dedicated category) so it gets its own amber slot. */
const SKILL_COLOR: Record<SkillId, ColorSlug> = {
  itsm: "sky",
  infrastructure: "blue",
  networking: "cyan",
  applications: "indigo",
  security: "rose",
  troubleshooting: "amber",
  "business-logistics": "emerald",
  "process-optimization-automation": "violet",
};

export function categoryColor(category: LearningCategory | QuizCategory): ColorStyle {
  return COLOR_STYLES[CATEGORY_COLOR[category] ?? "sky"];
}

export function skillColor(skillId: SkillId): ColorStyle {
  return COLOR_STYLES[SKILL_COLOR[skillId] ?? "sky"];
}
