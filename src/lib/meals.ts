export type Slot = "breakfast" | "lunch" | "snack" | "dinner";
export type Nutrient = "iron" | "protein" | "fibre" | "calcium" | "omega3" | "energy";
export type Ingredient = "meat" | "fish" | "egg" | "dairy" | "pork";
export type Goal = "balanced" | "energy" | "light" | "strength";

export interface Meal {
  id: string;
  slot: Slot;
  name: string;
  emoji: string;
  blurb: string;
  /** Rough GH₵ per person at urban market prices. Estimates, to be crowdsourced/updated. */
  cost: number;
  contains: Ingredient[];
  nutrients: Nutrient[];
  goals: Goal[];
  /** Flip to true once a qualified dietitian has signed off. */
  reviewed: boolean;
}

const m = (x: Omit<Meal, "reviewed">): Meal => ({ ...x, reviewed: false });

export const MEALS: Meal[] = [
  // Breakfast
  m({ id: "hausa-koko", slot: "breakfast", name: "Hausa koko & koose", emoji: "🥣", blurb: "Spiced millet porridge with bean cakes", cost: 8, contains: [], nutrients: ["energy", "protein", "fibre"], goals: ["energy", "balanced"] }),
  m({ id: "tom-brown", slot: "breakfast", name: "Tom brown porridge", emoji: "🥣", blurb: "Roasted maize, groundnut & soya porridge", cost: 6, contains: [], nutrients: ["protein", "fibre", "iron"], goals: ["balanced", "strength"] }),
  m({ id: "oats-groundnut", slot: "breakfast", name: "Oats with groundnuts & banana", emoji: "🍌", blurb: "Filling and cheap", cost: 9, contains: [], nutrients: ["fibre", "energy"], goals: ["light", "balanced"] }),
  m({ id: "egg-kelewele", slot: "breakfast", name: "Boiled egg & wholemeal bread", emoji: "🥚", blurb: "Quick protein start", cost: 10, contains: ["egg"], nutrients: ["protein", "fibre"], goals: ["strength", "light"] }),
  m({ id: "kooko-bofrot", slot: "breakfast", name: "Koko & bofrot", emoji: "🍩", blurb: "Corn porridge with a small bofrot", cost: 7, contains: [], nutrients: ["energy"], goals: ["energy"] }),
  m({ id: "yam-egg-stew", slot: "breakfast", name: "Boiled yam & egg stew", emoji: "🍠", blurb: "Yam with tomato-egg sauce", cost: 14, contains: ["egg"], nutrients: ["energy", "protein"], goals: ["energy", "strength"] }),
  // Lunch
  m({ id: "waakye-veg", slot: "lunch", name: "Waakye with egg & salad", emoji: "🍚", blurb: "Rice & beans, boiled egg, gari, fresh veg", cost: 22, contains: ["egg"], nutrients: ["fibre", "protein", "iron"], goals: ["balanced", "energy"] }),
  m({ id: "jollof-chicken", slot: "lunch", name: "Jollof with grilled chicken", emoji: "🍛", blurb: "Go easy on oil; add salad", cost: 35, contains: ["meat"], nutrients: ["protein", "energy"], goals: ["strength", "energy"] }),
  m({ id: "kontomire-ampesi", slot: "lunch", name: "Kontomire stew & ampesi", emoji: "🥬", blurb: "Cocoyam leaves, egg, boiled yam/plantain", cost: 25, contains: ["egg", "fish"], nutrients: ["iron", "calcium", "fibre"], goals: ["balanced", "light"] }),
  m({ id: "beans-gari", slot: "lunch", name: "Red-red with plantain", emoji: "🫘", blurb: "Black-eyed peas stew, fried plantain", cost: 18, contains: [], nutrients: ["fibre", "iron", "protein"], goals: ["balanced", "energy"] }),
  m({ id: "banku-okro", slot: "lunch", name: "Banku, okro stew & tilapia", emoji: "🐟", blurb: "Fermented corn & cassava, okro, grilled fish", cost: 32, contains: ["fish"], nutrients: ["protein", "omega3", "calcium"], goals: ["balanced", "strength"] }),
  m({ id: "kenkey-fish", slot: "lunch", name: "Kenkey, fish & shito (light)", emoji: "🐟", blurb: "Ga kenkey with fried fish and pepper", cost: 20, contains: ["fish"], nutrients: ["protein", "omega3", "energy"], goals: ["energy"] }),
  m({ id: "light-soup", slot: "lunch", name: "Light soup & fufu", emoji: "🍲", blurb: "Goat or fish light soup", cost: 38, contains: ["meat", "fish"], nutrients: ["protein", "iron"], goals: ["strength", "balanced"] }),
  m({ id: "gari-soakings", slot: "lunch", name: "Gari soakings & groundnuts", emoji: "🥜", blurb: "Budget-friendly, no cooking", cost: 6, contains: [], nutrients: ["energy", "protein"], goals: ["energy"] }),
  // Snack
  m({ id: "groundnuts", slot: "snack", name: "Roasted groundnuts & orange", emoji: "🥜", blurb: "Protein + vitamin C", cost: 5, contains: [], nutrients: ["protein", "iron"], goals: ["balanced", "light"] }),
  m({ id: "kelewele", slot: "snack", name: "Kelewele (baked)", emoji: "🍌", blurb: "Spiced plantain, lighter bake", cost: 7, contains: [], nutrients: ["energy"], goals: ["energy"] }),
  m({ id: "boiled-corn", slot: "snack", name: "Boiled corn & coconut", emoji: "🌽", blurb: "Fibre-rich street snack", cost: 5, contains: [], nutrients: ["fibre", "energy"], goals: ["light", "balanced"] }),
  m({ id: "pawpaw-yoghurt", slot: "snack", name: "Pawpaw & yoghurt", emoji: "🥭", blurb: "Gentle on the stomach", cost: 9, contains: ["dairy"], nutrients: ["calcium", "fibre"], goals: ["light", "balanced"] }),
  m({ id: "tigernut", slot: "snack", name: "Tigernut (atadwe) milk", emoji: "🥛", blurb: "Dairy-free & fibre-rich", cost: 6, contains: [], nutrients: ["fibre", "iron"], goals: ["balanced", "light"] }),
  // Dinner
  m({ id: "oto-veg", slot: "dinner", name: "Oto (yam mash) & egg", emoji: "🍳", blurb: "Mashed yam with palm oil, egg, avocado", cost: 20, contains: ["egg"], nutrients: ["energy", "protein"], goals: ["energy", "balanced"] }),
  m({ id: "groundnut-soup", slot: "dinner", name: "Groundnut soup & omo tuo", emoji: "🍲", blurb: "Rich, warming, protein-heavy", cost: 35, contains: ["meat"], nutrients: ["protein", "iron", "energy"], goals: ["strength"] }),
  m({ id: "fish-garden-egg", slot: "dinner", name: "Garden egg stew & fish with boiled plantain", emoji: "🍆", blurb: "Light and iron-friendly", cost: 26, contains: ["fish"], nutrients: ["iron", "omega3", "fibre"], goals: ["light", "balanced"] }),
  m({ id: "abenkwan", slot: "dinner", name: "Abenkwan (palm nut soup) & rice balls", emoji: "🍲", blurb: "Classic palm nut soup", cost: 34, contains: ["fish", "meat"], nutrients: ["protein", "energy"], goals: ["strength", "energy"] }),
  m({ id: "kontomire-palava", slot: "dinner", name: "Palava sauce & yam", emoji: "🥬", blurb: "Leafy greens with egusi/ground seeds", cost: 22, contains: ["fish"], nutrients: ["iron", "calcium", "protein"], goals: ["balanced", "strength"] }),
  m({ id: "veg-stir-rice", slot: "dinner", name: "Veggie fried rice", emoji: "🍚", blurb: "Carrot, peas, cabbage, egg", cost: 18, contains: ["egg"], nutrients: ["fibre", "energy"], goals: ["light", "balanced"] }),
  m({ id: "kebab-salad", slot: "dinner", name: "Pork-free kebab & kachumbari salad", emoji: "🍢", blurb: "Beef skewers with tomato-onion salad", cost: 24, contains: ["meat"], nutrients: ["protein", "iron"], goals: ["strength", "light"] }),
  m({ id: "yam-garden-egg-vegan", slot: "dinner", name: "Yam with garden egg & bean stew", emoji: "🍆", blurb: "Plant-based, palm-oil-light", cost: 16, contains: [], nutrients: ["iron", "fibre", "protein"], goals: ["light", "balanced"] }),
  m({ id: "pork-light", slot: "dinner", name: "Pepper soup with pork", emoji: "🍲", blurb: "Warming, high-protein", cost: 36, contains: ["meat", "pork"], nutrients: ["protein", "iron"], goals: ["strength"] }),
];

