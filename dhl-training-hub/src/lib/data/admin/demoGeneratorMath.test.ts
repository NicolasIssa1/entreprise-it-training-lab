import { test } from "node:test";
import assert from "node:assert/strict";
import { mulberry32, hashSeed, pickInt, pickScore, categoryForScore, correctCountForPercentage } from "./demoGeneratorMath.ts";

test("mulberry32: the same seed always produces the same sequence (reproducible demo data)", () => {
  const a = mulberry32(hashSeed("demo-ahmed-karim"));
  const b = mulberry32(hashSeed("demo-ahmed-karim"));
  const seqA = [a(), a(), a()];
  const seqB = [b(), b(), b()];
  assert.deepEqual(seqA, seqB);
});

test("mulberry32: different seeds produce different sequences (learners don't clone each other)", () => {
  const a = mulberry32(hashSeed("demo-ahmed-karim"));
  const b = mulberry32(hashSeed("demo-priya-nair"));
  assert.notEqual(a(), b());
});

test("hashSeed: is deterministic for the same string", () => {
  assert.equal(hashSeed("demo-01"), hashSeed("demo-01"));
});

test("pickInt: always stays within the inclusive range", () => {
  const rng = mulberry32(42);
  for (let i = 0; i < 50; i++) {
    const v = pickInt(rng, [5, 9]);
    assert.ok(v >= 5 && v <= 9, `${v} out of range`);
  }
});

test("pickInt: a degenerate range (max <= min) always returns min", () => {
  const rng = mulberry32(1);
  assert.equal(pickInt(rng, [7, 7]), 7);
  assert.equal(pickInt(rng, [7, 3]), 7);
});

test("pickScore: always stays within [min, max]", () => {
  const rng = mulberry32(7);
  for (let i = 0; i < 50; i++) {
    const v = pickScore(rng, [60, 80]);
    assert.ok(v >= 60 && v <= 80, `${v} out of range`);
  }
});

test("categoryForScore: mirrors investigationScoring.ts's 85/70/50 bands exactly", () => {
  assert.equal(categoryForScore(0), "Needs Review");
  assert.equal(categoryForScore(49), "Needs Review");
  assert.equal(categoryForScore(50), "Developing");
  assert.equal(categoryForScore(69), "Developing");
  assert.equal(categoryForScore(70), "Strong");
  assert.equal(categoryForScore(84), "Strong");
  assert.equal(categoryForScore(85), "Excellent");
  assert.equal(categoryForScore(100), "Excellent");
});

test("correctCountForPercentage: rounds and clamps to [0, total]", () => {
  assert.equal(correctCountForPercentage(10, 70), 7);
  assert.equal(correctCountForPercentage(10, 100), 10);
  assert.equal(correctCountForPercentage(10, 0), 0);
  assert.equal(correctCountForPercentage(3, 50), 2); // round(1.5) -> 2
});
