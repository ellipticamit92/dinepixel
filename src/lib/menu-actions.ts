"use server";

import { mkdir, readdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toDish } from "@/lib/menu-repo";
import type { Dish, DishCategory } from "@/lib/menu-seed";

export interface SaveMenuInput {
  slug: string;
  restaurantName: string | null;
  sourceFileName: string | null;
  sourceNotes: string | null;
  dishes: Dish[];
}

function cleanText(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim().slice(0, max);
  return trimmed || null;
}

function cleanDish(dish: Dish, position: number) {
  const name = cleanText(dish.name, 200);
  if (!name) return null;

  return {
    slug: cleanText(dish.id, 200) ?? `dish-${position}`,
    name,
    description: cleanText(dish.description, 2000),
    type: cleanText(dish.type, 100) ?? "Dish",
    category: (dish.cat === "nonveg" ? "nonveg" : "veg") as DishCategory,
    price: cleanPrice(dish.price),
    ingredients: cleanIngredients(dish.ingredients),
    section: cleanText(dish.section, 120) ?? "Menu",
    position,
  };
}

/**
 * Persists a freshly extracted menu for the signed-in restaurant. Re-running the
 * builder for the same slug replaces that menu's items rather than duplicating them.
 */
export async function saveExtractedMenu(input: SaveMenuInput): Promise<{ menuId: string }> {
  const session = await getSession();
  if (!session) throw new Error("Not signed in");

  const slug = cleanText(input.slug, 120);
  if (!slug) throw new Error("Missing menu slug");

  const items = (Array.isArray(input.dishes) ? input.dishes : [])
    .slice(0, 500)
    .map(cleanDish)
    .filter((d): d is NonNullable<typeof d> => d !== null)
    .map((d, index) => ({ ...d, position: index }));

  if (items.length === 0) throw new Error("No dishes to save");

  const owner = await prisma.user.upsert({
    where: { email: session.email },
    update: { name: session.name },
    create: { email: session.email, name: session.name },
  });

  const restaurantName = cleanText(input.restaurantName, 200) ?? session.name;

  return prisma.$transaction(async (tx) => {
    const menu = await tx.menu.upsert({
      where: { ownerId_slug: { ownerId: owner.id, slug } },
      update: {
        restaurantName,
        sourceFileName: cleanText(input.sourceFileName, 300),
        sourceNotes: cleanText(input.sourceNotes, 4000),
      },
      create: {
        ownerId: owner.id,
        slug,
        restaurantName,
        sourceFileName: cleanText(input.sourceFileName, 300),
        sourceNotes: cleanText(input.sourceNotes, 4000),
      },
    });

    await tx.menuItem.deleteMany({ where: { menuId: menu.id } });
    await tx.menuItem.createMany({
      data: items.map((item) => ({ ...item, menuId: menu.id })),
    });

    return { menuId: menu.id };
  });
}

function cleanIngredients(values: unknown): string[] {
  if (!Array.isArray(values)) return [];
  return values
    .map((i) => cleanText(i, 120))
    .filter((i): i is string => i !== null)
    .slice(0, 40);
}

function cleanPrice(value: unknown): number {
  const price = Number(value);
  return Number.isFinite(price) ? Math.max(0, Math.round(price)) : 0;
}

/** Resolves a menu item only if it belongs to the signed-in restaurant. */
async function ownedItemId(itemId: unknown): Promise<string> {
  const session = await getSession();
  if (!session) throw new Error("Not signed in");

  const id = cleanText(itemId, 60);
  if (!id) throw new Error("Missing dish id");

  const item = await prisma.menuItem.findFirst({
    where: { id, menu: { owner: { email: session.email } } },
    select: { id: true },
  });
  if (!item) throw new Error("Dish not found");

  return item.id;
}

export interface UpdateDishInput {
  id: string;
  name: string;
  description?: string | null;
  cat: DishCategory;
  price: number;
  halfPrice?: number | null;
  fullPrice?: number | null;
  smallPrice?: number | null;
  mediumPrice?: number | null;
  largePrice?: number | null;
  ingredients: string[];
}

