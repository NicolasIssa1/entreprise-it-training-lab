"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { displayProductName, product } from "@/lib/product";
import { useAuth } from "@/lib/auth/AuthProvider";

const LINKS = [
  { href: "/", label: "Dashboard" },
  { href: "/learn", label: "Learn" },
  { href: "/teams", label: "Teams" },
  { href: "/tickets", label: "Ticket Simulator" },
  { href: "/quizzes", label: "Assessments" },
  { href: "/progress", label: "Progress" },
  { href: "/tutor", label: "Tutor" },
  { href: "/daily-log", label: "Daily Log" },
  { href: "/cv-tracker", label: "CV Tracker" },
];

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isConfigured, user, loading, signOut } = useAuth();

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex shrink-0 items-center gap-2">
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
            IT
          </span>
          <div className="leading-tight whitespace-nowrap">
            <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {displayProductName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{product.navTagline}</p>
          </div>
        </div>

        <nav className="flex flex-wrap gap-1 sm:flex-nowrap" aria-label="Main">
          {LINKS.map((link) => {
            const isActive =
              link.href === "/" ? pathname === "/" : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          {!isConfigured ? (
            <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800 dark:bg-amber-950 dark:text-amber-300">
              Local Demo Mode
            </span>
          ) : loading ? (
            <span className="text-xs text-slate-400">…</span>
          ) : user ? (
            <>
              <span className="hidden text-xs text-slate-500 sm:inline dark:text-slate-400" title={user.email ?? undefined}>
                {(user.user_metadata?.display_name as string | undefined) || user.email}
              </span>
              <button
                onClick={handleSignOut}
                className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="whitespace-nowrap rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
              >
                Create Account
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
