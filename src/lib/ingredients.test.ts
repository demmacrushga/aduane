import test from "node:test";
import assert from "node:assert/strict";
import { INGREDIENTS, RECIPES, recipeCost } from "./ingredients.ts";
import { MEALS, type Ingredient } from "./meals.ts";

const ANIMAL: Record<string, Ingredient> = {
  chicken: "meat", goat: "meat", beef: "meat", pork: "pork",
  tilapia: "fish", "smoked-fish": "fish", "fried-fish": "fish", tuna: "fish", prawns: "fish",
  egg: "egg", yoghurt: "dairy",
};

test("every meal has a recipe and every recipe a meal", () => {
  const ids = MEALS.map((m) => m.id).sort();
  assert.deepEqual(Object.keys(RECIPES).sort(), ids);
});

test("recipe lines reference real ingredients with positive quantities", () => {
  for (const [meal, lines] of Object.entries(RECIPES))
    for (const l of lines) {
      assert.ok(INGREDIENTS[l.i], `${meal}: unknown ingredient ${l.i}`);
      assert.ok(l.q > 0, `${meal}: bad quantity for ${l.i}`);
    }
});

test("meal diet flags match the ingredients in the recipe", () => {
  for (const meal of MEALS)
    for (const l of RECIPES[meal.id]) {
      const flag = ANIMAL[l.i];
      if (flag) assert.ok(meal.contains.includes(flag), `${meal.id} uses ${l.i} but is not flagged "${flag}"`);
    }
});

test("cooking at home costs less than buying, but not absurdly less", () => {
  for (const meal of MEALS) {
    const c = recipeCost(meal.id);
    assert.ok(c <= meal.cost, `${meal.id}: home ${c.toFixed(1)} should not exceed buying price ${meal.cost}`);
    assert.ok(c >= meal.cost * 0.4, `${meal.id}: home ${c.toFixed(1)} is under 40% of ${meal.cost}`);
  }
});
