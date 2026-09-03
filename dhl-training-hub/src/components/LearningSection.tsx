import { ReactNode } from "react";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";

/** Wraps one section of a Learn topic page. `emphasized` gives Explain Like I'm 10
 * a visually distinct treatment, per the product's signature ELI10 sections. */
export function LearningSection({
  title,
  subtitle,
  children,
  emphasized = false,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  emphasized?: boolean;
}) {
  return (
    <Card
      className={
        emphasized
          ? "border-blue-200 bg-blue-50/60 dark:border-blue-900 dark:bg-blue-950/30"
          : undefined
      }
    >
      <SectionHeading title={title} subtitle={subtitle} />
      <div className="leading-relaxed">{children}</div>
    </Card>
  );
}
