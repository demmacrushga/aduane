import { MEALS, type Goal, type Meal, type Nutrient, type Slot } from "./meals.ts";

export type Diet = "any" | "vegetarian" | "vegan" | "no-pork";

export interface Prefs {
  diet: Diet;
  goal: Goal;
  /** Daily food budget per person in GH₵. */
  budget: number;
  household: number;
  focus: Nutrient[];
}

export const SLOTS: Slot[] = ["breakfast", "lunch", "snack", "dinner"];
/** Share of the daily budget each slot may use. */
const SHARE: Record<Slot, number> = { breakfast: 0.2, lunch: 0.35, snack: 0.1, dinner: 0.35 };

export function allowed(meal: Meal, diet: Diet): boolean {
  const c = meal.contains;
  if (diet === "vegan") return c.length === 0;
  if (diet === "vegetarian") return !c.some((x) => x === "meat" || x === "fish" || x === "pork");
  if (diet === "no-pork") return !c.includes("pork");
  return true;
}

function rng(seed: string) {
  let h = 2166136261;
  for (const ch of seed) {
    h ^= ch.charCodeAt(0);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h += 0x6d2b79f5;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function pickMeal(slot: Slot, prefs: Prefs, dateKey: string, shuffle = 0): Meal | null {
  const pool = MEALS.filter((x) => x.slot === slot && allowed(x, prefs.diet));
  if (pool.length === 0) return null;
  const cap = prefs.budget * SHARE[slot];
  const affordable = pool.filter((x) => x.cost <= cap);
  // Keep at least 3 options so "swap" always has somewhere to go; when the budget is too tight,
  // fall back to the cheapest meals rather than showing nothing.
  const candidates =
    affordable.length >= 3 ? affordable : [...pool].sort((a, b) => a.cost - b.cost).slice(0, Math.min(3, pool.length));
  const rand = rng(`${dateKey}|${slot}|${shuffle}|${prefs.diet}|${prefs.goal}|${prefs.budget}`);
  return candidates
    .map((meal) => ({
      meal,
      score:
        (meal.goals.includes(prefs.goal) ? 2 : 0) +
        meal.nutrients.filter((n) => prefs.focus.includes(n)).length * 1.5 +
        rand() * 3,
    }))
    .sort((a, b) => b.score - a.score)[0].meal;
}

export function planDay(prefs: Prefs, dateKey: string, shuffles: Partial<Record<Slot, number>> = {}) {
  return SLOTS.map((slot) => pickMeal(slot, prefs, dateKey, shuffles[slot] ?? 0)).filter(
    (x): x is Meal => x !== null,
  );
}
