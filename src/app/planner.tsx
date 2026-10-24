"use client";

import { useEffect, useState } from "react";
import { planDay, SLOTS, type Diet, type Prefs } from "@/lib/engine";
import { photoUrl, takeoutUrl, type Goal, type Meal, type Nutrient, type Slot } from "@/lib/meals";
import NumberField from "./number-field";

// Link to a feedback form (e.g. Google Form). Set NEXT_PUBLIC_FEEDBACK_URL; the link is hidden if unset.
const FEEDBACK_URL = process.env.NEXT_PUBLIC_FEEDBACK_URL;

const DEFAULTS: Prefs = { diet: "any", goal: "balanced", budget: 80, household: 1, focus: [] };
const SLOT_LABEL: Record<Slot, string> = { breakfast: "Breakfast", lunch: "Lunch", snack: "Snack", dinner: "Dinner" };
const SLOT_TIME: Record<Slot, string> = { breakfast: "Morning", lunch: "Midday", snack: "Anytime", dinner: "Evening" };
/** Accent colour per slot: tile background and left edge. */
const SLOT_STYLE: Record<Slot, { tile: string; edge: string }> = {
  breakfast: { tile: "bg-gold/35", edge: "border-l-gold" },
  lunch: { tile: "bg-brand/20", edge: "border-l-brand" },
  snack: { tile: "bg-red/15", edge: "border-l-red" },
  dinner: { tile: "bg-foreground/10", edge: "border-l-foreground/60" },
};
const DIET_LABEL: Record<Diet, string> = { any: "Anything", "no-pork": "No pork", vegetarian: "Vegetarian", vegan: "Vegan" };
const GOAL_LABEL: Record<Goal, string> = {
  balanced: "Feel good",
  energy: "More energy",
  light: "Lighter meals",
  strength: "Build strength",
};
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

/** Twi greeting for the time of day. */
function greeting(hour: number) {
  if (hour < 12) return "Maakye";
  if (hour < 17) return "Maaha";
  return "Maadwo";
}

const field = "h-11 w-full rounded-xl border border-line bg-background px-3 text-base text-foreground";

function MealVisual({ meal }: { meal: Meal }) {
  const photo = photoUrl(meal.id);
  if (photo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={photo} alt={meal.name} loading="lazy" className="h-24 w-24 shrink-0 rounded-2xl object-cover" />;
  }
  return (
    <div
      aria-hidden
      className={`grid h-24 w-24 shrink-0 place-items-center rounded-2xl text-5xl ${SLOT_STYLE[meal.slot].tile}`}
    >
      {meal.emoji}
    </div>
  );
}

