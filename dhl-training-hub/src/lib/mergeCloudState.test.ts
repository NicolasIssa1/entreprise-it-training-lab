// Regression coverage for the Phase 5 cloud-sync fix (see mergeCloudState.ts's
// own header comment for the full root-cause writeup): a domain hook's cloud
// fetch used to blindly replace local state, which could silently erase a
// just-saved Daily Log entry / CV achievement / any other synced record if its
// background write to Supabase hadn't landed yet before the next fetch (e.g. a
// fast refresh right after saving). These tests pin the exact behavior that
// fix depends on, using Node's built-in test runner — no new test framework
// dependency, matching the project's "don't overengineer" convention.
//
// Run with: node --test src/lib/mergeCloudState.test.ts

import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeRecordPreferCloud, mergeArrayByIdPreferCloud, mergeMapOfArraysByIdPreferCloud } from "./mergeCloudState.ts";

test("mergeRecordPreferCloud keeps a local-only key instead of dropping it (the actual regression)", () => {
  const local = { "topic-a": true, "topic-b": true };
  const cloud = { "topic-a": true }; // topic-b's write hadn't landed in cloud yet
  const { merged, localOnly } = mergeRecordPreferCloud(local, cloud);

  assert.deepEqual(merged, { "topic-a": true, "topic-b": true }, "topic-b must survive the merge, not be wiped");
  assert.deepEqual(localOnly, { "topic-b": true }, "topic-b should be reported for self-heal re-push to cloud");
});

test("mergeRecordPreferCloud lets cloud win when both sides have the same key (cross-device sync)", () => {
  const local = { "topic-a": false };
  const cloud = { "topic-a": true }; // completed on another device
  const { merged, localOnly } = mergeRecordPreferCloud(local, cloud);

  assert.equal(merged["topic-a"], true, "cloud's value should win when it has an opinion on a shared key");
  assert.deepEqual(localOnly, {}, "nothing should be reported as local-only when cloud already has that key");
});

test("mergeRecordPreferCloud on an empty cloud (brand-new account) preserves 100% of local", () => {
  const local = { "topic-a": true, "topic-b": true };
  const { merged, localOnly } = mergeRecordPreferCloud(local, {});

  assert.deepEqual(merged, local);
  assert.deepEqual(localOnly, local);
});

test("mergeArrayByIdPreferCloud keeps a freshly-added local entry cloud hasn't received yet", () => {
  const local = [
    { id: "entry-1", note: "old, already synced" },
    { id: "entry-2", note: "just added, insert still in flight" },
  ];
  const cloud = [{ id: "entry-1", note: "old, already synced" }];
  const { merged, localOnly } = mergeArrayByIdPreferCloud(local, cloud, (e) => e.id);

  assert.equal(merged.length, 2, "the just-added entry must not be dropped from the merged list");
  assert.ok(merged.some((e) => e.id === "entry-2"));
  assert.deepEqual(localOnly, [local[1]]);
});

test("mergeArrayByIdPreferCloud lets cloud's copy of a shared id win (e.g. edited on another device)", () => {
  const local = [{ id: "entry-1", note: "stale local copy" }];
  const cloud = [{ id: "entry-1", note: "newer, from another device" }];
  const { merged } = mergeArrayByIdPreferCloud(local, cloud, (e) => e.id);

  assert.equal(merged.length, 1);
  assert.equal(merged[0].note, "newer, from another device");
});

test("mergeMapOfArraysByIdPreferCloud (quiz attempts) preserves a just-recorded attempt per quiz", () => {
  const local = {
    "quiz-a": [{ attemptId: "a1", percentage: 80 }],
    "quiz-b": [{ attemptId: "b1", percentage: 60 }],
  };
  const cloud = {
    "quiz-a": [{ attemptId: "a1", percentage: 80 }],
    // quiz-b's attempt hasn't synced yet
  };
  const { merged, localOnly } = mergeMapOfArraysByIdPreferCloud(local, cloud, (a) => a.attemptId);

  assert.deepEqual(merged["quiz-b"], local["quiz-b"], "unsynced quiz-b attempt must survive the merge");
  assert.deepEqual(localOnly, { "quiz-b": local["quiz-b"] });
});
