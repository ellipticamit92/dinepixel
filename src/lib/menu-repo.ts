import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Dish } from "@/lib/menu-seed";

export interface MenuForSession {
  id: string;
  slug: string;
  restaurantName: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  dishes: Dish[];
}

interface MenuItemRow {
  id: string;
  name: string;
  description: string | null;
  type: string;
  category: "veg" | "nonveg";
  price: number;
  ingredients: string[];
  section: string;
}

export function toDish(item: MenuItemRow): Dish {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    type: item.type,
    cat: item.category,
    price: item.price,
    ingredients: item.ingredients,
    section: item.section,
  };
}

/** The signed-in restaurant's most recently updated menu, or null if they haven't built one. */
export async function getMenuForSession(): Promise<MenuForSession | null> {
  const session = await getSession();
  if (!session) return null;

  const menu = await prisma.menu.findFirst({
    where: { owner: { email: session.email } },
    orderBy: { updatedAt: "desc" },
    include: { items: { orderBy: { position: "asc" } } },
  });
  if (!menu) return null;

  return {
    id: menu.id,
    slug: menu.slug,
    restaurantName: menu.restaurantName ?? session.name,
    logoUrl: menu.logoUrl,
    bannerUrl: menu.bannerUrl,
    dishes: menu.items.map(toDish),
  };
}

/** The public menu for a given slug, or null if no restaurant has published one. */
export async function getMenuBySlug(slug: string): Promise<MenuForSession | null> {
  const menu = await prisma.menu.findFirst({
    where: { slug },
    orderBy: { updatedAt: "desc" },
    include: { items: { orderBy: { position: "asc" } }, owner: { select: { name: true } } },
  });
  if (!menu) return null;

  return {
    id: menu.id,
    slug: menu.slug,
    restaurantName: menu.restaurantName ?? menu.owner.name ?? "Menu",
    logoUrl: menu.logoUrl,
    bannerUrl: menu.bannerUrl,
    dishes: menu.items.map(toDish),
  };
}
