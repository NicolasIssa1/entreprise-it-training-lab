/**
 * Centralized product/brand configuration. Reusable UI (Nav, page metadata, footer,
 * privacy notices) should read from here instead of hardcoding a name or company —
 * this keeps the product swappable between private internship use and a future
 * public/commercial build without touching component code.
 *
 * Personal internship context (which organization, which role, which team) lives
 * separately in ./data/internshipState.ts. It is NOT product branding and should
 * never be hardcoded into reusable components either — see that file's comment for
 * why this separation matters for future reuse.
 */
export const product = {
  namePrivate: "DHL IT Training Hub",
  namePublic: "Enterprise IT Training Lab",
  subtitle: "Personal enterprise IT internship training and simulation platform.",
  /** Short header/nav tagline — the full disclaimer below stays in the footer and
   * PrivacyNotice components; this exists only so the nav has room to keep all
   * items on one line at normal desktop/laptop widths. */
  navTagline: "Personal enterprise IT training platform",
  trainingDisclaimer:
    "Personal training project — not an official product of any company it references. All ticket and scenario data is fictional.",
} as const;

/**
 * Single switch point for which name is displayed. Flip to "public" for a future
 * public/commercial/shared build (e.g. before pushing to GitHub or demoing
 * externally) — no other file should need to change.
 */
export const PRODUCT_DISPLAY_MODE: "private" | "public" = "private";

export const displayProductName =
  PRODUCT_DISPLAY_MODE === "private" ? product.namePrivate : product.namePublic;
