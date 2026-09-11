"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { PageHeader } from "@/components/PageHeader";
import { Badge } from "@/components/Badge";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { Disclaimer } from "@/components/Disclaimer";
import { FormSection } from "@/components/FormSection";
import { TextAreaField, InputField, SelectField } from "@/components/FormField";
import { SyncErrorNotice } from "@/components/SyncErrorNotice";
import { EmptyState } from "@/components/EmptyState";
import { useCvAchievements } from "@/lib/cvAchievements";
import { teams, getTeamLabel } from "@/lib/data/teams";
import { internshipState, trainingCalendar } from "@/lib/data/internshipState";
import { useInternshipProgress } from "@/lib/useInternshipProgress";
import { getAutomationLabScenarioById } from "@/lib/data/automationLab";
import { INVOLVEMENT_HELP, checkWordingAgainstLevel } from "@/lib/involvementHelp";
import { toggleButtonClass } from "@/lib/ui";
import { CvAchievement, INVOLVEMENT_LEVELS, InvolvementLevel, TeamId } from "@/lib/types";

const TEAM_OPTIONS: { value: string; label: string }[] = [
  { value: "General", label: "General" },
  ...teams.map((t) => ({ value: t.id, label: t.name })),
];

const INVOLVEMENT_BADGE: Record<InvolvementLevel, "neutral" | "accent" | "success" | "warning"> = {
  Observed: "neutral",
  Learned: "neutral",
  Assisted: "accent",
  Participated: "accent",
  Performed: "warning",
  Built: "success",
  Implemented: "success",
};

// date starts blank — a deliberately generic, SSR-safe default that resolves
// to today live at render time (see CvTrackerContent's effectiveDate) once
// the learner hasn't overridden it.
function emptyForm() {
  return {
    date: "",
    team: internshipState.currentTeam as TeamId | "General",
    rawNote: "",
    involvementLevel: "Observed" as InvolvementLevel,
    skillsInvolved: "",
    whatLearned: "",
    suggestedCvWording: "",
    evidenceNotes: "",
    source: undefined as CvAchievement["source"],
  };
}

/** Prefills the new-achievement form from a completed Enterprise Project (see
 * AutomationLabResult's "Add to CV Tracker" link, ?prefillProject=<scenarioId>
 * &attemptScore=<n>) — same query-param prefill pattern the Learn topic page
 * already uses for Daily Log's ?research=. Never auto-saves: the learner still
 * reviews/edits and clicks "Save achievement" themselves. */
function prefillFromProject(scenarioId: string, attemptScore: string | null) {
  const scenario = getAutomationLabScenarioById(scenarioId);
  if (!scenario || !scenario.isEnterpriseProject) return null;
  const score = attemptScore ? Number(attemptScore) : undefined;
  const base = emptyForm();
  return {
    ...base,
    // Deliberately "General", not scenario.likelyTeams[0] — this was a
    // self-directed portfolio build, not internship work done alongside a
    // real team, and the team field elsewhere in this tracker represents
    // actual internship involvement. Picking a team here would misleadingly
    // read as "I worked with the Applications team on this."
    team: "General" as TeamId | "General",
    rawNote: `Completed the "${scenario.title}" Enterprise Project in the Automation Lab.`,
    involvementLevel: "Built" as InvolvementLevel,
    skillsInvolved: (scenario.skillsDemonstrated ?? []).join(", "),
    whatLearned: scenario.learningObjectives.join(" "),
    suggestedCvWording: scenario.cvDescription ?? "",
    evidenceNotes: `Completed in the Enterprise Automation Lab — simulated training project${score !== undefined && !Number.isNaN(score) ? `, score ${score}/100` : ""}.`,
    source: "portfolio-project" as CvAchievement["source"],
  };
}

export default function CvTrackerPage() {
  return (
    <Suspense fallback={null}>
      <CvTrackerContent />
    </Suspense>
  );
}

