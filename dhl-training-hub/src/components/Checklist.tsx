"use client";

import { useId } from "react";

export function Checklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <ChecklistItem key={item} label={item} />
      ))}
    </ul>
  );
}

function ChecklistItem({ label }: { label: string }) {
  const id = useId();
  return (
    <li className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
      <input
        id={id}
        type="checkbox"
        className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700"
      />
      <label htmlFor={id}>{label}</label>
    </li>
  );
}
