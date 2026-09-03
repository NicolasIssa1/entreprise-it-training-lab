"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHeader } from "@/components/PageHeader";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { TextAreaField } from "@/components/FormField";
import { FlowDiagram } from "@/components/FlowDiagram";
import { AskTutorLink } from "@/components/AskTutorLink";
import { ShieldIcon } from "@/components/icons";
import { useBpoProjectPrep } from "@/lib/bpoProjectPrep";
import { BPO_PROJECT_PREP_FIELDS, BpoProjectPrepFieldId } from "@/lib/types";

const LIFECYCLE_STEPS = ["Problem", "As-Is", "Pain Points", "Root Cause", "To-Be", "Automation", "Testing", "Monitoring"];

/**
 * Real Project Prep — a PRIVATE, personal worksheet for organizing thoughts before
 * discussing a real work automation (e.g. with a BPO colleague), NOT a DHL-specific
 * feature. Deliberately local-only (see lib/bpoProjectPrep.ts): never synced to
 * Supabase, never sent to the AI Tutor, and never surfaced in Analytics, Manager
 * Preview, or the Pilot Report — see root CLAUDE.md's confidentiality rules.
 */
export default function BpoProjectPrepPage() {
  const { notes, setField, clearAll, loaded } = useBpoProjectPrep();

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="BPO & Process Automation"
        title="Real Project Prep"
        description="A private worksheet for organizing your thoughts before discussing a real automation project — turn a business problem into a structured, automatable workflow."
        accent="from-violet-500/15 via-purple-500/10 to-transparent"
      />

      <div className="rounded-2xl border border-rose-200 bg-rose-50/70 px-4 py-3.5 shadow-sm dark:border-rose-900 dark:bg-rose-950/30">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-300">
            <ShieldIcon size={16} />
          </span>
          <p className="text-sm text-rose-900 dark:text-rose-200">
            <span className="font-semibold">PRIVATE PERSONAL NOTES — stored only in this browser.</span> Do not enter
            confidential company information, credentials, customer data, internal URLs, or restricted system
            details. This worksheet is never synced to the cloud, never sent to the AI Tutor, and never shown in
            Analytics, Manager Preview, or the Pilot Report — see{" "}
            <Link href="/privacy" className="font-medium underline">
              Privacy &amp; Data Safety
            </Link>
            .
          </p>
        </div>
      </div>

      <PrivacyNotice context="Use generic, non-identifying language even for your own personal notes here — write what you'd be comfortable someone else reading over your shoulder." />

      <Card className="border-violet-200 bg-gradient-to-br from-violet-50/70 to-transparent dark:border-violet-900 dark:from-violet-950/20">
        <SectionHeading
          title="The BPO & Automation lifecycle"
          subtitle="This worksheet's sections map onto this lifecycle — working through it applies the methodology to your own real situation"
        />
        <div className="overflow-x-auto pb-1">
          <FlowDiagram steps={LIFECYCLE_STEPS} accent="violet" />
        </div>
        <p className="mt-4 text-sm text-slate-700 dark:text-slate-300">
          See the full lessons behind each stage in the{" "}
          <Link href="/learn" className="font-medium text-violet-700 underline dark:text-violet-400">
            BPO &amp; Process Automation
          </Link>{" "}
          category, and keep the{" "}
          <Link href="/bpo/power-automate-cheatsheet" className="font-medium text-violet-700 underline dark:text-violet-400">
            Power Automate Cheat Sheet
          </Link>{" "}
          open for quick reference while you write.
        </p>
        <div className="mt-3">
          <AskTutorLink
            params={{
              mode: "tutor",
              prompt:
                "How can I decide whether a business process is a good candidate for Power Automate, and what should I map out about the As-Is process first?",
            }}
            variant="button"
          >
            Ask Tutor about mapping this process →
          </AskTutorLink>
        </div>
      </Card>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <SectionHeading title="Worksheet" subtitle={loaded ? "Saved automatically to this browser as you type" : "Loading…"} />
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Clear every field in this worksheet? This can't be undone.")) clearAll();
            }}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition-colors duration-200 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
          >
            Clear all fields
          </button>
        </div>

        <div className="relative space-y-3">
          <div className="absolute left-[19px] top-2 bottom-2 hidden w-px bg-violet-200 sm:block dark:bg-violet-900" aria-hidden="true" />
          {BPO_PROJECT_PREP_FIELDS.map((field, i) => (
            <div key={field.id} className="relative flex gap-4">
              <span className="relative z-10 mt-1 hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-violet-200 bg-white text-sm font-bold text-violet-600 shadow-sm sm:flex dark:border-violet-900 dark:bg-slate-900 dark:text-violet-400">
                {String(i + 1).padStart(2, "0")}
              </span>
              <Card className="flex-1">
                <div className="mb-2 flex items-center gap-2 sm:hidden">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-xs font-bold text-violet-600 dark:bg-violet-950 dark:text-violet-400">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <TextAreaField
                  label={field.label}
                  value={notes[field.id as BpoProjectPrepFieldId] ?? ""}
                  onChange={(v) => setField(field.id as BpoProjectPrepFieldId, v)}
                  placeholder={field.placeholder}
                  rows={field.id === "asIsProcess" || field.id === "desiredToBe" ? 4 : 3}
                />
              </Card>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
