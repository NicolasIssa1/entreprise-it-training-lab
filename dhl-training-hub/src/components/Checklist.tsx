"use client";

import { useId } from "react";
import { useTeamChecklist } from "@/lib/teamChecklist";
import { SyncErrorNotice } from "@/components/SyncErrorNotice";
import { TeamId } from "@/lib/types";

export function Checklist({ teamId, items }: { teamId: TeamId; items: string[] }) {
  const { checked, toggle, syncError } = useTeamChecklist(teamId);

  return (
    <div className="space-y-3">
      <ul className="space-y-2">
        {items.map((item) => (
          <ChecklistItem key={item} label={item} checked={!!checked[item]} onToggle={() => toggle(item)} />
        ))}
      </ul>
      {syncError && <SyncErrorNotice />}
    </div>
  );
}

function ChecklistItem({
  label,
  checked,
  onToggle,
}: {
  label: string;
  checked: boolean;
  onToggle: () => void;
}) {
  const id = useId();
  return (
    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
      <input
        id={id}
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700"
      />
      <label htmlFor={id}>{label}</label>
    </li>
  );
}
