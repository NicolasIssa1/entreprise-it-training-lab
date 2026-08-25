"use client";

import { useId } from "react";
import { useLocalStorageState } from "@/lib/storage";
import { TeamId } from "@/lib/types";

const isChecklistRecord = (value: unknown): value is Record<string, boolean> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Learning checklist with persisted checked state. Storage is scoped per team via
 * a distinct key (`checklist-<teamId>`) so Infrastructure/Applications/Support &
 * Network each own their own record and can never overwrite one another.
 */
export function Checklist({ teamId, items }: { teamId: TeamId; items: string[] }) {
  const { state: checked, setState: setChecked } = useLocalStorageState<Record<string, boolean>>(
    `checklist-${teamId}`,
    {},
    isChecklistRecord,
  );

  function toggle(item: string) {
    setChecked({ ...checked, [item]: !checked[item] });
  }

  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <ChecklistItem key={item} label={item} checked={!!checked[item]} onToggle={() => toggle(item)} />
      ))}
    </ul>
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
