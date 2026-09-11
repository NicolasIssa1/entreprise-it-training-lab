import { test } from "node:test";
import assert from "node:assert/strict";
import { deriveAssignmentStatus } from "./adminAssignmentStatusRules.ts";

const NOW = "2026-09-09T12:00:00.000Z";

test("100% completion is always 'completed', even past a due date", () => {
  assert.equal(deriveAssignmentStatus(1, "2026-09-01T00:00:00.000Z", NOW), "completed");
  assert.equal(deriveAssignmentStatus(1, null, NOW), "completed");
});

test("a past due date with incomplete work is 'overdue'", () => {
  assert.equal(deriveAssignmentStatus(0.5, "2026-09-01T00:00:00.000Z", NOW), "overdue");
  assert.equal(deriveAssignmentStatus(0, "2026-09-01T00:00:00.000Z", NOW), "overdue");
});

test("a future due date with partial progress is 'started', not overdue", () => {
  assert.equal(deriveAssignmentStatus(0.3, "2026-12-01T00:00:00.000Z", NOW), "started");
});

test("no due date never counts as overdue, regardless of progress", () => {
  assert.equal(deriveAssignmentStatus(0.4, null, NOW), "started");
  assert.equal(deriveAssignmentStatus(0, null, NOW), "assigned");
});

test("zero progress with a future or no due date is 'assigned'", () => {
  assert.equal(deriveAssignmentStatus(0, "2026-12-01T00:00:00.000Z", NOW), "assigned");
  assert.equal(deriveAssignmentStatus(0, null, NOW), "assigned");
});
