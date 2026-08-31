import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Dish } from "@/lib/menu-seed";

export const MENU_THEMES = ["plate", "bistro", "fresh"] as const;
export type MenuTheme = (typeof MENU_THEMES)[number];

/** Approximate hex of each theme's --background, for PWA manifest/viewport colors (which can't read CSS vars). */
export const MENU_THEME_BACKGROUND: Record<MenuTheme, string> = {
  plate: "#f4eee1",
  bistro: "#f5eae9",
  fresh: "#eef1e9",
};

export interface MenuForSession {
  id: string;
  slug: string;
  restaurantName: string;
  description: string | null;
  logoUrl: string | null;
  bannerUrl: string | null;
  zomatoUrl: string | null;
  zomatoRating: number | null;
  swiggyUrl: string | null;
  swiggyRating: number | null;
  whatsappNumber: string | null;
  tableCount: number | null;
  imageEnhancerUrl: string | null;
  theme: MenuTheme;
  dishes: Dish[];
}

/** Lightweight summary used in the admin menu switcher. */
export interface MenuSummary {
  id: string;
  slug: string;
  restaurantName: string;
  description: string | null;
  dishCount: number;
  updatedAt: Date;
}

interface MenuItemRow {
  id: string;
  name: string;
  description: string | null;
  type: string;
  category: "veg" | "nonveg";
  price: number;
  halfPrice: number | null;
  fullPrice: number | null;
  smallPrice: number | null;
  mediumPrice: number | null;
  largePrice: number | null;
  imageUrl: string | null;
  ingredients: string[];
  section: string;
  available: boolean;
  featured: boolean;
}

export function toDish(item: MenuItemRow): Dish {
  return {
    id: item.id,
    name: item.name,
    description: item.description,
    type: item.type,
    cat: item.category,
    price: item.price,
    halfPrice: item.halfPrice,
    fullPrice: item.fullPrice,
    smallPrice: item.smallPrice,
    mediumPrice: item.mediumPrice,
    largePrice: item.largePrice,
    imageUrl: item.imageUrl,
    ingredients: item.ingredients,
    section: item.section,
    available: item.available,
    featured: item.featured,
  };
}

/** The signed-in restaurant's menu — by id if provided, otherwise most recently updated. */
export async function getMenuForSession(menuId?: string): Promise<MenuForSession | null> {
  const session = await getSession();
  if (!session) return null;

  const where = menuId
    ? { id: menuId, owner: { email: session.email } }
    : { owner: { email: session.email } };

  const menu = await prisma.menu.findFirst({
    where,
    orderBy: { updatedAt: "desc" },
    include: { items: { orderBy: { position: "asc" } } },
  });
  if (!menu) return null;

  return {
    id: menu.id,
    slug: menu.slug,
    restaurantName: menu.restaurantName ?? session.name,
    description: menu.description,
    logoUrl: menu.logoUrl,
    bannerUrl: menu.bannerUrl,
    zomatoUrl: menu.zomatoUrl,
    zomatoRating: menu.zomatoRating,
    swiggyUrl: menu.swiggyUrl,
    swiggyRating: menu.swiggyRating,
    whatsappNumber: menu.whatsappNumber,
    tableCount: menu.tableCount,
    imageEnhancerUrl: menu.imageEnhancerUrl,
    theme: menu.theme,
    dishes: menu.items.map(toDish),
  };
}

/** All menus owned by the signed-in user, newest first — used for the admin menu switcher. */
export async function getAllMenusForSession(): Promise<MenuSummary[]> {
  const session = await getSession();
  if (!session) return [];

  const menus = await prisma.menu.findMany({
    where: { owner: { email: session.email } },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      slug: true,
      restaurantName: true,
      description: true,
      updatedAt: true,
      _count: { select: { items: true } },
    },
  });

  return menus.map((m) => ({
    id: m.id,
    slug: m.slug,
    restaurantName: m.restaurantName ?? session.name,
    description: m.description,
    dishCount: m._count.items,
    updatedAt: m.updatedAt,
  }));
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
    description: menu.description,
    logoUrl: menu.logoUrl,
    bannerUrl: menu.bannerUrl,
    zomatoUrl: menu.zomatoUrl,
    zomatoRating: menu.zomatoRating,
    swiggyUrl: menu.swiggyUrl,
    swiggyRating: menu.swiggyRating,
    whatsappNumber: menu.whatsappNumber,
    tableCount: menu.tableCount,
    imageEnhancerUrl: menu.imageEnhancerUrl,
    theme: menu.theme,
    dishes: menu.items.filter((i) => i.available).map(toDish),
  };
}

export interface RegularCustomer {
  id: string;
  phone: string;
  orderCount: number;
  lastOrderAt: Date;
}

/** Customers who've opted in and ordered more than once — the offer broadcast's target list. */
const REGULAR_ORDER_THRESHOLD = 2;

export async function getRegularCustomers(menuId: string): Promise<RegularCustomer[]> {
  const session = await getSession();
  if (!session) return [];

  const menu = await prisma.menu.findFirst({
    where: { id: menuId, owner: { email: session.email } },
    select: { id: true },
  });
  if (!menu) return [];

  return prisma.customer.findMany({
    where: { menuId, orderCount: { gte: REGULAR_ORDER_THRESHOLD } },
    orderBy: { lastOrderAt: "desc" },
    select: { id: true, phone: true, orderCount: true, lastOrderAt: true },
  });
}
