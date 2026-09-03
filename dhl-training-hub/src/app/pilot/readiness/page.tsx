"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { Disclaimer } from "@/components/Disclaimer";
import { useAuth } from "@/lib/auth/AuthProvider";

function ChecklistItem({ label, done, note }: { label: string; done: boolean; note?: string }) {
  return (
    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
      <Badge variant={done ? "success" : "warning"}>{done ? "Ready" : "Pending"}</Badge>
      <span>
        {label}
        {note && <span className="block text-xs text-slate-500 dark:text-slate-400">{note}</span>}
      </span>
    </li>
  );
}

/**
 * Pilot Readiness checklist (Phase 9 Part M) — a deliberately honest
 * self-assessment, not a marketing page. Product/content readiness is
 * structurally true (backed by the build-time content validators this app
 * already runs); Supabase/AI configuration are checked live so the page
 * reflects the actual running environment rather than a hardcoded claim.
 */
export default function PilotReadinessPage() {
  const { isConfigured: cloudConfigured } = useAuth();
  const [aiConfigured, setAiConfigured] = useState<boolean | null>(null);

  useEffect(() => {
    fetch("/api/tutor")
      .then((res) => res.json())
      .then((data) => setAiConfigured(!!data.configured))
      .catch(() => setAiConfigured(false));
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Pilot Readiness Checklist</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          An honest, self-assessed picture of what&rsquo;s ready and what isn&rsquo;t before proposing a real pilot —
          see <code className="rounded bg-slate-100 px-1 py-0.5 text-xs dark:bg-slate-800">ENTERPRISE-READINESS.md</code>{" "}
          for the full future-requirements list.
        </p>
      </div>

      <Disclaimer>
        This checklist reflects a polished training prototype, not production enterprise software. Honesty about gaps
        is the point.
      </Disclaimer>

      <Card>
        <SectionHeading title="Product" />
        <ul className="space-y-3">
          <ChecklistItem label="Curriculum ready" done note="103 Learn topics across 7 categories, validated at build time." />
          <ChecklistItem label="Quizzes ready" done note="16 scenario-based assessments, 143 questions, validated at build time." />
          <ChecklistItem label="Investigation scenarios ready" done note="13 branching Advanced Investigations, validated at build time." />
          <ChecklistItem
            label="AI Tutor ready"
            done={aiConfigured === true}
            note={
              aiConfigured === null
                ? "Checking..."
                : aiConfigured
                ? "ANTHROPIC_API_KEY is configured in this environment."
                : "Not configured in this environment — works with zero setup once a key is added; every other feature works without it."
            }
          />
          <ChecklistItem label="Analytics ready" done note="Training Overview, per-skill breakdown, activity timeline, and a printable summary." />
          <ChecklistItem label="Training Assignments ready" done note="4 static assignment templates with derived completion tracking." />
        </ul>
      </Card>

      <Card>
        <SectionHeading title="Security" />
        <ul className="space-y-3">
          <ChecklistItem label="Secrets excluded from Git" done note="See the repository audit in the Phase 9 completion report." />
          <ChecklistItem label="Row Level Security enabled on every table" done note="supabase/migrations/0001_init.sql and 0002_tutor.sql." />
          <ChecklistItem label="Private/public data boundaries kept separate" done note="Company context, Daily Log, and CV Tracker never reach Analytics or the AI Tutor automatically." />
          <ChecklistItem label="No real company data in the codebase" done note="All tickets, scenarios, and quiz content are fictional and generic." />
        </ul>
      </Card>

      <Card>
        <SectionHeading title="Deployment" />
        <ul className="space-y-3">
          <ChecklistItem label="Cloud backend (Supabase)" done={cloudConfigured} note={cloudConfigured ? "Configured in this environment." : "Not deployed yet — running in Local Demo Mode."} />
          <ChecklistItem label="Production hosting" done={false} note="Not deployed yet — no live URL exists." />
          <ChecklistItem label="Environment configuration" done={false} note="Would need real Supabase + Anthropic credentials provisioned for a pilot cohort." />
        </ul>
      </Card>

      <Card>
        <SectionHeading title="Enterprise gaps" subtitle="Deliberately not built yet — see PRODUCT-ROADMAP.md Phase 10" />
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>• No SSO / company identity provider integration</li>
          <li>• No multi-tenancy / multiple organizations</li>
          <li>• No admin console</li>
          <li>• No trainer/manager assignment-management tooling (only a personal, self-selected assignment)</li>
          <li>• No production SLA or support model</li>
          <li>• No compliance certification or formal security review</li>
        </ul>
      </Card>
    </div>
  );
}
