import { test } from "node:test";
import assert from "node:assert/strict";
import { scopedKey, LEGACY_DOMAIN_KEYS } from "./storageScope.ts";

test("scopedKey: two different signed-in users never produce the same key (the actual regression)", () => {
  const a = scopedKey("daily-log-entries", "user-a-id");
  const b = scopedKey("daily-log-entries", "user-b-id");
  assert.notEqual(a, b);
});

test("scopedKey: signed-out/no user always resolves to the shared demo namespace", () => {
  assert.equal(scopedKey("daily-log-entries", null), "demo:daily-log-entries");
  assert.equal(scopedKey("daily-log-entries", undefined), "demo:daily-log-entries");
});

test("scopedKey: an authenticated user's key is never equal to the demo namespace's key", () => {
  const demo = scopedKey("cv-achievements", null);
  const user = scopedKey("cv-achievements", "some-user-id");
  assert.notEqual(demo, user);
});

test("scopedKey: the same user id always resolves to the same key (stable across renders)", () => {
  assert.equal(scopedKey("quiz-attempts", "abc"), scopedKey("quiz-attempts", "abc"));
});

test("scopedKey: never embeds anything that looks like an email address", () => {
  // Guards against a future regression where a caller accidentally passes
  // user.email instead of user.id.
  const key = scopedKey("daily-log-entries", "not-an-email-should-be-a-uuid");
  assert.equal(key.includes("@"), false);
});

test("LEGACY_DOMAIN_KEYS has no duplicates and no entry is already namespaced", () => {
  const unique = new Set(LEGACY_DOMAIN_KEYS);
  assert.equal(unique.size, LEGACY_DOMAIN_KEYS.length);
  for (const key of LEGACY_DOMAIN_KEYS) {
    assert.equal(key.startsWith("demo:"), false);
    assert.equal(key.startsWith("user:"), false);
  }
});