export async function updateMenuItem(input: UpdateDishInput): Promise<Dish> {
  const id = await ownedItemId(input.id);

  const name = cleanText(input.name, 200);
  if (!name) throw new Error("A dish needs a name");

  const halfPrice = input.halfPrice != null ? cleanPrice(input.halfPrice) : null;
  const fullPrice = input.fullPrice != null ? cleanPrice(input.fullPrice) : null;
  const smallPrice = input.smallPrice != null ? cleanPrice(input.smallPrice) : null;
  const mediumPrice = input.mediumPrice != null ? cleanPrice(input.mediumPrice) : null;
  const largePrice = input.largePrice != null ? cleanPrice(input.largePrice) : null;

  // Sizes takes precedence if both were somehow set; full is the anchor for half/full
  // (half is optional), so a dish is only in that mode once full has a value.
  const usingSizes = smallPrice !== null || mediumPrice !== null || largePrice !== null;
  const usingHalfFull = !usingSizes && fullPrice !== null;

  const price = usingSizes
    ? (largePrice ?? mediumPrice ?? smallPrice as number)
    : usingHalfFull
      ? (fullPrice as number)
      : cleanPrice(input.price);

  const item = await prisma.menuItem.update({
    where: { id },
    data: {
      name,
      description: cleanText(input.description, 2000),
      category: input.cat === "nonveg" ? "nonveg" : "veg",
      price,
      halfPrice: usingHalfFull ? halfPrice : null,
      fullPrice: usingHalfFull ? fullPrice : null,
      smallPrice: usingSizes ? smallPrice : null,
      mediumPrice: usingSizes ? mediumPrice : null,
      largePrice: usingSizes ? largePrice : null,
      ingredients: cleanIngredients(input.ingredients),
    },
  });

  return toDish(item);
}

/** Resolves a menu only if it belongs to the signed-in restaurant. */
async function ownedMenuId(menuId: unknown): Promise<string> {
  const session = await getSession();
  if (!session) throw new Error("Not signed in");

  const id = cleanText(menuId, 60);
  if (!id) throw new Error("Missing menu");

  const menu = await prisma.menu.findFirst({
    where: { id, owner: { email: session.email } },
    select: { id: true },
  });
  if (!menu) throw new Error("Menu not found");

  return menu.id;
}

function cleanUrl(value: unknown, max: number): string | null {
  const text = cleanText(value, max);
  if (!text) return null;
  try {
    const url = new URL(text);
    if (url.protocol !== "http:" && url.protocol !== "https:") return null;
    return url.toString();
  } catch {
    return null;
  }
}

function cleanRating(value: unknown): number | null {
  const rating = Number(value);
  if (!Number.isFinite(rating)) return null;
  return Math.min(5, Math.max(0, Math.round(rating * 10) / 10));
}

export interface UpdateDeliveryLinksInput {
  menuId: string;
  zomatoUrl?: string | null;
  zomatoRating?: number | null;
  swiggyUrl?: string | null;
  swiggyRating?: number | null;
}

export async function updateDeliveryLinks(input: UpdateDeliveryLinksInput): Promise<{
  zomatoUrl: string | null;
  zomatoRating: number | null;
  swiggyUrl: string | null;
  swiggyRating: number | null;
}> {
  const id = await ownedMenuId(input.menuId);

  const zomatoUrl = cleanUrl(input.zomatoUrl, 500);
  const zomatoRating = zomatoUrl ? cleanRating(input.zomatoRating) : null;
  const swiggyUrl = cleanUrl(input.swiggyUrl, 500);
  const swiggyRating = swiggyUrl ? cleanRating(input.swiggyRating) : null;

  return prisma.menu.update({
    where: { id },
    data: { zomatoUrl, zomatoRating, swiggyUrl, swiggyRating },
    select: { zomatoUrl: true, zomatoRating: true, swiggyUrl: true, swiggyRating: true },
  });
}

