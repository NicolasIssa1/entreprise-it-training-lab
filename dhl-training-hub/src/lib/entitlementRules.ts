/**
 * Pure entitlement/tier logic (Phase 11) — deliberately zero `@/`-aliased
 * imports, mirroring lib/analytics/pureCalculations.ts's testability pattern,
 * so this can be unit-tested directly with Node's built-in test runner. The
 * app-facing hook (lib/entitlements.ts, "use client") builds on top of this;
 * ProductTier here is structurally identical to the canonical one in
 * lib/types.ts (a plain 3-value string union), so values flow between them
 * without casting.
 */
export type ProductTier = "free" | "pro" | "enterprise";

const TIER_RANK: Record<ProductTier, number> = { free: 0, pro: 1, enterprise: 2 };

export function tierAtLeast(tier: ProductTier, minimum: ProductTier): boolean {
  return TIER_RANK[tier] >= TIER_RANK[minimum];
}

/**
 * The brand-new Phase 11 surfaces this tier system actually gates. Deliberately
 * does NOT retroactively lock anything from Phases 1-10 (Learn, Quizzes,
 * Advanced Investigations, Automation Lab, AI Tutor, Analytics, Assignments) —
 * there is no payment flow yet to unlock a paywalled feature with, so locking
 * already-working functionality behind "Pro" now would just break the current
 * product with no way to actually pay for it. Only the new Skills Passport
 * surfaces (which don't exist before this phase, so nothing regresses) are
 * gated — a deliberate, documented adjustment to the spec's "suggested
 * tiering," which explicitly allows adjusting based on feasibility.
 */
export type FeatureKey = "skills-passport" | "readiness-score" | "skill-gap-engine" | "milestones" | "certificates" | "cv-evidence";

export const FEATURE_MIN_TIER: Record<FeatureKey, ProductTier> = {
  "skills-passport": "pro",
  "readiness-score": "pro",
  "skill-gap-engine": "pro",
  milestones: "pro",
  certificates: "pro",
  "cv-evidence": "pro",
};

export function isFeatureUnlocked(tier: ProductTier, feature: FeatureKey): boolean {
  return tierAtLeast(tier, FEATURE_MIN_TIER[feature]);
}

export const TIER_LABELS: Record<ProductTier, string> = { free: "Free", pro: "Pro", enterprise: "Enterprise" };
