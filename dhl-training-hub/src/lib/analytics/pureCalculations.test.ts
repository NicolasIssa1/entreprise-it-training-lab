// Regression/behavior coverage for the analytics derivation layer's pure math
// kernels (Phase 8 Part X). Run with: node --test src/lib
import { test } from "node:test";
import assert from "node:assert/strict";
import { trendDirectionForPercentages, isoWeekStart, bucketTimestampsByWeek, average } from "./pureCalculations.ts";

test("trendDirectionForPercentages: no-data / single-attempt states never overinterpret", () => {
  assert.equal(trendDirectionForPercentages([]), "insufficient-data");
  assert.equal(trendDirectionForPercentages([80]), "insufficient-data");
});

test("trendDirectionForPercentages: two attempts always reports 'steady', never a trend", () => {
  // Even a big swing between exactly two attempts is deliberately not called
  // improving/declining — three points minimum before reading a direction.
  assert.equal(trendDirectionForPercentages([40, 90]), "steady");
});

test("trendDirectionForPercentages: a real >=10pt move across 3+ attempts is a trend", () => {
  assert.equal(trendDirectionForPercentages([60, 70, 80]), "improving");
  assert.equal(trendDirectionForPercentages([80, 70, 60]), "declining");
});

test("trendDirectionForPercentages: small noise (<10pt) across 3+ attempts stays 'steady'", () => {
  assert.equal(trendDirectionForPercentages([70, 65, 72]), "steady");
});

test("isoWeekStart: always resolves to a Monday", () => {
  // 2026-08-25 is a Tuesday; 2026-08-24 is the Monday of that week.
  assert.equal(isoWeekStart("2026-08-25T10:00:00.000Z"), "2026-08-24");
  // Already a Monday should map to itself.
  assert.equal(isoWeekStart("2026-08-24T00:00:00.000Z"), "2026-08-24");
  // Sunday belongs to the week that started the preceding Monday.
  assert.equal(isoWeekStart("2026-08-30T23:59:59.000Z"), "2026-08-24");
});

test("bucketTimestampsByWeek: empty input returns an empty array, never a fabricated week", () => {
  assert.deepEqual(bucketTimestampsByWeek([]), []);
});

test("bucketTimestampsByWeek: groups by week and sorts chronologically", () => {
  const result = bucketTimestampsByWeek([
    "2026-08-25T10:00:00.000Z", // week of 2026-08-24
    "2026-08-26T10:00:00.000Z", // same week
    "2026-09-02T10:00:00.000Z", // week of 2026-08-31
  ]);
  assert.deepEqual(result, [
    { weekStart: "2026-08-24", count: 2 },
    { weekStart: "2026-08-31", count: 1 },
  ]);
});

test("average: rounds to the nearest whole number", () => {
  assert.equal(average([70, 71]), 71); // 70.5 rounds up
  assert.equal(average([100, 0, 0]), 33);
  assert.equal(average([85]), 85);
});
