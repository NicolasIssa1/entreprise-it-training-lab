"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { displayProductName, product } from "@/lib/product";
import { useAuth } from "@/lib/auth/AuthProvider";

// Grouped for scannability (Phase 10) — flat list of 12 links was hard to scan.
// Manager Preview / Privacy / Onboarding are deliberately reached via footer/
// in-page links, not top nav, to keep this list from growing further.
const NAV_GROUPS: { label: string; links: { href: string; label: string }[] }[] = [
  {
    label: "Learn",
    links: [
      { href: "/", label: "Dashboard" },
      { href: "/learn", label: "Learn" },
      { href: "/teams", label: "Teams" },
      { href: "/tickets", label: "Ticket Simulator" },
      { href: "/quizzes", label: "Assessments" },
    ],
  },
  {
    label: "Progress",
    links: [
      { href: "/progress", label: "Progress" },
      { href: "/analytics", label: "Analytics" },
      { href: "/assignments", label: "Assignments" },
    ],
  },
  {
    label: "Tools",
    links: [
      { href: "/tutor", label: "AI Tutor" },
      { href: "/daily-log", label: "Daily Log" },
      { href: "/cv-tracker", label: "CV Tracker" },
      { href: "/bpo/project-prep", label: "BPO Project Prep" },
    ],
  },
  {
    label: "Pilot",
    links: [{ href: "/pilot", label: "Pilot" }],
  },
];

function isLinkActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

function linkClasses(isActive: boolean) {
  return `whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
    isActive
      ? "bg-blue-600 text-white"
      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
  }`;
}

export function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const { isConfigured, user, loading, signOut } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    router.push("/");
  }

  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur dark:border-slate-800 dark:bg-slate-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
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

        {/* Desktop / wide nav: grouped inline links with dividers between groups */}
        <nav className="hidden flex-1 flex-wrap items-center gap-x-1 gap-y-1 lg:flex" aria-label="Main">
          {NAV_GROUPS.map((group, groupIndex) => (
            <div key={group.label} className="flex items-center gap-1">
              {groupIndex > 0 && (
                <span className="mx-1 h-4 w-px bg-slate-200 dark:bg-slate-700" aria-hidden="true" />
              )}
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isLinkActive(pathname, link.href) ? "page" : undefined}
                  className={linkClasses(isLinkActive(pathname, link.href))}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
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
                className="hidden whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 sm:inline-block dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="hidden whitespace-nowrap rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/40 sm:inline-block"
              >
                Create Account
              </Link>
            </>
          )}

          {/* Mobile / narrow nav: hamburger toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-panel"
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 lg:hidden dark:text-slate-300 dark:hover:bg-slate-800"
          >
            <svg viewBox="0 0 20 20" fill="none" className="h-5 w-5" aria-hidden="true">
              {mobileOpen ? (
                <path
                  d="M5 5l10 10M15 5L5 15"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M3 5h14M3 10h14M3 15h14"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          id="mobile-nav-panel"
          aria-label="Main, expanded"
          className="border-t border-slate-200 px-4 py-3 lg:hidden dark:border-slate-800"
        >
          {!user && isConfigured && (
            <div className="mb-3 flex gap-2 sm:hidden">
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className={linkClasses(false) + " flex-1 text-center"}
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                onClick={() => setMobileOpen(false)}
                className="flex-1 rounded-md bg-blue-600 px-3 py-1.5 text-center text-sm font-medium text-white hover:bg-blue-700"
              >
                Create Account
              </Link>
            </div>
          )}
          <div className="flex flex-col gap-4">
            {NAV_GROUPS.map((group) => (
              <div key={group.label}>
                <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400 dark:text-slate-500">
                  {group.label}
                </p>
                <div className="flex flex-col gap-1">
                  {group.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      aria-current={isLinkActive(pathname, link.href) ? "page" : undefined}
                      className={linkClasses(isLinkActive(pathname, link.href))}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
