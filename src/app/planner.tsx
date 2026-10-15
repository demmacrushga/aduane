"use client";

import { useEffect, useState } from "react";
import { planDay, SLOTS, type Diet, type Prefs } from "@/lib/engine";
import { takeoutUrl, type Goal, type Nutrient, type Slot } from "@/lib/meals";

const DEFAULTS: Prefs = { diet: "any", goal: "balanced", budget: 80, household: 1, focus: [] };
const SLOT_LABEL: Record<Slot, string> = { breakfast: "Breakfast", lunch: "Lunch", snack: "Snack", dinner: "Dinner" };
const FOCUS: { id: Nutrient; label: string }[] = [
  { id: "iron", label: "Iron" },
  { id: "protein", label: "Protein" },
  { id: "fibre", label: "Fibre" },
  { id: "calcium", label: "Calcium" },
  { id: "omega3", label: "Omega-3" },
];

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {}
}

const select =
  "w-full rounded-xl border border-line bg-background px-3 py-2 text-base";

export default function Planner() {
  const [ready, setReady] = useState(false);
  const [dateKey, setDateKey] = useState("");
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [shuffles, setShuffles] = useState<Partial<Record<Slot, number>>>({});
  const [done, setDone] = useState<Partial<Record<Slot, boolean>>>({});

  // Hydrate from localStorage after mount so server and client markup match.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const key = new Date().toLocaleDateString("en-CA");
    setDateKey(key);
    setPrefs(read("aduane:prefs", DEFAULTS));
    setShuffles(read(`aduane:shuffles:${key}`, {}));
    setDone(read(`aduane:done:${key}`, {}));
    setReady(true);
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  if (!ready) return null;

  const update = (patch: Partial<Prefs>) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    write("aduane:prefs", next);
  };
  const swap = (slot: Slot) => {
    const next = { ...shuffles, [slot]: (shuffles[slot] ?? 0) + 1 };
    setShuffles(next);
    write(`aduane:shuffles:${dateKey}`, next);
  };
  const toggle = (slot: Slot) => {
    const next = { ...done, [slot]: !done[slot] };
    setDone(next);
    write(`aduane:done:${dateKey}`, next);
  };
  const toggleFocus = (n: Nutrient) =>
    update({ focus: prefs.focus.includes(n) ? prefs.focus.filter((x) => x !== n) : [...prefs.focus, n] });

  const meals = planDay(prefs, dateKey, shuffles);
  const total = meals.reduce((s, x) => s + x.cost, 0) * prefs.household;
  const eaten = SLOTS.filter((s) => done[s]).length;
  const shareText = [
    `My Aduane meal plan for ${new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })}:`,
    ...meals.map((x) => `${SLOT_LABEL[x.slot]}: ${x.name} (≈ GH₵ ${x.cost * prefs.household})`),
    `Total ≈ GH₵ ${total}`,
    "",
    `Get yours: ${window.location.origin}`,
  ].join("\n");

  return (
    <main className="mx-auto max-w-xl px-4 pb-16 pt-6">
      <header className="mb-5">
        <h1 className="text-3xl font-bold text-brand">Aduane</h1>
        <p className="text-muted">
          {new Date().toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" })} — here is what to eat today.
        </p>
        <p className="mt-3 text-sm">
          Tired of asking “what will I cook today?” Tell us your budget and goals, and get a Ghanaian meal plan
          for the day, with prices in GH₵. Free, no sign-up.
        </p>
      </header>

      <section className="mb-4 grid grid-cols-2 gap-3 rounded-2xl border border-line bg-card p-4">
        <label className="text-sm text-muted">
          Diet
          <select className={select} value={prefs.diet} onChange={(e) => update({ diet: e.target.value as Diet })}>
            <option value="any">Anything</option>
            <option value="no-pork">No pork</option>
            <option value="vegetarian">Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </label>
        <label className="text-sm text-muted">
          Goal
          <select className={select} value={prefs.goal} onChange={(e) => update({ goal: e.target.value as Goal })}>
            <option value="balanced">Feel good</option>
            <option value="energy">More energy</option>
            <option value="light">Lighter meals</option>
            <option value="strength">Build strength</option>
          </select>
        </label>
        <label className="text-sm text-muted">
          Budget per person / day (GH₵)
          <input
            className={select}
            type="number"
            inputMode="numeric"
            min={15}
            max={300}
            value={prefs.budget}
            onChange={(e) => update({ budget: Math.max(15, Number(e.target.value) || 15) })}
          />
        </label>
        <label className="text-sm text-muted">
          People eating
          <input
            className={select}
            type="number"
            inputMode="numeric"
            min={1}
            max={12}
            value={prefs.household}
            onChange={(e) => update({ household: Math.min(12, Math.max(1, Number(e.target.value) || 1)) })}
          />
        </label>
        <div className="col-span-2">
          <p className="mb-1 text-sm text-muted">Nutrients to favour</p>
          <div className="flex flex-wrap gap-2">
            {FOCUS.map((f) => (
              <button
                key={f.id}
                onClick={() => toggleFocus(f.id)}
                aria-pressed={prefs.focus.includes(f.id)}
                className={`rounded-full border px-3 py-1 text-sm ${
                  prefs.focus.includes(f.id) ? "border-brand bg-brand text-white" : "border-line"
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section aria-label="Today's meals" className="space-y-3">
        {meals.map((meal) => (
          <article
            key={meal.id + meal.slot}
            className={`flex gap-3 rounded-2xl border border-line bg-card p-4 ${done[meal.slot] ? "opacity-55" : ""}`}
          >
            <div className="text-3xl" aria-hidden>{meal.emoji}</div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-wide text-brand">{SLOT_LABEL[meal.slot]}</p>
              <h2 className={`text-lg font-semibold ${done[meal.slot] ? "line-through" : ""}`}>{meal.name}</h2>
              <p className="text-sm text-muted">{meal.blurb}</p>
              <p className="mt-1 text-sm">
                ≈ GH₵ {meal.cost * prefs.household}
                {prefs.household > 1 ? ` for ${prefs.household}` : ""}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm font-medium text-brand">
                <button onClick={() => swap(meal.slot)} className="underline">
                  Swap this meal
                </button>
                {takeoutUrl(meal.id) && (
                  <a href={takeoutUrl(meal.id)!} target="_blank" rel="noopener noreferrer" className="underline">
                    Don’t want to cook? Find it near me
                  </a>
                )}
              </div>
            </div>
            <input
              type="checkbox"
              checked={!!done[meal.slot]}
              onChange={() => toggle(meal.slot)}
              aria-label={`Mark ${SLOT_LABEL[meal.slot]} as eaten`}
              className="mt-1 h-6 w-6 accent-[var(--green)]"
            />
          </article>
        ))}
      </section>

      <a
        href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block rounded-2xl bg-brand px-4 py-3 text-center font-semibold text-white"
      >
        Share today’s plan on WhatsApp
      </a>

      <p className="mt-4 rounded-2xl bg-gold/30 p-4 text-sm">
        <strong>Today’s total: ≈ GH₵ {total}</strong> · {eaten}/{SLOTS.length} meals done. Prices are rough
        market estimates and will vary by area.
      </p>

      <p className="mt-6 text-center text-xs text-muted">
        General food ideas, not medical advice. Recipes are not yet reviewed by a dietitian. If you are pregnant or
        managing a health condition, speak to a doctor or dietitian.
      </p>
    </main>
  );
}
