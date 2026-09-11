"use client";

import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { Disclaimer } from "@/components/Disclaimer";
import { AutomationLabCard } from "@/components/AutomationLabCard";
import { getEnterpriseProjectScenarios } from "@/lib/data/automationLab";
import { useAutomationLabAttempts, bestAutomationLabAttempt } from "@/lib/automationLabProgress";

export default function EnterpriseProjectsPage() {
  const { allAttempts } = useAutomationLabAttempts();
  const scenarios = getEnterpriseProjectScenarios();

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Enterprise Projects"
        title="Realistic, junior-level enterprise automation builds."
        description="Multi-tool capstones combining SharePoint, Power Automate, Excel, Outlook, and Power BI — the same block-assembly builder as the Automation Lab, with more depth and a CV-ready outcome."
        accent="from-violet-500/15 via-blue-500/10 to-transparent"
      />
      <PrivacyNotice context="Every project below is a fictional company scenario. Nothing here represents a real deployment — see each result screen's CV wording, always labeled as a portfolio/simulated project." />

      <Disclaimer>
        Completing a project here produces a generic, honestly-labeled CV bullet — never a claim that you deployed
        this at a real company. See each project&rsquo;s result screen for the exact wording and skills demonstrated.
      </Disclaimer>

      <p className="text-sm text-slate-500 dark:text-slate-400">
        New to the block builder? Try the{" "}
        <Link href="/automation-lab" className="font-medium text-blue-600 hover:underline dark:text-blue-400">
          Automation Lab
        </Link>{" "}
        first for a shorter, focused warm-up.
      </p>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {scenarios.map((scenario) => {
          const best = bestAutomationLabAttempt(allAttempts[scenario.id] ?? []);
          return <AutomationLabCard key={scenario.id} scenario={scenario} bestScore={best?.score.overall} showAudience />;
        })}
      </div>
    </div>
  );
}
