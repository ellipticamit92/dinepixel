import type { Dish, DishCategory, PricingMode } from "@/lib/menu-seed";

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

function sizePrice(d: Dish, patch: Partial<Pick<Dish, "smallPrice" | "mediumPrice" | "largePrice">>): number {
  const next = { smallPrice: d.smallPrice, mediumPrice: d.mediumPrice, largePrice: d.largePrice, ...patch };
  return next.largePrice ?? next.mediumPrice ?? next.smallPrice ?? 0;
}

export function setDishSmallPrice(items: Dish[], id: string, smallPrice: number): Dish[] {
  return items.map((d) =>
    d.id === id ? { ...d, smallPrice, price: sizePrice(d, { smallPrice }) } : d
  );
}

export function setDishMediumPrice(items: Dish[], id: string, mediumPrice: number): Dish[] {
  return items.map((d) =>
    d.id === id ? { ...d, mediumPrice, price: sizePrice(d, { mediumPrice }) } : d
  );
}

export function setDishLargePrice(items: Dish[], id: string, largePrice: number): Dish[] {
  return items.map((d) =>
    d.id === id ? { ...d, largePrice, price: sizePrice(d, { largePrice }) } : d
  );
}

export function setPricingMode(items: Dish[], id: string, mode: PricingMode): Dish[] {
  return items.map((d) => {
    if (d.id !== id) return d;
    if (mode === "halfFull") {
      return {
        ...d,
        fullPrice: d.fullPrice ?? d.price,
        halfPrice: d.halfPrice ?? null,
        smallPrice: null,
        mediumPrice: null,
        largePrice: null,
      };
    }
    if (mode === "sizes") {
      return {
        ...d,
        mediumPrice: d.mediumPrice ?? d.price,
        smallPrice: d.smallPrice ?? null,
        largePrice: d.largePrice ?? null,
        halfPrice: null,
        fullPrice: null,
      };
    }
    return { ...d, halfPrice: null, fullPrice: null, smallPrice: null, mediumPrice: null, largePrice: null };
  });
}

export function setDishName(items: Dish[], id: string, name: string): Dish[] {
  return items.map((d) => (d.id === id ? { ...d, name } : d));
}

export function setDishDescription(items: Dish[], id: string, description: string | null): Dish[] {
  return items.map((d) => (d.id === id ? { ...d, description } : d));
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
