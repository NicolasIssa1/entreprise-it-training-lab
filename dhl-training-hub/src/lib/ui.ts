/**
 * Shared Tailwind class strings for form controls. Centralized so every input/
 * textarea/select gets the same look and — importantly — the same visible focus
 * ring (removing the default outline without replacing it is an accessibility
 * regression, so every use pairs `outline-none` with a `ring`).
 */
export const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white p-2 text-sm text-slate-900 transition-colors duration-200 placeholder:text-slate-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500";

export const textareaClass = `${inputClass} resize-none`;

/** Toggle-style buttons (team/urgency/involvement pickers, tabs). */
export function toggleButtonClass(selected: boolean) {
  return `rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
    selected
      ? "border-blue-600 bg-blue-600 text-white shadow-sm shadow-blue-900/20"
      : "border-slate-300 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
  }`;
}

export type ButtonVariant = "primary" | "secondary" | "ghost" | "destructive";
export type ButtonSize = "sm" | "md";

/**
 * Shared button look, as a class-string helper rather than a component —
 * most "buttons" in this app are actually `<Link>`s (styled as buttons) or
 * plain `<button>`s with custom onClick logic, so a class helper composes
 * into either without forcing an element-type change. See Button.tsx for a
 * thin `<button>` wrapper over this, used where a real component is handy.
 */
export function buttonClass(variant: ButtonVariant = "primary", size: ButtonSize = "md") {
  const base =
    "inline-flex items-center justify-center gap-1.5 rounded-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:cursor-not-allowed disabled:opacity-40";
  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
  };
  const variants: Record<ButtonVariant, string> = {
    primary:
      "bg-blue-600 text-white shadow-sm shadow-blue-900/20 hover:bg-blue-700 hover:shadow-md hover:shadow-blue-900/25 active:bg-blue-800",
    secondary:
      "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50 active:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
    ghost: "text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800",
    destructive: "bg-red-600 text-white shadow-sm shadow-red-900/20 hover:bg-red-700 active:bg-red-800",
  };
  return `${base} ${sizes[size]} ${variants[variant]}`;
}