/**
 * Search terms for meals that are commonly sold at chop bars, street stalls or restaurants.
 * Meals without an entry (e.g. home-style combinations) don't show a takeout link.
 */
export const TAKEOUT: Record<string, string> = {
  "hausa-koko": "hausa koko",
  "waakye-veg": "waakye",
  "jollof-chicken": "jollof rice chicken",
  "kontomire-ampesi": "kontomire ampesi",
  "beans-gari": "red red",
  "banku-okro": "banku tilapia",
  "kenkey-fish": "kenkey fish",
  "light-soup": "light soup fufu",
  kelewele: "kelewele",
  "boiled-corn": "boiled corn",
  "oto-veg": "oto yam",
  "groundnut-soup": "groundnut soup omo tuo",
  "fish-garden-egg": "garden egg stew",
  abenkwan: "abenkwan palm nut soup",
  "kontomire-palava": "palava sauce",
  "kebab-salad": "beef kebab",
  "pork-light": "pepper soup",
  "veg-stir-rice": "fried rice",
};

export const takeoutUrl = (id: string): string | null =>
  TAKEOUT[id] ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${TAKEOUT[id]} near me`)}` : null;

/**
 * Meal ids that have a photo at public/meals/<id>.jpg (landscape, ~800x600, under 150 KB).
 * Add an id here after dropping its photo into public/meals/; meals not listed show an emoji tile.
 */
export const PHOTOS: string[] = [];

export const photoUrl = (id: string): string | null => (PHOTOS.includes(id) ? `/meals/${id}.jpg` : null);
