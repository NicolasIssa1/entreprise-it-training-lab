import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Disclaimer } from "@/components/Disclaimer";
import { displayProductName } from "@/lib/product";

/**
 * Privacy / Data Safety page (Phase 9 Part L) — a product-level, plain-English
 * explanation of what's stored, what's deliberately not collected, and the AI
 * Tutor's data boundary. Not a fabricated legal policy — see root CLAUDE.md's
 * confidentiality rules, which this page describes rather than invents.
 */
export default function PrivacyPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">Privacy &amp; Data Safety</h1>
        <p className="mt-1 text-slate-600 dark:text-slate-400">
          A plain-English explanation of what {displayProductName} stores, what it deliberately never collects, and
          what reaches the AI Tutor.
        </p>
      </div>

      <Disclaimer>
        This page describes how the product is actually built — it is not a formal legal policy. See{" "}
        <Link href="/pilot/readiness" className="font-medium underline">
          Pilot Readiness
        </Link>{" "}
        for the honest gap list before any real deployment.
      </Disclaimer>

      <Card>
        <SectionHeading title="Data stored" subtitle="Local browser storage always; optionally synced to a private cloud account" />
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>• Learning topic completion, quiz attempts, and Advanced Investigation progress/history</li>
          <li>• Daily Log journal entries</li>
          <li>• CV Achievement Tracker entries</li>
          <li>• AI Tutor chat history, if you use it</li>
          <li>• A selected Training Assignment and onboarding preferences (goal, focus area, experience level)</li>
        </ul>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          All of the above lives in your browser&rsquo;s local storage. If a Supabase account is configured and you
          sign in, the same data also syncs to a private, Row-Level-Security-protected account only you can read.
        </p>
      </Card>

      <Card>
        <SectionHeading title="Data NOT intentionally collected" />
        <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
          <li>• Real employer/company credentials</li>
          <li>• Real customer information</li>
          <li>• Real shipment or customer records</li>
          <li>• Real ticket contents or ticket numbers</li>
          <li>• Internal URLs or IP addresses</li>
          <li>• Screenshots</li>
          <li>• Confidential or internal documentation</li>
        </ul>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          Every ticket, quiz question, and investigation scenario in this application is fictional and generic —
          written to read as &ldquo;could apply to any large company,&rdquo; never as insider information about any
          specific organization.
        </p>
      </Card>

      <Card>
        <SectionHeading title="AI boundary" subtitle="What automatically reaches the AI Tutor, and what never does" />
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Only safe, structured curriculum and progress context is automatically sent to the AI Tutor: relevant Learn
          topic text, which lessons/assessments/investigations you&rsquo;ve completed, your skill levels, and — if set
          — your active Training Assignment name and onboarding focus area.
        </p>
        <p className="mt-3 text-sm font-medium text-slate-900 dark:text-slate-100">
          Daily Log entries and CV Tracker free text are excluded automatically — the Tutor never receives them, your
          name, or your email, under any mode.
        </p>
        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
          See <code className="rounded bg-slate-100 px-1 py-0.5 dark:bg-slate-800">docs/AI-TUTOR.md</code> in the
          repository for the full technical data-flow writeup.
        </p>
      </Card>

      <Card>
        <SectionHeading title="Analytics / Manager Preview boundary" />
        <p className="text-sm text-slate-700 dark:text-slate-300">
          The Analytics, Analytics Summary, and Manager Preview pages only ever read structured evidence (completed
          topics, quiz attempts, investigation completions) — they never import or display Daily Log entries, CV
          Achievement descriptions, or AI Tutor conversation content. Manager Preview shows only your own data; there
          is no multi-user manager account yet.
        </p>
      </Card>
    </div>
  );
}