export default function Planner() {
  const [ready, setReady] = useState(false);
  const [dateKey, setDateKey] = useState("");
  const [prefs, setPrefs] = useState<Prefs>(DEFAULTS);
  const [prefsOpen, setPrefsOpen] = useState(true);
  const [shuffles, setShuffles] = useState<Partial<Record<Slot, number>>>({});
  const [done, setDone] = useState<Partial<Record<Slot, boolean>>>({});

  // Hydrate from localStorage after mount so server and client markup match.
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    const key = new Date().toLocaleDateString("en-CA");
    setDateKey(key);
    setPrefs(read("aduane:prefs", DEFAULTS));
    // First-time visitors see the preferences open; returning visitors go straight to their meals.
    setPrefsOpen(localStorage.getItem("aduane:prefs") === null);
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

  const now = new Date();
  const dateLabel = now.toLocaleDateString(undefined, { weekday: "long", day: "numeric", month: "long" });
  const meals = planDay(prefs, dateKey, shuffles);
  const total = meals.reduce((s, x) => s + x.cost, 0) * prefs.household;
  const eaten = SLOTS.filter((s) => done[s]).length;
  const people = prefs.household === 1 ? "1 person" : `${prefs.household} people`;
  const shareText = [
    `My Aduane meal plan for ${dateLabel}:`,
    ...meals.map((x) => `${SLOT_LABEL[x.slot]}: ${x.name} (≈ GH₵ ${x.cost * prefs.household})`),
    `Total ≈ GH₵ ${total}`,
    "",
    `Get yours: ${window.location.origin}`,
  ].join("\n");

  return (
    <>
      <div className="kente" aria-hidden />
      <main className="mx-auto max-w-xl px-4 pb-16 pt-6">
        <header className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-widest text-red">{dateLabel}</p>
          <h1 className="mt-1 font-display text-5xl font-extrabold leading-none text-brand">
            {greeting(now.getHours())}!
          </h1>
          <p className="mt-2 font-display text-2xl font-semibold leading-snug">
            Here’s what to eat today.
          </p>
          <p className="mt-3 text-sm text-muted">
            <span className="font-semibold text-foreground">Aduane</span> means “food” in Twi. Tell us your budget
            and we’ll plan the day with real Ghanaian meals and prices in GH₵. Free, no sign-up.
          </p>
        </header>

        <details
          open={prefsOpen}
          onToggle={(e) => setPrefsOpen((e.currentTarget as HTMLDetailsElement).open)}
          className="mb-6 rounded-2xl border border-line bg-card"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-4">
            <span>
              <span className="block text-xs font-semibold uppercase tracking-widest text-muted">Your plan settings</span>
              <span className="block font-semibold">
                {DIET_LABEL[prefs.diet]} · {GOAL_LABEL[prefs.goal]} · GH₵{prefs.budget}/person · {people}
              </span>
            </span>
            <span className="shrink-0 rounded-full border border-line px-3 py-1 text-sm font-semibold text-brand">
              {prefsOpen ? "Done" : "Edit"}
            </span>
          </summary>

          <div className="grid grid-cols-1 gap-4 border-t border-line p-4 sm:grid-cols-2">
            <label className="text-sm text-muted">
              <span className="mb-1 block">Diet</span>
              <select className={field} value={prefs.diet} onChange={(e) => update({ diet: e.target.value as Diet })}>
                {(Object.keys(DIET_LABEL) as Diet[]).map((d) => (
                  <option key={d} value={d}>
                    {DIET_LABEL[d]}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm text-muted">
              <span className="mb-1 block">Goal</span>
              <select className={field} value={prefs.goal} onChange={(e) => update({ goal: e.target.value as Goal })}>
                {(Object.keys(GOAL_LABEL) as Goal[]).map((g) => (
                  <option key={g} value={g}>
                    {GOAL_LABEL[g]}
                  </option>
                ))}
              </select>
            </label>
            <NumberField
              label="Budget per person / day"
              prefix="GH₵"
              value={prefs.budget}
              min={10}
              max={500}
              step={5}
              onChange={(budget) => update({ budget })}
            />
            <NumberField
              label="People eating"
              value={prefs.household}
              min={1}
              max={20}
              step={1}
              onChange={(household) => update({ household })}
            />
            <div className="sm:col-span-2">
              <p className="mb-2 text-sm text-muted">Nutrients to favour</p>
              <div className="flex flex-wrap gap-2">
                {FOCUS.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => toggleFocus(f.id)}
                    aria-pressed={prefs.focus.includes(f.id)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium ${
                      prefs.focus.includes(f.id) ? "border-brand bg-brand text-white" : "border-line bg-background"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </details>

        <section aria-label="Today's meals" className="space-y-4">
          {meals.map((meal) => (
            <article
              key={meal.id + meal.slot}
              className={`flex gap-4 rounded-2xl border border-l-8 border-line bg-card p-4 ${SLOT_STYLE[meal.slot].edge} ${
                done[meal.slot] ? "opacity-55" : ""
              }`}
            >
              <MealVisual meal={meal} />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-muted">
                  {SLOT_LABEL[meal.slot]} · {SLOT_TIME[meal.slot]}
                </p>
                <h2
                  className={`font-display text-xl font-semibold leading-tight ${done[meal.slot] ? "line-through" : ""}`}
                >
                  {meal.name}
                </h2>
                <p className="mt-1 text-sm text-muted">{meal.blurb}</p>
                <p className="mt-2 font-semibold">
                  ≈ GH₵ {meal.cost * prefs.household}
                  {prefs.household > 1 && <span className="font-normal text-muted"> for {prefs.household}</span>}
                </p>
                <div className="mt-3 flex flex-wrap gap-2 text-sm font-semibold">
                  <button onClick={() => swap(meal.slot)} className="rounded-full border border-line px-3 py-1.5 text-brand">
                    ↻ Swap
                  </button>
                  {takeoutUrl(meal.id) && (
                    <a
                      href={takeoutUrl(meal.id)!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-line px-3 py-1.5 text-brand"
                    >
                      📍 Buy nearby
                    </a>
                  )}
                  <button
                    onClick={() => toggle(meal.slot)}
                    aria-pressed={!!done[meal.slot]}
                    className={`rounded-full px-3 py-1.5 ${
                      done[meal.slot] ? "bg-brand text-white" : "border border-line text-foreground"
                    }`}
                  >
                    {done[meal.slot] ? "✓ Eaten" : "Mark eaten"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-6 rounded-2xl bg-brand p-5 text-white">
          <p className="text-sm uppercase tracking-widest text-white/75">Today’s total</p>
          <p className="font-display text-4xl font-extrabold">≈ GH₵ {total}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/25" aria-hidden>
            <div className="h-full rounded-full bg-gold transition-all" style={{ width: `${(eaten / SLOTS.length) * 100}%` }} />
          </div>
          <p className="mt-2 text-sm text-white/85">
            {eaten} of {SLOTS.length} meals eaten · prices are rough market estimates
          </p>
        </section>

        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareText)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 block rounded-2xl bg-gold px-4 py-4 text-center text-lg font-bold text-[#2b1d12]"
        >
          Share today’s plan on WhatsApp
        </a>

        {FEEDBACK_URL && (
          <a
            href={FEEDBACK_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 block rounded-2xl border border-line bg-card px-4 py-3 text-center text-sm font-semibold"
          >
            Was today’s plan useful? Tell us in 30 seconds
          </a>
        )}

        <p className="mt-8 text-center text-xs text-muted">
          General food ideas, not medical advice. Recipes are not yet reviewed by a dietitian. If you are pregnant or
          managing a health condition, speak to a doctor or dietitian.
        </p>
      </main>
      <div className="kente-thin" aria-hidden />
    </>
  );
}
