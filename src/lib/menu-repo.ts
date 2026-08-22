import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Dish } from "@/lib/menu-seed";

export interface MenuForSession {
  id: string;
  slug: string;
  restaurantName: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  zomatoUrl: string | null;
  zomatoRating: number | null;
  swiggyUrl: string | null;
  swiggyRating: number | null;
  whatsappNumber: string | null;
  tableCount: number | null;
  imageEnhancerUrl: string | null;
  dishes: Dish[];
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
    zomatoUrl: menu.zomatoUrl,
    zomatoRating: menu.zomatoRating,
    swiggyUrl: menu.swiggyUrl,
    swiggyRating: menu.swiggyRating,
    whatsappNumber: menu.whatsappNumber,
    tableCount: menu.tableCount,
    imageEnhancerUrl: menu.imageEnhancerUrl,
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
    zomatoUrl: menu.zomatoUrl,
    zomatoRating: menu.zomatoRating,
    swiggyUrl: menu.swiggyUrl,
    swiggyRating: menu.swiggyRating,
    whatsappNumber: menu.whatsappNumber,
    tableCount: menu.tableCount,
    imageEnhancerUrl: menu.imageEnhancerUrl,
    dishes: menu.items.map(toDish),
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
