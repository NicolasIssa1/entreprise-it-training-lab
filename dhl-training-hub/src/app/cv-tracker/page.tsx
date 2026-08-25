"use client";

import { useState } from "react";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge } from "@/components/Badge";
import { Disclaimer } from "@/components/Disclaimer";
import { useLocalStorageList } from "@/lib/storage";
import { teams } from "@/lib/data/teams";
import { CvAchievement, INVOLVEMENT_LEVELS, InvolvementLevel, TeamId } from "@/lib/types";

const TEAM_OPTIONS: { id: TeamId | "General"; label: string }[] = [
  { id: "General", label: "General" },
  ...teams.map((t) => ({ id: t.id, label: t.name })),
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

const EMPTY_FORM = {
  date: new Date().toISOString().slice(0, 10),
  team: "infrastructure" as TeamId | "General",
  rawNote: "",
  involvementLevel: "Observed" as InvolvementLevel,
  skillsInvolved: "",
  whatLearned: "",
  suggestedCvWording: "",
  evidenceNotes: "",
};

function teamLabel(id: TeamId | "General") {
  if (id === "General") return "General";
  return teams.find((t) => t.id === id)?.name ?? id;
}

export default function CvTrackerPage() {
  const { items: achievements, setItems: setAchievements } = useLocalStorageList<CvAchievement>(
    "cv-achievements",
    [],
  );
  const [form, setForm] = useState(EMPTY_FORM);

  function addAchievement() {
    if (!form.rawNote) return;
    const achievement: CvAchievement = { id: crypto.randomUUID(), ...form };
    setAchievements([achievement, ...achievements]);
    setForm(EMPTY_FORM);
  }

  function removeAchievement(id: string) {
    setAchievements(achievements.filter((a) => a.id !== id));
  }

  return (
    <div className="space-y-8">
      <SectionHeading title="CV Achievement Tracker" subtitle="Honest, evidence-based CV bullets — never exaggerated" />
      <Disclaimer>
        Never overstate what actually happened. If you only observed something, it must
        never be logged or worded as if you implemented, built, or performed it.
      </Disclaimer>

      <Card>
        <SectionHeading title="New achievement" />
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

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Raw note — what actually happened
            </label>
            <textarea
              value={form.rawNote}
              onChange={(e) => setForm({ ...form, rawNote: e.target.value })}
              rows={2}
              placeholder="e.g. Watched how the Infrastructure team manages tickets."
              className="w-full resize-none rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Level of involvement — be honest
            </label>
            <div className="flex flex-wrap gap-2">
              {INVOLVEMENT_LEVELS.map((level) => (
                <button
                  key={level}
                  onClick={() => setForm({ ...form, involvementLevel: level })}
                  className={`rounded-md border px-3 py-1.5 text-sm ${
                    form.involvementLevel === level
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">Skills involved</label>
            <textarea
              value={form.skillsInvolved}
              onChange={(e) => setForm({ ...form, skillsInvolved: e.target.value })}
              rows={2}
              className="w-full resize-none rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-500">What I learned</label>
            <textarea
              value={form.whatLearned}
              onChange={(e) => setForm({ ...form, whatLearned: e.target.value })}
              rows={2}
              className="w-full resize-none rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-500">
              Potential professional CV wording{" "}
              <span className="font-normal text-slate-400">(must match involvement level)</span>
            </label>
            <textarea
              value={form.suggestedCvWording}
              onChange={(e) => setForm({ ...form, suggestedCvWording: e.target.value })}
              rows={2}
              placeholder="e.g. Developed familiarity with enterprise IT service-management workflows, including incident assignment, escalation and resolution tracking."
              className="w-full resize-none rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-500">Evidence / notes</label>
            <textarea
              value={form.evidenceNotes}
              onChange={(e) => setForm({ ...form, evidenceNotes: e.target.value })}
              rows={2}
              className="w-full resize-none rounded-md border border-slate-300 bg-white p-2 text-sm dark:border-slate-700 dark:bg-slate-800"
            />
          </div>
        </div>

        <button
          onClick={addAchievement}
          className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Save achievement
        </button>
      </Card>

      <div className="space-y-4">
        <SectionHeading title="Logged achievements" />
        {achievements.length === 0 && (
          <p className="text-sm text-slate-500">No achievements logged yet.</p>
        )}
        {achievements.map((a) => (
          <Card key={a.id}>
            <div className="flex items-start justify-between gap-2">
              <div>
                <Badge variant={INVOLVEMENT_BADGE[a.involvementLevel]}>{a.involvementLevel}</Badge>{" "}
                <Badge variant="neutral">{teamLabel(a.team)}</Badge>
                <p className="mt-1 text-xs text-slate-500">{a.date}</p>
              </div>
              <button onClick={() => removeAchievement(a.id)} className="text-xs text-red-500 hover:underline">
                Delete
              </button>
            </div>
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-300">
              <span className="font-medium">Raw: </span>
              {a.rawNote}
            </p>
            {a.suggestedCvWording && (
              <p className="mt-2 rounded-md bg-slate-50 p-2 text-sm italic text-slate-700 dark:bg-slate-800 dark:text-slate-300">
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
