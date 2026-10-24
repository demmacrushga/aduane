/**
 * DRAFT data for the weekly plan and shopping list.
 * All prices are rough GH₵ estimates for urban markets and must be checked by someone who shops there.
 * Quantities are per person.
 */
export interface Ingredient {
  name: string;
  /** Household-friendly unit the quantity and price are expressed in. */
  unit: string;
  /** Estimated GH₵ price per unit. */
  price: number;
}

export const INGREDIENTS: Record<string, Ingredient> = {
  "millet-flour": { name: "Millet flour (koko)", unit: "cup", price: 2 },
  "tom-brown-mix": { name: "Tom brown mix", unit: "cup", price: 2.5 },
  "corn-dough": { name: "Corn dough (koko)", unit: "cup", price: 1.5 },
  oats: { name: "Oats", unit: "cup", price: 2.5 },
  beans: { name: "Black-eyed beans", unit: "cup", price: 5 },
  rice: { name: "Rice", unit: "cup", price: 4 },
  gari: { name: "Gari", unit: "cup", price: 1.5 },
  groundnuts: { name: "Groundnuts", unit: "handful", price: 1.5 },
  "groundnut-paste": { name: "Groundnut paste", unit: "tbsp", price: 1.2 },
  egusi: { name: "Egusi / ground seeds", unit: "tbsp", price: 1.5 },
  bread: { name: "Wholemeal bread", unit: "slice", price: 1 },
  koose: { name: "Koose (bean cake)", unit: "piece", price: 1 },
  bofrot: { name: "Bofrot", unit: "piece", price: 1.5 },
  egg: { name: "Egg", unit: "piece", price: 2.5 },
  banana: { name: "Banana", unit: "piece", price: 1 },
  plantain: { name: "Plantain", unit: "piece", price: 3 },
  yam: { name: "Yam", unit: "portion", price: 4 },
  cocoyam: { name: "Cocoyam", unit: "portion", price: 4 },
  "banku-dough": { name: "Banku (ready dough)", unit: "ball", price: 4 },
  kenkey: { name: "Kenkey", unit: "ball", price: 4 },
  fufu: { name: "Fufu", unit: "portion", price: 8 },
  "omo-tuo": { name: "Rice balls (omo tuo)", unit: "ball", price: 5 },
  kontomire: { name: "Kontomire (cocoyam leaves)", unit: "bunch", price: 4 },
  okro: { name: "Okro", unit: "handful", price: 2 },
  "garden-egg": { name: "Garden egg", unit: "handful", price: 2 },
  tomato: { name: "Tomato", unit: "piece", price: 1 },
  onion: { name: "Onion", unit: "piece", price: 1 },
  pepper: { name: "Hot pepper", unit: "piece", price: 0.5 },
  carrot: { name: "Carrot", unit: "piece", price: 1.5 },
  cabbage: { name: "Cabbage", unit: "portion", price: 1.5 },
  peas: { name: "Green peas", unit: "handful", price: 2 },
  avocado: { name: "Avocado", unit: "half", price: 2 },
  corn: { name: "Corn on the cob", unit: "cob", price: 2 },
  coconut: { name: "Coconut", unit: "slice", price: 1.5 },
  pawpaw: { name: "Pawpaw", unit: "slice", price: 2.5 },
  orange: { name: "Orange", unit: "piece", price: 1 },
  yoghurt: { name: "Yoghurt", unit: "cup", price: 3.5 },
  tigernut: { name: "Tigernuts (atadwe)", unit: "cup", price: 3 },
  chicken: { name: "Chicken", unit: "piece", price: 14 },
  tilapia: { name: "Tilapia (fresh)", unit: "piece", price: 15 },
  "smoked-fish": { name: "Smoked fish / herrings", unit: "piece", price: 5 },
  "fried-fish": { name: "Fried fish", unit: "piece", price: 8 },
  tuna: { name: "Tuna / mackerel", unit: "piece", price: 8 },
  prawns: { name: "Prawns", unit: "handful", price: 14 },
  goat: { name: "Goat meat", unit: "piece", price: 14 },
  beef: { name: "Beef", unit: "portion", price: 14 },
  pork: { name: "Pork", unit: "portion", price: 14 },
  "palm-oil": { name: "Palm oil", unit: "tbsp", price: 0.7 },
  "veg-oil": { name: "Vegetable oil", unit: "tbsp", price: 0.5 },
  "palmnut-cream": { name: "Palm nut cream", unit: "tin", price: 6 },
  shito: { name: "Shito", unit: "tbsp", price: 1 },
  spices: { name: "Ginger, pepper & seasoning", unit: "tbsp", price: 0.6 },
  "tomato-paste": { name: "Tomato paste", unit: "tbsp", price: 0.8 },
};

export interface RecipeLine {
  /** Key in INGREDIENTS. */
  i: string;
  /** Quantity per person, in the ingredient's unit. */
  q: number;
}

