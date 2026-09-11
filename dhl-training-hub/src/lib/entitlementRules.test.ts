import { test } from "node:test";
import assert from "node:assert/strict";
import { tierAtLeast, isFeatureUnlocked, FEATURE_MIN_TIER } from "./entitlementRules.ts";

test("tierAtLeast: ranks free < pro < enterprise", () => {
  assert.equal(tierAtLeast("free", "free"), true);
  assert.equal(tierAtLeast("free", "pro"), false);
  assert.equal(tierAtLeast("pro", "free"), true);
  assert.equal(tierAtLeast("pro", "pro"), true);
  assert.equal(tierAtLeast("pro", "enterprise"), false);
  assert.equal(tierAtLeast("enterprise", "pro"), true);
  assert.equal(tierAtLeast("enterprise", "enterprise"), true);
});

test("isFeatureUnlocked: every Phase 11 feature requires at least Pro", () => {
  for (const feature of Object.keys(FEATURE_MIN_TIER) as (keyof typeof FEATURE_MIN_TIER)[]) {
    assert.equal(isFeatureUnlocked("free", feature), false, `${feature} should be locked on Free`);
    assert.equal(isFeatureUnlocked("pro", feature), true, `${feature} should be unlocked on Pro`);
    assert.equal(isFeatureUnlocked("enterprise", feature), true, `${feature} should be unlocked on Enterprise`);
  }
});
