const FOOD_UNITS = ["kg", "lbs", "meals", "boxes", "liters", "items"] as const;
export type FoodUnit = (typeof FOOD_UNITS)[number];

const UNIT_ALIASES: Record<string, FoodUnit> = {
  kg: "kg",
  kgs: "kg",
  kilogram: "kg",
  kilograms: "kg",
  lb: "lbs",
  lbs: "lbs",
  pound: "lbs",
  pounds: "lbs",
  meal: "meals",
  meals: "meals",
  serving: "meals",
  servings: "meals",
  box: "boxes",
  boxes: "boxes",
  liter: "liters",
  liters: "liters",
  litre: "liters",
  litres: "liters",
  l: "liters",
  item: "items",
  items: "items",
  piece: "items",
  pieces: "items",
};

export function normalizeFoodUnit(raw: string): FoodUnit | null {
  const key = raw.trim().toLowerCase();
  return UNIT_ALIASES[key] ?? (FOOD_UNITS.includes(key as FoodUnit) ? (key as FoodUnit) : null);
}