"use client";

import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Disclaimer } from "@/components/Disclaimer";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { TextAreaField } from "@/components/FormField";
import { useBpoProjectPrep } from "@/lib/bpoProjectPrep";
import { BPO_PROJECT_PREP_FIELDS, BpoProjectPrepFieldId } from "@/lib/types";

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
      <SectionHeading
        level="h1"
        title="Real Project Prep"
        subtitle="A private worksheet for organizing your thoughts before discussing a real automation project"
      />

      <Disclaimer>
        <span className="font-medium">PRIVATE PERSONAL NOTES — stored only in this browser.</span> Do not enter
        confidential company information, credentials, customer data, internal URLs, or restricted system details.
        This worksheet is never synced to the cloud, never sent to the AI Tutor, and never shown in Analytics,
        Manager Preview, or the Pilot Report — see{" "}
        <Link href="/privacy" className="font-medium underline">
          Privacy &amp; Data Safety
        </Link>
        .
      </Disclaimer>

      <PrivacyNotice context="Use generic, non-identifying language even for your own personal notes here — write what you'd be comfortable someone else reading over your shoulder." />

      <Card>
        <SectionHeading
          title="Why this exists"
          subtitle="Working through this worksheet applies the BPO methodology to your own real situation"
        />
        <p className="text-sm text-slate-700 dark:text-slate-300">
          Before automating or improving a real process, it helps to write down what you actually know and what
          you still need to find out — the same As-Is / requirements-gathering thinking taught in the{" "}
          <Link href="/learn" className="font-medium underline">
            BPO &amp; Process Automation
          </Link>{" "}
          category on the Learn page. Keep it generic — this is a personal thinking tool, not a document meant to
          leave your browser.
          See the{" "}
          <Link href="/bpo/power-automate-cheatsheet" className="font-medium underline">
            Power Automate Cheat Sheet
          </Link>{" "}
          for quick reference while you write.
        </p>
      </Card>

      <Card>
        <SectionHeading title="Worksheet" subtitle={loaded ? "Saved automatically to this browser as you type" : "Loading…"} />
        <div className="space-y-4">
          {BPO_PROJECT_PREP_FIELDS.map((field) => (
            <TextAreaField
              key={field.id}
              label={field.label}
              value={notes[field.id as BpoProjectPrepFieldId] ?? ""}
              onChange={(v) => setField(field.id as BpoProjectPrepFieldId, v)}
              placeholder={field.placeholder}
              rows={field.id === "asIsProcess" || field.id === "desiredToBe" ? 4 : 3}
            />
          ))}
        </div>
        <div className="mt-5 flex items-center justify-end border-t border-slate-100 pt-4 dark:border-slate-800">
          <button
            type="button"
            onClick={() => {
              if (window.confirm("Clear every field in this worksheet? This can't be undone.")) clearAll();
            }}
            className="rounded-md px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950"
          >
            Clear all fields
          </button>
        </div>
      </Card>
    </div>
  );
}
