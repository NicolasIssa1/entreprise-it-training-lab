"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/auth/AuthProvider";
import type { ProductTier } from "@/lib/types";
import { PRODUCT_TIERS } from "@/lib/types";
import { tierAtLeast, isFeatureUnlocked, FEATURE_MIN_TIER, TIER_LABELS } from "@/lib/entitlementRules";
import type { FeatureKey } from "@/lib/entitlementRules";

export { tierAtLeast, isFeatureUnlocked, FEATURE_MIN_TIER, TIER_LABELS };
export type { FeatureKey };

function isProductTier(value: string | undefined | null): value is ProductTier {
  return !!value && (PRODUCT_TIERS as readonly string[]).includes(value);
}

/**
 * Explicit, visible dev/test escape hatch (see .env.example) — set locally in
 * .env.local (gitignored, never committed), never inferred from a specific
 * account. This is the mechanism the current personal/dev account uses to
 * exercise every tier without a real payment flow existing yet, per the
 * Phase 11 spec's explicit "development/test entitlement approach" request.
 */
const DEV_TIER_OVERRIDE = process.env.NEXT_PUBLIC_DEV_TIER_OVERRIDE;

export function useEntitlement(): { tier: ProductTier; isDevOverride: boolean } {
  const { profile } = useAuth();

  return useMemo(() => {
    if (isProductTier(DEV_TIER_OVERRIDE)) {
      return { tier: DEV_TIER_OVERRIDE, isDevOverride: true };
    }
    return { tier: profile?.tier ?? "free", isDevOverride: false };
  }, [profile]);
}

export function useFeature(feature: FeatureKey): { unlocked: boolean; tier: ProductTier; requiredTier: ProductTier; isDevOverride: boolean } {
  const { tier, isDevOverride } = useEntitlement();
  return { unlocked: isFeatureUnlocked(tier, feature), tier, requiredTier: FEATURE_MIN_TIER[feature], isDevOverride };
}
