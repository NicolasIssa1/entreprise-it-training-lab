/**
 * Shared Tailwind class strings for form controls. Centralized so every input/
 * textarea/select gets the same look and — importantly — the same visible focus
 * ring (removing the default outline without replacing it is an accessibility
 * regression, so every use pairs `outline-none` with a `ring`).
 */
export const inputClass =
  "w-full rounded-md border border-slate-300 bg-white p-2 text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100";

export const textareaClass = `${inputClass} resize-none`;

/** Toggle-style buttons (team/urgency/involvement pickers, tabs). */
export function toggleButtonClass(selected: boolean) {
  return `rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
    selected
      ? "border-blue-600 bg-blue-600 text-white"
      : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
  }`;
}