/** Keyed by meal id. */
export const RECIPES: Record<string, RecipeLine[]> = {
  "hausa-koko": [{ i: "millet-flour", q: 0.5 }, { i: "spices", q: 1 }, { i: "koose", q: 5 }],
  "tom-brown": [{ i: "tom-brown-mix", q: 1 }, { i: "groundnuts", q: 1 }, { i: "bread", q: 2 }],
  "oats-groundnut": [{ i: "oats", q: 1 }, { i: "groundnuts", q: 2 }, { i: "banana", q: 2 }, { i: "coconut", q: 1 }],
  "egg-kelewele": [{ i: "egg", q: 2 }, { i: "bread", q: 3 }, { i: "tomato", q: 1 }, { i: "avocado", q: 0.5 }],
  "kooko-bofrot": [{ i: "corn-dough", q: 1 }, { i: "bofrot", q: 2 }, { i: "spices", q: 1 }],
  "yam-egg-stew": [{ i: "yam", q: 1 }, { i: "egg", q: 2 }, { i: "tomato", q: 1 }, { i: "onion", q: 0.5 }, { i: "veg-oil", q: 1 }],
  "waakye-veg": [{ i: "rice", q: 0.75 }, { i: "beans", q: 0.5 }, { i: "egg", q: 1 }, { i: "gari", q: 0.5 }, { i: "tomato", q: 1 }, { i: "shito", q: 1 }, { i: "veg-oil", q: 1 }],
  "jollof-chicken": [{ i: "rice", q: 1 }, { i: "chicken", q: 1 }, { i: "tomato", q: 2 }, { i: "onion", q: 1 }, { i: "veg-oil", q: 2 }, { i: "tomato-paste", q: 1 }, { i: "spices", q: 1 }],
  "kontomire-ampesi": [{ i: "kontomire", q: 1 }, { i: "yam", q: 1 }, { i: "egg", q: 1 }, { i: "smoked-fish", q: 1 }, { i: "palm-oil", q: 1 }, { i: "onion", q: 0.5 }, { i: "pepper", q: 1 }],
  "beans-gari": [{ i: "beans", q: 0.75 }, { i: "plantain", q: 1 }, { i: "gari", q: 0.5 }, { i: "palm-oil", q: 1.5 }, { i: "tomato", q: 1 }, { i: "onion", q: 0.5 }],
  "banku-okro": [{ i: "banku-dough", q: 1 }, { i: "okro", q: 1 }, { i: "tilapia", q: 1 }, { i: "pepper", q: 2 }, { i: "tomato", q: 1 }, { i: "palm-oil", q: 1 }],
  "kenkey-fish": [{ i: "kenkey", q: 1 }, { i: "fried-fish", q: 1 }, { i: "shito", q: 2 }, { i: "tomato", q: 1 }, { i: "onion", q: 0.5 }],
  "light-soup": [{ i: "fufu", q: 1 }, { i: "goat", q: 1 }, { i: "smoked-fish", q: 1 }, { i: "tomato", q: 2 }, { i: "onion", q: 1 }, { i: "garden-egg", q: 1 }, { i: "pepper", q: 2 }, { i: "spices", q: 1 }],
  "gari-soakings": [{ i: "gari", q: 1 }, { i: "groundnuts", q: 2 }, { i: "coconut", q: 1 }],
  groundnuts: [{ i: "groundnuts", q: 2 }, { i: "orange", q: 1 }],
  kelewele: [{ i: "plantain", q: 1.5 }, { i: "spices", q: 1 }, { i: "veg-oil", q: 1 }],
  "boiled-corn": [{ i: "corn", q: 1 }, { i: "coconut", q: 1 }],
  "pawpaw-yoghurt": [{ i: "pawpaw", q: 2 }, { i: "yoghurt", q: 1 }],
  tigernut: [{ i: "tigernut", q: 1 }, { i: "spices", q: 1 }],
  "oto-veg": [{ i: "yam", q: 1.5 }, { i: "egg", q: 2 }, { i: "palm-oil", q: 2 }, { i: "avocado", q: 1 }, { i: "onion", q: 1 }],
  "groundnut-soup": [{ i: "omo-tuo", q: 1 }, { i: "goat", q: 1 }, { i: "groundnut-paste", q: 3 }, { i: "tomato", q: 2 }, { i: "onion", q: 1 }, { i: "pepper", q: 2 }, { i: "spices", q: 1 }],
  "fish-garden-egg": [{ i: "garden-egg", q: 2 }, { i: "tilapia", q: 1 }, { i: "plantain", q: 1 }, { i: "tomato", q: 1 }, { i: "onion", q: 0.5 }, { i: "palm-oil", q: 1 }],
  abenkwan: [{ i: "palmnut-cream", q: 1 }, { i: "omo-tuo", q: 1 }, { i: "smoked-fish", q: 1 }, { i: "goat", q: 0.5 }, { i: "tomato", q: 1 }, { i: "onion", q: 1 }, { i: "pepper", q: 2 }],
  "kontomire-palava": [{ i: "kontomire", q: 1 }, { i: "yam", q: 1 }, { i: "egusi", q: 2 }, { i: "smoked-fish", q: 1 }, { i: "palm-oil", q: 2 }, { i: "onion", q: 1 }],
  "veg-stir-rice": [{ i: "rice", q: 1 }, { i: "carrot", q: 1 }, { i: "cabbage", q: 1 }, { i: "peas", q: 1 }, { i: "egg", q: 1 }, { i: "veg-oil", q: 2 }, { i: "onion", q: 1 }],
  "kebab-salad": [{ i: "beef", q: 1 }, { i: "tomato", q: 2 }, { i: "onion", q: 1 }, { i: "cabbage", q: 1 }, { i: "spices", q: 2 }, { i: "veg-oil", q: 1 }],
  "yam-garden-egg-vegan": [{ i: "yam", q: 1 }, { i: "garden-egg", q: 2 }, { i: "beans", q: 0.5 }, { i: "tomato", q: 1 }, { i: "onion", q: 0.5 }, { i: "palm-oil", q: 1 }],
  "pork-light": [{ i: "pork", q: 1 }, { i: "yam", q: 1 }, { i: "tomato", q: 1 }, { i: "onion", q: 1 }, { i: "pepper", q: 2 }, { i: "spices", q: 2 }],
};

export const recipeCost = (mealId: string): number =>
  (RECIPES[mealId] ?? []).reduce((s, l) => s + l.q * (INGREDIENTS[l.i]?.price ?? 0), 0);
