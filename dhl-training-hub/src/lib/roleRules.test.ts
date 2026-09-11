import { test } from "node:test";
import assert from "node:assert/strict";
import { roleAtLeast, hasAdminAreaAccess, canManageRoster } from "./roleRules.ts";

test("roleAtLeast: ranks learner < manager < admin", () => {
  assert.equal(roleAtLeast("learner", "learner"), true);
  assert.equal(roleAtLeast("learner", "manager"), false);
  assert.equal(roleAtLeast("manager", "learner"), true);
  assert.equal(roleAtLeast("manager", "manager"), true);
  assert.equal(roleAtLeast("manager", "admin"), false);
  assert.equal(roleAtLeast("admin", "manager"), true);
  assert.equal(roleAtLeast("admin", "admin"), true);
});

test("hasAdminAreaAccess: a plain learner is blocked, manager and admin are both allowed in", () => {
  assert.equal(hasAdminAreaAccess("learner"), false);
  assert.equal(hasAdminAreaAccess("manager"), true);
  assert.equal(hasAdminAreaAccess("admin"), true);
});

test("canManageRoster: same manager-and-above rule as area access", () => {
  assert.equal(canManageRoster("learner"), false);
  assert.equal(canManageRoster("manager"), true);
  assert.equal(canManageRoster("admin"), true);
});