function CvTrackerContent() {
  const searchParams = useSearchParams();
  const prefillProjectId = searchParams.get("prefillProject");
  const attemptScore = searchParams.get("attemptScore");

  const { achievements, addAchievement, removeAchievement, syncError } = useCvAchievements();
  const { progress } = useInternshipProgress(trainingCalendar);
  const [form, setForm] = useState(() => (prefillProjectId && prefillFromProject(prefillProjectId, attemptScore)) || emptyForm());

  // form.date starts "" and only becomes non-empty once explicitly edited —
  // so the effective date is simply "their choice, or today if they haven't
  // chosen one," derived fresh each render rather than copied into state via
  // an effect (see daily-log/page.tsx's identical pattern for the full
  // rationale).
  const effectiveDate = form.date || progress?.today || "";

  function handleAddAchievement() {
    if (!form.rawNote) return;
    const achievement: CvAchievement = { id: crypto.randomUUID(), ...form, date: effectiveDate };
    addAchievement(achievement);
    setForm(emptyForm());
  }

  const wordingWarning = checkWordingAgainstLevel(form.suggestedCvWording, form.involvementLevel);

  return (
    <div className="space-y-8">
      <PageHeader eyebrow="CV Tracker" title="Turn today's work into honest CV bullets." description="Evidence-based CV wording, matched to how involved you actually were — never exaggerated." accent="from-violet-500/15 via-indigo-500/10 to-transparent" />
      <PrivacyNotice context="Achievements should reflect your own honest involvement, without confidential specifics." />
      <Disclaimer>
        Never overstate what actually happened. If you only observed something, it must
        never be logged or worded as if you implemented, built, or performed it.
      </Disclaimer>

      <Card>
        <SectionHeading title="New achievement" />
        {form.source === "portfolio-project" && (
          <div className="mb-4 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 dark:border-violet-900 dark:bg-violet-950/40">
            <Badge variant="accent">Portfolio / simulated project</Badge>
            <p className="mt-1.5 text-xs text-violet-800 dark:text-violet-300">
              Prefilled from a completed Automation Lab Enterprise Project — not real internship work. Review and
              edit before saving.
            </p>
          </div>
        )}
        <div className="space-y-4">
          <FormSection title="When">
            <InputField label="Date" type="date" value={effectiveDate} onChange={(v) => setForm({ ...form, date: v })} />
            <SelectField
              label="Team"
              value={form.team}
              onChange={(v) => setForm({ ...form, team: v as TeamId | "General" })}
              options={TEAM_OPTIONS}
            />
          </FormSection>

          <FormSection title="What happened">
            <div className="sm:col-span-2">
              <TextAreaField
                label="Raw note — what actually happened"
                value={form.rawNote}
                onChange={(v) => setForm({ ...form, rawNote: v })}
                placeholder="e.g. Watched how the Infrastructure team manages tickets."
              />
            </div>
          </FormSection>

          <FormSection title="Level of involvement — be honest">
            <div className="sm:col-span-2">
              <div className="flex flex-wrap gap-2">
                {INVOLVEMENT_LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setForm({ ...form, involvementLevel: level })}
                    aria-pressed={form.involvementLevel === level}
                    title={INVOLVEMENT_HELP[level]}
                    className={toggleButtonClass(form.involvementLevel === level)}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="font-medium">{form.involvementLevel}:</span>{" "}
                {INVOLVEMENT_HELP[form.involvementLevel]}
              </p>
            </div>
          </FormSection>

          <FormSection title="Reflection">
            <TextAreaField label="Skills involved" value={form.skillsInvolved} onChange={(v) => setForm({ ...form, skillsInvolved: v })} />
            <TextAreaField label="What I learned" value={form.whatLearned} onChange={(v) => setForm({ ...form, whatLearned: v })} />
            <div className="sm:col-span-2">
              <TextAreaField
                label="Potential professional CV wording (must match involvement level)"
                value={form.suggestedCvWording}
                onChange={(v) => setForm({ ...form, suggestedCvWording: v })}
                placeholder="e.g. Developed familiarity with enterprise IT service-management workflows, including incident assignment, escalation and resolution tracking."
                hint={wordingWarning ?? undefined}
              />
              {wordingWarning && (
                <p className="mt-1 text-xs font-medium text-amber-600 dark:text-amber-400">⚠ {wordingWarning}</p>
              )}
            </div>
            <div className="sm:col-span-2">
              <TextAreaField label="Evidence / notes" value={form.evidenceNotes} onChange={(v) => setForm({ ...form, evidenceNotes: v })} />
            </div>
          </FormSection>
        </div>

        <button
          onClick={handleAddAchievement}
          className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          Save achievement
        </button>
        {syncError && (
          <div className="mt-3">
            <SyncErrorNotice />
          </div>
        )}
      </Card>

      <div className="space-y-4">
        <SectionHeading title="Logged achievements" />
        {achievements.length === 0 && (
          <EmptyState
            title="No achievements recorded yet"
            description="Add your first internship activity above when you have something worth tracking."
          />
        )}
        {achievements.map((a) => (
          <Card key={a.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <Badge variant={INVOLVEMENT_BADGE[a.involvementLevel]}>{a.involvementLevel}</Badge>{" "}
                <Badge variant="neutral">{getTeamLabel(a.team)}</Badge>{" "}
                {a.source === "portfolio-project" && <Badge variant="accent">Portfolio / simulated project</Badge>}
                <p className="mt-1 text-xs text-slate-500">{a.date}</p>
              </div>
              <button
                onClick={() => removeAchievement(a.id)}
                className="text-xs text-red-500 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400/40"
              >
                Delete
              </button>
            </div>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
              <span className="font-medium">Raw: </span>
              {a.rawNote}
            </p>
            {a.suggestedCvWording && (
              <p className="mt-2 rounded-lg bg-slate-50 p-2 text-sm italic text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                &ldquo;{a.suggestedCvWording}&rdquo;
              </p>
            )}
            <div className="mt-2 grid gap-1 text-xs text-slate-500 sm:grid-cols-2">
              {a.skillsInvolved && <p><span className="font-medium">Skills: </span>{a.skillsInvolved}</p>}
              {a.whatLearned && <p><span className="font-medium">Learned: </span>{a.whatLearned}</p>}
              {a.evidenceNotes && <p className="sm:col-span-2"><span className="font-medium">Evidence: </span>{a.evidenceNotes}</p>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
