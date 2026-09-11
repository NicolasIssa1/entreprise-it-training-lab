import { test } from "node:test";
import assert from "node:assert/strict";
import { organizationRoleAtLeast } from "./organizationRoleRules.ts";

test("organizationRoleAtLeast: ranks learner < manager < admin < owner", () => {
  assert.equal(organizationRoleAtLeast("learner", "learner"), true);
  assert.equal(organizationRoleAtLeast("learner", "manager"), false);
  assert.equal(organizationRoleAtLeast("manager", "learner"), true);
  assert.equal(organizationRoleAtLeast("manager", "manager"), true);
  assert.equal(organizationRoleAtLeast("manager", "admin"), false);
  assert.equal(organizationRoleAtLeast("admin", "manager"), true);
  assert.equal(organizationRoleAtLeast("admin", "owner"), false);
  assert.equal(organizationRoleAtLeast("owner", "admin"), true);
  assert.equal(organizationRoleAtLeast("owner", "owner"), true);
});

test("organizationRoleAtLeast: a plain learner never satisfies manager+ (the /admin gate's core check)", () => {
  assert.equal(organizationRoleAtLeast("learner", "manager"), false);
});
