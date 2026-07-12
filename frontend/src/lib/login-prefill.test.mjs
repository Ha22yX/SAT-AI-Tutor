import test from "node:test";
import assert from "node:assert/strict";

import { getLoginPrefill } from "./login-prefill.ts";

test("returns demo credentials when demo query parameter is enabled", () => {
  assert.deepEqual(getLoginPrefill(new URLSearchParams("demo=1")), {
    identifier: "demo",
    password: "demo",
  });
});

test("does not prefill credentials without the demo query parameter", () => {
  assert.equal(getLoginPrefill(new URLSearchParams()), null);
  assert.equal(getLoginPrefill(new URLSearchParams("demo=0")), null);
  assert.equal(getLoginPrefill(new URLSearchParams("username=demo&password=demo")), null);
});
