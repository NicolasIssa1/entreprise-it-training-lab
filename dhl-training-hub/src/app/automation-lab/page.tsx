"use client";

import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { AutomationLabCard } from "@/components/AutomationLabCard";
import { getPracticeAutomationLabScenarios } from "@/lib/data/automationLab";
import { useAutomationLabAttempts, bestAutomationLabAttempt } from "@/lib/automationLabProgress";

export default function AutomationLabPage() {
  const { allAttempts } = useAutomationLabAttempts();
  const scenarios = getPracticeAutomationLabScenarios();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Automation Lab"
        title="Build enterprise workflows out of trigger, condition, action, and logic blocks."
        description="Hands-on practice with the block-assembly workflow builder — assemble a solution, submit it, and get a graded breakdown of what was correct, missing, or unnecessary."
        accent="from-cyan-500/15 via-blue-500/10 to-transparent"
      />
      <PrivacyNotice context="All scenarios below are fictional training content — fake companies, fake data. For the larger, CV-ready builds, see Enterprise Projects." />

      <p className="text-sm text-slate-500 dark:text-slate-400">
        Start here for a short, focused build before attempting a full{" "}
        <Link href="/projects" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Enterprise Project
        </Link>
        .
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario) => {
          const best = bestAutomationLabAttempt(allAttempts[scenario.id] ?? []);
          return <AutomationLabCard key={scenario.id} scenario={scenario} bestScore={best?.score.overall} />;
        })}
      </div>
    </div>
  );
}
