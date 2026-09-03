import { ReactNode } from "react";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";

export type LearningSectionTone = "friendly" | "technical" | "business" | "warning" | "question" | "neutral";

const TONE_STYLES: Record<LearningSectionTone, { card: string; bar: string }> = {
  friendly: { card: "border-sky-200 bg-sky-50/50 dark:border-sky-900 dark:bg-sky-950/20", bar: "bg-sky-500" },
  technical: { card: "border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20", bar: "bg-blue-600" },
  business: { card: "border-emerald-200 bg-emerald-50/50 dark:border-emerald-900 dark:bg-emerald-950/20", bar: "bg-emerald-500" },
  warning: { card: "border-amber-200 bg-amber-50/50 dark:border-amber-900 dark:bg-amber-950/20", bar: "bg-amber-500" },
  question: { card: "border-violet-200 bg-violet-50/50 dark:border-violet-900 dark:bg-violet-950/20", bar: "bg-violet-500" },
  neutral: { card: "", bar: "bg-slate-200 dark:bg-slate-800" },
};

/**
 * Wraps one section of a Learn topic page. `tone` gives specific section
 * types (Explain Like I'm New, Technical, Business, Common Problems,
 * Question to Ask at Work) a distinct color identity — a left accent bar
 * plus a soft tint — so a long lesson reads as clearly differentiated
 * sections while scrolling, not one undifferentiated wall of cards. The bar
 * uses negative-margin cancellation (not a competing padding utility) to sit
 * flush against Card's own p-5/rounded-2xl edge deterministically.
 */
export function LearningSection({
  title,
  subtitle,
  children,
  tone = "neutral",
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  tone?: LearningSectionTone;
}) {
  const style = TONE_STYLES[tone];
  return (
    <Card className={`flex gap-4 ${style.card}`}>
      <span className={`-my-5 -ml-5 w-1.5 shrink-0 rounded-l-2xl ${style.bar}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <SectionHeading title={title} subtitle={subtitle} />
        <div className="leading-relaxed">{children}</div>
      </div>
    </Card>
  );
}
