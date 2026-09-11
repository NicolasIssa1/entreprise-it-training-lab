"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { EmptyState } from "@/components/EmptyState";
import { buttonClass } from "@/lib/ui";
import { CvEvidenceItem } from "@/lib/types";

function EvidenceCard({ item }: { item: CvEvidenceItem }) {
  const [showStory, setShowStory] = useState(false);

  return (
    <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-800">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{item.title}</p>
          <Badge variant="accent">Portfolio / simulated project</Badge>
        </div>
        <span className="text-xs text-slate-500 dark:text-slate-400">Score {item.score}/100</span>
      </div>

      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{item.cvWording}</p>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {item.toolsOrSkills.map((s) => (
          <Badge key={s} variant="neutral">
            {s}
          </Badge>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-3">
        <Link href={item.addToCvHref} className={buttonClass("secondary", "sm")}>
          Add to CV Tracker
        </Link>
        <button
          type="button"
          onClick={() => setShowStory((v) => !v)}
          className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400"
        >
          {showStory ? "Hide interview story" : "View interview story"}
        </button>
      </div>

      {showStory && (
        <dl className="mt-3 space-y-2 rounded-lg border border-slate-200 bg-slate-50/60 p-3 text-sm dark:border-slate-800 dark:bg-slate-900/40">
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Situation</dt>
            <dd className="mt-0.5 text-slate-700 dark:text-slate-300">{item.interviewStory.situation}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Task</dt>
            <dd className="mt-0.5 text-slate-700 dark:text-slate-300">{item.interviewStory.task}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Action</dt>
            <dd className="mt-0.5 text-slate-700 dark:text-slate-300">{item.interviewStory.action}</dd>
          </div>
          <div>
            <dt className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Result</dt>
            <dd className="mt-0.5 text-slate-700 dark:text-slate-300">{item.interviewStory.result}</dd>
          </div>
        </dl>
      )}
    </div>
  );
}

/** Structured CV/Portfolio Evidence (Phase 11) — one card per completed
 * Enterprise Project, always labeled "Portfolio / simulated project" (never
 * implying real employment, per root CLAUDE.md's CV honesty rule). The
 * interview story is a STAR-format narrative built entirely from the
 * scenario's own static content plus the learner's real score — see
 * lib/cvEvidence.ts. */
export function CvEvidencePanel({ items }: { items: CvEvidenceItem[] }) {
  return (
    <Card>
      <SectionHeading title="CV Evidence & Interview Prep" subtitle="Structured, honest evidence from your completed Enterprise Projects" />
      {items.length === 0 ? (
        <EmptyState
          title="No project evidence yet"
          description="Complete an Enterprise Project in the Automation Lab to generate structured CV wording and an interview-ready story."
          action={
            <Link href="/projects" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
              Browse Enterprise Projects →
            </Link>
          }
        />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <EvidenceCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </Card>
  );
}