function cleanPhone(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const digits = value.replace(/[^0-9]/g, "").slice(0, 15);
  return digits.length >= 8 ? digits : null;
}

/** Number customers' WhatsApp orders (from the public cart page) are sent to — digits only, with country code. */
export async function updateWhatsappNumber(
  menuId: string,
  whatsappNumber: string | null
): Promise<{ whatsappNumber: string | null }> {
  const id = await ownedMenuId(menuId);

  const cleaned = cleanPhone(whatsappNumber);

  await prisma.menu.update({ where: { id }, data: { whatsappNumber: cleaned } });

  return { whatsappNumber: cleaned };
}

/**
 * Records a guest's number when they opt in to save it while sending a WhatsApp order.
 * Public — called from the anonymous cart page, not gated behind a session. Repeat orders
 * bump `orderCount`, which is how the admin's offer panel tells regular customers apart.
 */
export async function recordCustomerOrder(menuId: string, phone: string): Promise<{ ok: true }> {
  const id = cleanText(menuId, 60);
  if (!id) throw new Error("Missing menu");

  const cleanedPhone = cleanPhone(phone);
  if (!cleanedPhone) throw new Error("Invalid phone number");

  const menu = await prisma.menu.findUnique({ where: { id }, select: { id: true } });
  if (!menu) throw new Error("Menu not found");

  await prisma.customer.upsert({
    where: { menuId_phone: { menuId: id, phone: cleanedPhone } },
    update: { orderCount: { increment: 1 }, lastOrderAt: new Date() },
    create: { menuId: id, phone: cleanedPhone },
  });

  return { ok: true };
}

function cleanTableCount(value: unknown): number | null {
  const count = Number(value);
  if (!Number.isFinite(count)) return null;
  return Math.min(200, Math.max(1, Math.round(count)));
}

/** Number of tables this menu has QR codes for — drives how many "Table N" QR codes admins can print. */
export async function updateTableCount(
  menuId: string,
  tableCount: number | null
): Promise<{ tableCount: number | null }> {
  const id = await ownedMenuId(menuId);

  const cleaned = tableCount == null ? null : cleanTableCount(tableCount);

  await prisma.menu.update({ where: { id }, data: { tableCount: cleaned } });

  return { tableCount: cleaned };
}

const MENU_IMAGE_KINDS = ["logo", "banner"] as const;
type MenuImageKind = (typeof MENU_IMAGE_KINDS)[number];

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/svg+xml": "svg",
};

// Stored outside `public/` and served through src/app/uploads/menus/[menuId]/[filename]/route.ts,
// which reads the file fresh on every request — `next start` only serves public/ files that
// existed when the server booted, so anything written to public/ at runtime 404s until restart.
function menuUploadDir(menuId: string): string {
  return path.join(process.cwd(), "uploads", "menus", menuId);
}

async function clearMenuImage(menuId: string, kind: MenuImageKind): Promise<void> {
  const dir = menuUploadDir(menuId);
  const existing = await readdir(dir).catch(() => [] as string[]);
  await Promise.all(
    existing.filter((f) => f.startsWith(`${kind}.`)).map((f) => unlink(path.join(dir, f)))
  );
}

