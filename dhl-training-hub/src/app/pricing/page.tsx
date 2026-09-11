"use client";

import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHeader } from "@/components/PageHeader";
import { Disclaimer } from "@/components/Disclaimer";
import { Badge } from "@/components/Badge";
import { CheckCircleIcon } from "@/components/icons";
import { useEntitlement } from "@/lib/entitlements";

const TIERS: { id: "free" | "pro" | "enterprise"; name: string; tagline: string; features: string[] }[] = [
  {
    id: "free",
    name: "Free",
    tagline: "The full core training product",
    features: [
      "Full Learn library, quizzes, and Advanced Investigations",
      "Automation Lab and Enterprise Projects",
      "AI Tutor (when configured)",
      "Analytics, Progress, and Training Assignments",
      "Daily Log and CV Achievement Tracker",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    tagline: "Career-readiness intelligence layered on top",
    features: [
      "Everything in Free",
      "Transparent Readiness Score & Skill-Gap Engine",
      "Professional Milestones",
      "Certificates for completed Learning Paths",
      "Structured CV Evidence & interview-ready stories",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "For organizations rolling this out to a team",
    features: [
      "Everything in Pro",
      "Reserved for future manager/admin features",
      "Not built yet — see /pilot/readiness",
    ],
  },
];

/**
 * Informational tier comparison (Phase 11) — deliberately no checkout flow.
 * There is no payment integration yet (see root CLAUDE.md); this page exists
 * so ProGate's "See plans →" link goes somewhere honest rather than a dead
 * end or a fake "Buy now" button.
 */
export default function PricingPage() {
  const { tier: currentTier, isDevOverride } = useEntitlement();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Plans"
        title="Plans"
        description="An honest look at what's included at each tier — there is no live payment flow yet, so nothing here can currently be purchased."
        accent="from-indigo-500/15 via-blue-500/10 to-transparent"
      />

      <Disclaimer>
        {isDevOverride
          ? "This environment is using a local development tier override, not a real subscription."
          : `You're currently on the ${currentTier === "free" ? "Free" : currentTier === "pro" ? "Pro" : "Enterprise"} tier.`}{" "}
        No payment processing is connected yet — this page is informational only.
      </Disclaimer>

      <div className="grid gap-4 sm:grid-cols-3">
        {TIERS.map((tier) => (
          <Card key={tier.id} className={tier.id === currentTier ? "border-blue-300 dark:border-blue-800" : ""}>
            <div className="flex items-center justify-between">
              <SectionHeading title={tier.name} subtitle={tier.tagline} />
              {tier.id === currentTier && <Badge variant="accent">Current</Badge>}
            </div>
            <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
              {tier.features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <span className="mt-0.5 shrink-0 text-blue-600 dark:text-blue-400">
                    <CheckCircleIcon size={15} />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
