"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { PrivacyNotice } from "@/components/PrivacyNotice";
import { FormSection } from "@/components/FormSection";
import { TextAreaField, InputField, SelectField } from "@/components/FormField";
import { useLocalStorageList } from "@/lib/storage";
import { seedDailyLogEntries } from "@/lib/data/seedDailyLog";
import { teamQuestions } from "@/lib/data/questions";
import { teams, getTeamLabel } from "@/lib/data/teams";
import { internshipState } from "@/lib/data/internshipState";
import { toggleButtonClass } from "@/lib/ui";
import { DailyLogEntry, TeamId } from "@/lib/types";

const TEAM_OPTIONS: { value: string; label: string }[] = [
  { value: "General", label: "General / multiple teams" },
  ...teams.map((t) => ({ value: t.id, label: t.name })),
];

// Defaults come from the shared internship state (see internshipState.ts) — never
// hardcode day/team here. Still fully editable per entry via the form fields below.
function emptyForm() {
  return {
    date: internshipState.currentDate,
    dayNumber: internshipState.currentDayNumber,
    team: internshipState.currentTeam as TeamId | "General",
    observed: "",
    learned: "",
    newTerminology: "",
    toolsConcepts: "",
    questionsAsked: "",
    answerSummary: "",
    didNotUnderstand: "",
    toResearchLater: "",
    practiceCompleted: "",
    tomorrowsGoals: "",
  };
}

export default function DailyLogPage() {
  const { items: entries, setItems: setEntries } = useLocalStorageList<DailyLogEntry>(
    "daily-log-entries",
    seedDailyLogEntries,
  );
  const [form, setForm] = useState(emptyForm);
  const [activeQuestionsTeam, setActiveQuestionsTeam] = useState<TeamId>(internshipState.currentTeam);

  function addEntry() {
    if (!form.observed && !form.learned) return;
    const entry: DailyLogEntry = { id: crypto.randomUUID(), ...form };
    setEntries([entry, ...entries]);
    setForm(emptyForm());
  }

  function removeEntry(id: string) {
    setEntries(entries.filter((e) => e.id !== id));
  }

  const sortedEntries = [...entries].sort((a, b) => b.dayNumber - a.dayNumber);

  return (
    <div className="space-y-8">
      <SectionHeading title="Daily Log" subtitle="Journal your internship — no employee names required" />
      <PrivacyNotice context="Personal observations are welcome, but exclude anything restricted or confidential." />

      <Card>
        <SectionHeading title="New entry" />
        <div className="space-y-4">
          <FormSection title="When">
            <InputField label="Date" type="date" value={form.date} onChange={(v) => setForm({ ...form, date: v })} />
            <InputField
              label="Day number"
              type="number"
              value={form.dayNumber}
              onChange={(v) => setForm({ ...form, dayNumber: Number(v) })}
            />
            <div className="sm:col-span-2">
              <SelectField
                label="Team"
                value={form.team}
                onChange={(v) => setForm({ ...form, team: v as TeamId | "General" })}
                options={TEAM_OPTIONS}
              />
            </div>
          </FormSection>

          <FormSection title="What happened today">
            <TextAreaField label="What I observed" value={form.observed} onChange={(v) => setForm({ ...form, observed: v })} />
            <TextAreaField label="What I learned" value={form.learned} onChange={(v) => setForm({ ...form, learned: v })} />
          </FormSection>

          <FormSection title="Knowledge">
            <TextAreaField label="New terminology" value={form.newTerminology} onChange={(v) => setForm({ ...form, newTerminology: v })} />
            <TextAreaField label="Tools / concepts encountered" value={form.toolsConcepts} onChange={(v) => setForm({ ...form, toolsConcepts: v })} />
          </FormSection>

          <FormSection title="Conversations">
            <TextAreaField label="Questions I asked" value={form.questionsAsked} onChange={(v) => setForm({ ...form, questionsAsked: v })} />
            <TextAreaField label="Employee answer summary" value={form.answerSummary} onChange={(v) => setForm({ ...form, answerSummary: v })} />
          </FormSection>

          <FormSection title="Follow-up">
            <TextAreaField label="Things I didn't understand" value={form.didNotUnderstand} onChange={(v) => setForm({ ...form, didNotUnderstand: v })} />
            <TextAreaField label="Things to research later" value={form.toResearchLater} onChange={(v) => setForm({ ...form, toResearchLater: v })} />
            <TextAreaField label="Practice completed" value={form.practiceCompleted} onChange={(v) => setForm({ ...form, practiceCompleted: v })} />
            <TextAreaField label="Tomorrow's goals" value={form.tomorrowsGoals} onChange={(v) => setForm({ ...form, tomorrowsGoals: v })} />
          </FormSection>
        </div>

        <button
          onClick={addEntry}
          className="mt-5 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
        >
          Save entry
        </button>
      </Card>

      <div className="space-y-4">
        <SectionHeading title="Past entries" />
        {sortedEntries.length === 0 && (
          <p className="text-sm text-slate-500">
            No daily log entries yet. Save your first entry above once you have
            something worth recording.
          </p>
        )}
        {sortedEntries.map((entry) => (
          <Card key={entry.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <Badge variant="accent">Day {entry.dayNumber}</Badge>{" "}
                <Badge variant="neutral">{getTeamLabel(entry.team)}</Badge>
                <p className="mt-1 text-xs text-slate-500">{entry.date}</p>
              </div>
              <button
                onClick={() => removeEntry(entry.id)}
                className="text-xs text-red-500 hover:underline focus:outline-none focus:ring-2 focus:ring-red-400/40"
              >
                Delete
              </button>
            </div>
            <div className="mt-3 grid gap-2 text-sm text-slate-700 dark:text-slate-300 sm:grid-cols-2">
              <EntryField label="Observed" value={entry.observed} />
              <EntryField label="Learned" value={entry.learned} />
              <EntryField label="New terminology" value={entry.newTerminology} />
              <EntryField label="Tools/concepts" value={entry.toolsConcepts} />
              <EntryField label="Questions asked" value={entry.questionsAsked} />
              <EntryField label="Answer summary" value={entry.answerSummary} />
              <EntryField label="Didn't understand" value={entry.didNotUnderstand} />
              <EntryField label="To research later" value={entry.toResearchLater} />
              <EntryField label="Practice completed" value={entry.practiceCompleted} />
              <EntryField label="Tomorrow's goals" value={entry.tomorrowsGoals} />
            </div>
          </Card>
        ))}
      </div>

      <Card>
        <SectionHeading title="Questions to ask" subtitle="Reference list by team — pick before your next conversation" />
        <div className="mb-3 flex flex-wrap gap-2">
          {teams.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveQuestionsTeam(t.id)}
              aria-pressed={activeQuestionsTeam === t.id}
              className={toggleButtonClass(activeQuestionsTeam === t.id)}
            >
              {t.name}
            </button>
          ))}
        </div>
        <ul className="space-y-2">
          {teamQuestions
            .find((q) => q.team === activeQuestionsTeam)
            ?.questions.map((q) => (
              <li key={q} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
                {q}
              </li>
            ))}
        </ul>
      </Card>
    </div>
  );
}

function EntryField({ label, value }: { label: string; value: string }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-medium text-slate-400">{label}</p>
      <p>{value}</p>
    </div>
  );
}
