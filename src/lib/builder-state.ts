import type { Dish, DishCategory } from "@/lib/menu-seed";

export type BuilderStep = "upload" | "processing" | "review" | "published";

export function flipDishCategory(items: Dish[], id: string): Dish[] {
  return items.map((d) =>
    d.id === id ? { ...d, cat: (d.cat === "veg" ? "nonveg" : "veg") as DishCategory } : d
  );
}

export function setDishPrice(items: Dish[], id: string, price: number): Dish[] {
  return items.map((d) => (d.id === id ? { ...d, price } : d));
}

export function setDishHalfPrice(items: Dish[], id: string, halfPrice: number): Dish[] {
  return items.map((d) => (d.id === id ? { ...d, halfPrice } : d));
}

export function setDishFullPrice(items: Dish[], id: string, fullPrice: number): Dish[] {
  return items.map((d) => (d.id === id ? { ...d, fullPrice, price: fullPrice } : d));
}

export function toggleHalfFullPricing(items: Dish[], id: string, enabled: boolean): Dish[] {
  return items.map((d) => {
    if (d.id !== id) return d;
    if (enabled) {
      return { ...d, fullPrice: d.fullPrice ?? d.price, halfPrice: d.halfPrice ?? 0 };
    }
    return { ...d, halfPrice: null, fullPrice: null };
  });
}

export function addIngredient(items: Dish[], id: string, value: string): Dish[] {
  const trimmed = value.trim();
  if (!trimmed) return items;
  return items.map((d) =>
    d.id === id ? { ...d, ingredients: [...d.ingredients, trimmed] } : d
  );
}

export function removeIngredient(items: Dish[], id: string, index: number): Dish[] {
  return items.map((d) =>
    d.id === id
      ? { ...d, ingredients: d.ingredients.filter((_, i) => i !== index) }
      : d
  );
}

export function addDish(items: Dish[], dish: Dish): Dish[] {
  return [...items, dish];
}

export function removeDish(items: Dish[], id: string): Dish[] {
  return items.filter((d) => d.id !== id);
}
