"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/Card";
import { SectionHeading } from "@/components/SectionHeading";

/** Simple free-text notes/reflection boxes, persisted locally so they survive a refresh. */
export function DashboardNotes() {
  const [notes, setNotes] = useState("");
  const [reflection, setReflection] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // One-time hydration read: localStorage isn't available during SSR, so state
    // starts empty (matching the server-rendered output) and is patched here,
    // after mount, with whatever was actually saved.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setNotes(window.localStorage.getItem("dashboard-quick-notes") ?? "");
    setReflection(window.localStorage.getItem("dashboard-reflection") ?? "");
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem("dashboard-quick-notes", notes);
  }, [notes, loaded]);

  useEffect(() => {
    if (!loaded) return;
    window.localStorage.setItem("dashboard-reflection", reflection);
  }, [reflection, loaded]);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <SectionHeading title="Quick notes" subtitle="Jot anything down as it happens today" />
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={6}
          placeholder="e.g. Team mentioned they use a shared ticket dashboard..."
          className="w-full resize-none rounded-md border border-slate-300 bg-white p-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </Card>
      <Card>
        <SectionHeading title="End-of-day reflection" subtitle="What went well? What's still unclear?" />
        <textarea
          value={reflection}
          onChange={(e) => setReflection(e.target.value)}
          rows={6}
          placeholder="e.g. I understand the ticket lifecycle now, but still unsure how urgency is decided..."
          className="w-full resize-none rounded-md border border-slate-300 bg-white p-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
        />
      </Card>
    </div>
  );
}
