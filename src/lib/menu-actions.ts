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
  ingredients: string[];
}

export async function updateMenuItem(input: UpdateDishInput): Promise<Dish> {
  const id = await ownedItemId(input.id);

  const name = cleanText(input.name, 200);
  if (!name) throw new Error("A dish needs a name");

  const item = await prisma.menuItem.update({
    where: { id },
    data: {
      name,
      description: cleanText(input.description, 2000),
      category: input.cat === "nonveg" ? "nonveg" : "veg",
      price: cleanPrice(input.price),
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

function menuUploadDir(menuId: string): string {
  return path.join(process.cwd(), "public", "uploads", "menus", menuId);
}

async function clearMenuImage(menuId: string, kind: MenuImageKind): Promise<void> {
  const dir = menuUploadDir(menuId);
  const existing = await readdir(dir).catch(() => [] as string[]);
  await Promise.all(
    existing.filter((f) => f.startsWith(`${kind}.`)).map((f) => unlink(path.join(dir, f)))
  );
}

/** Saves a logo or banner image to disk under public/uploads and records its URL on the menu. */
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
