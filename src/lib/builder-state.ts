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
