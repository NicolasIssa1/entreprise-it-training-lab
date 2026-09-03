"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";

/**
 * Subtle route entrance animation — keyed by pathname so React remounts (and
 * therefore replays the CSS animation) on every navigation, without any
 * animation library. `prefers-reduced-motion` is handled globally in
 * globals.css (it zeroes every animation-duration), so this component itself
 * doesn't need a media-query branch.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="animate-page-in">
      {children}
    </div>
  );
}
