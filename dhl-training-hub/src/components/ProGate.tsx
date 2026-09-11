import { ReactNode } from "react";
import Link from "next/link";
import { Badge } from "@/components/Badge";
import { LockIcon } from "@/components/icons";
import { ProductTier } from "@/lib/types";
import { TIER_LABELS } from "@/lib/entitlements";

/**
 * A tasteful, restrained locked-state wrapper (Phase 11) — no upgrade-popup
 * clutter, no aggressive modal, no repeated nagging. Shows the feature's
 * title/description and what tier unlocks it, with one calm link to /pricing
 * (an informational tier comparison — there is no real payment flow yet, see
 * root CLAUDE.md's Phase 11 section). Renders children directly, unwrapped,
 * once unlocked.
 */
export function ProGate({
  unlocked,
  requiredTier,
  title,
  description,
  children,
}: {
  unlocked: boolean;
  requiredTier: ProductTier;
  title: string;
  description: string;
  children: ReactNode;
}) {
  if (unlocked) return <>{children}</>;

  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-5 py-8 text-center dark:border-slate-700 dark:bg-slate-900/40">
      <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
        <LockIcon size={18} />
      </span>
      <p className="mt-3 text-sm font-medium text-slate-700 dark:text-slate-300">{title}</p>
      <p className="mx-auto mt-1.5 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
      <div className="mt-4 flex items-center justify-center gap-2">
        <Badge variant="accent">{TIER_LABELS[requiredTier]}</Badge>
        <Link href="/pricing" className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-400">
          See plans →
        </Link>
      </div>
    </div>
  );
}
