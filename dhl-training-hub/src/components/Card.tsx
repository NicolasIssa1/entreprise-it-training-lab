import { ReactNode } from "react";

/**
 * The one shared surface primitive — every content card in the app renders
 * through this (see its ~40 call sites). Keeping the visual system here means
 * a single change (radius, shadow, hover) cascades everywhere instead of
 * every page inventing its own card look.
 *
 * `interactive` is for cards that are themselves a clickable target (usually
 * wrapped in a `<Link>`) — it adds a restrained lift/shadow/border hover so a
 * clickable card reads as clickable, without turning static content cards
 * (most of the app) into something that jitters on hover for no reason.
 */
export function Card({
  children,
  className = "",
  interactive = false,
  id,
}: {
  children: ReactNode;
  className?: string;
  interactive?: boolean;
  id?: string;
}) {
  return (
    <div
      id={id}
      className={`rounded-2xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-900/[0.03] transition-all duration-200 dark:border-slate-800 dark:bg-slate-900 dark:shadow-none ${
        interactive
          ? "hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-950/[0.06] dark:hover:border-blue-800/70"
          : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