/** Saves a logo or banner image to disk and records its URL on the menu. */
export async function uploadMenuImage(
  menuId: string,
  kind: MenuImageKind,
  formData: FormData
): Promise<{ url: string }> {
  const id = await ownedMenuId(menuId);
  if (!MENU_IMAGE_KINDS.includes(kind)) throw new Error("Invalid image type");

  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No file uploaded");

  const ext = IMAGE_EXTENSIONS[file.type];
  if (!ext) throw new Error("Image must be PNG, JPEG, WebP, GIF, or SVG");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Image must be under 5MB");

  const dir = menuUploadDir(id);
  await mkdir(dir, { recursive: true });
  await clearMenuImage(id, kind);

  const filename = `${kind}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  const url = `/uploads/menus/${id}/${filename}`;
  await prisma.menu.update({
    where: { id },
    data: kind === "logo" ? { logoUrl: url } : { bannerUrl: url },
  });

  return { url };
}

/** Removes a menu's logo or banner image from disk and clears its URL. */
export async function removeMenuImage(menuId: string, kind: MenuImageKind): Promise<{ ok: true }> {
  const id = await ownedMenuId(menuId);
  if (!MENU_IMAGE_KINDS.includes(kind)) throw new Error("Invalid image type");

  await clearMenuImage(id, kind);
  await prisma.menu.update({
    where: { id },
    data: kind === "logo" ? { logoUrl: null } : { bannerUrl: null },
  });

  return { ok: true };
}

function dishUploadDir(itemId: string): string {
  return path.join(process.cwd(), "uploads", "dishes", itemId);
}

async function clearDishImage(itemId: string): Promise<void> {
  const dir = dishUploadDir(itemId);
  const existing = await readdir(dir).catch(() => [] as string[]);
  await Promise.all(
    existing.filter((f) => f.startsWith("dish.")).map((f) => unlink(path.join(dir, f)))
  );
}

/** Saves a dish's image to disk and records its URL on the menu item. */
export async function uploadDishImage(itemId: string, formData: FormData): Promise<{ url: string }> {
  const id = await ownedItemId(itemId);

  const file = formData.get("file");
  if (!(file instanceof File)) throw new Error("No file uploaded");

  const ext = IMAGE_EXTENSIONS[file.type];
  if (!ext) throw new Error("Image must be PNG, JPEG, WebP, GIF, or SVG");
  if (file.size > MAX_IMAGE_BYTES) throw new Error("Image must be under 5MB");

  const dir = dishUploadDir(id);
  await mkdir(dir, { recursive: true });
  await clearDishImage(id);

  const filename = `dish.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  const url = `/uploads/dishes/${id}/${filename}`;
  await prisma.menuItem.update({ where: { id }, data: { imageUrl: url } });

  return { url };
}

/** Removes a dish's image from disk and clears its URL. */
export async function removeDishImage(itemId: string): Promise<{ ok: true }> {
  const id = await ownedItemId(itemId);

  await clearDishImage(id);
  await prisma.menuItem.update({ where: { id }, data: { imageUrl: null } });

  return { ok: true };
}

export async function deleteMenuItem(itemId: string): Promise<{ id: string }> {
  const id = await ownedItemId(itemId);
  await prisma.menuItem.delete({ where: { id } });
  return { id };
}

export interface CreateDishInput {
  menuId: string;
  name: string;
  type: string;
  cat: DishCategory;
  price: number;
  section: string;
}

export async function createMenuItem(input: CreateDishInput): Promise<Dish> {
  const session = await getSession();
  if (!session) throw new Error("Not signed in");

  const menuId = cleanText(input.menuId, 60);
  const name = cleanText(input.name, 200);
  if (!menuId) throw new Error("Missing menu");
  if (!name) throw new Error("A dish needs a name");

  const menu = await prisma.menu.findFirst({
    where: { id: menuId, owner: { email: session.email } },
    select: { id: true },
  });
  if (!menu) throw new Error("Menu not found");

  const last = await prisma.menuItem.findFirst({
    where: { menuId: menu.id },
    orderBy: { position: "desc" },
    select: { position: true },
  });

  const item = await prisma.menuItem.create({
    data: {
      menuId: menu.id,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "dish",
      name,
      type: cleanText(input.type, 100) ?? "Dish",
      category: input.cat === "nonveg" ? "nonveg" : "veg",
      price: cleanPrice(input.price),
      ingredients: [],
      section: cleanText(input.section, 120) ?? "Menu",
      position: (last?.position ?? -1) + 1,
    },
  });

  return toDish(item);
}
