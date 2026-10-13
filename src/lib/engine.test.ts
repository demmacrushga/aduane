import test from "node:test";
import assert from "node:assert/strict";
import { planDay, allowed, type Prefs } from "./engine.ts";
import { MEALS } from "./meals.ts";

const base: Prefs = { diet: "any", goal: "balanced", budget: 60, household: 1, focus: [] };

test("every slot is filled for each diet", () => {
  for (const diet of ["any", "vegetarian", "vegan", "no-pork"] as const) {
    assert.equal(planDay({ ...base, diet }, "2026-10-12").length, 4, diet);
  }
});

test("no-pork never returns pork", () => {
  for (let d = 1; d <= 28; d++) {
    const plan = planDay({ ...base, diet: "no-pork" }, `2026-10-${d}`);
    assert.ok(plan.every((x) => !x.contains.includes("pork")));
  }
});

test("vegan plans contain no animal products", () => {
  const plan = planDay({ ...base, diet: "vegan" }, "2026-10-12");
  assert.ok(plan.every((x) => allowed(x, "vegan")));
});

test("plans respect the budget when options exist", () => {
  const plan = planDay({ ...base, budget: 80 }, "2026-10-12");
  const total = plan.reduce((s, x) => s + x.cost, 0);
  assert.ok(total <= 80, `total ${total}`);
});

test("plan is stable for the same day and changes with shuffle", () => {
  const a = planDay(base, "2026-10-12").map((x) => x.id).join();
  assert.equal(a, planDay(base, "2026-10-12").map((x) => x.id).join());
  const differs = [1, 2, 3, 4, 5].some(
    (n) => planDay(base, "2026-10-12", { lunch: n }).map((x) => x.id).join() !== a,
  );
  assert.ok(differs);
});

test("meal ids are unique", () => {
  assert.equal(new Set(MEALS.map((x) => x.id)).size, MEALS.length);
});
