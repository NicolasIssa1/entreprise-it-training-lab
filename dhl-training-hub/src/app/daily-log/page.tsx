"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { useLocalStorageList } from "@/lib/storage";
import { seedDailyLogEntries } from "@/lib/data/seedDailyLog";
import { teamQuestions } from "@/lib/data/questions";
import { teams } from "@/lib/data/teams";
import { DailyLogEntry, TeamId } from "@/lib/types";

const TEAM_OPTIONS: { id: TeamId | "General"; label: string }[] = [
  { id: "General", label: "General / multiple teams" },
  ...teams.map((t) => ({ id: t.id, label: t.name })),
];

const EMPTY_FORM = {
  date: new Date().toISOString().slice(0, 10),
  dayNumber: 3,
  team: "infrastructure" as TeamId | "General",
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

function teamLabel(id: TeamId | "General") {
  if (id === "General") return "General";
  return teams.find((t) => t.id === id)?.name ?? id;
}

export default function DailyLogPage() {
  const { items: entries, setItems: setEntries } = useLocalStorageList<DailyLogEntry>(
    "daily-log-entries",
    seedDailyLogEntries,
  );
  const [form, setForm] = useState(EMPTY_FORM);
  const [activeQuestionsTeam, setActiveQuestionsTeam] = useState<TeamId>("infrastructure");

  function addEntry() {
    if (!form.observed && !form.learned) return;
    const entry: DailyLogEntry = { id: crypto.randomUUID(), ...form };
    setEntries([entry, ...entries]);
    setForm({ ...EMPTY_FORM, dayNumber: form.dayNumber + 1 });
  }

  function removeEntry(id: string) {
    setEntries(entries.filter((e) => e.id !== id));
  }

  const sortedEntries = [...entries].sort((a, b) => b.dayNumber - a.dayNumber);

  return (
    <div className="space-y-8">
      <SectionHeading title="Daily Log" subtitle="Journal your internship — no employee names required" />

      <Card>
        <SectionHeading title="New entry" />
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Date</label>
            <input
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
              className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Day number</label>
            <input
              type="number"
              min={1}
              value={form.dayNumber}
              onChange={(e) => setForm({ ...form, dayNumber: Number(e.target.value) })}
              className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-500">Team</label>
            <select
              value={form.team}
              onChange={(e) => setForm({ ...form, team: e.target.value as TeamId | "General" })}
              className="w-full rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            >
              {TEAM_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <FormField label="What I observed" value={form.observed} onChange={(v) => setForm({ ...form, observed: v })} />
          <FormField label="What I learned" value={form.learned} onChange={(v) => setForm({ ...form, learned: v })} />
          <FormField label="New terminology" value={form.newTerminology} onChange={(v) => setForm({ ...form, newTerminology: v })} />
          <FormField label="Tools / concepts encountered" value={form.toolsConcepts} onChange={(v) => setForm({ ...form, toolsConcepts: v })} />
          <FormField label="Questions I asked" value={form.questionsAsked} onChange={(v) => setForm({ ...form, questionsAsked: v })} />
          <FormField label="Employee answer summary" value={form.answerSummary} onChange={(v) => setForm({ ...form, answerSummary: v })} />
          <FormField label="Things I didn't understand" value={form.didNotUnderstand} onChange={(v) => setForm({ ...form, didNotUnderstand: v })} />
          <FormField label="Things to research later" value={form.toResearchLater} onChange={(v) => setForm({ ...form, toResearchLater: v })} />
          <FormField label="Practice completed" value={form.practiceCompleted} onChange={(v) => setForm({ ...form, practiceCompleted: v })} />
          <FormField label="Tomorrow's goals" value={form.tomorrowsGoals} onChange={(v) => setForm({ ...form, tomorrowsGoals: v })} />
        </div>

        <button
          onClick={addEntry}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Save entry
        </button>
      </Card>

      <div className="space-y-4">
        <SectionHeading title="Past entries" />
        {sortedEntries.map((entry) => (
          <Card key={entry.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <Badge variant="accent">Day {entry.dayNumber}</Badge>{" "}
                <Badge variant="neutral">{teamLabel(entry.team)}</Badge>
                <p className="mt-1 text-xs text-slate-500">{entry.date}</p>
              </div>
              <button
                onClick={() => removeEntry(entry.id)}
                className="text-xs text-red-500 hover:underline"
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
              className={`rounded-md border px-3 py-1.5 text-sm ${
                activeQuestionsTeam === t.id
                  ? "border-blue-600 bg-blue-600 text-white"
                  : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
              }`}
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

function FormField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-slate-500">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="w-full resize-none rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-800"
      />
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
