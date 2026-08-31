"use server";

import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export interface IngredientRow {
  id: string;
  name: string;
  unit: string;
  currentStock: number;
  minStock: number;
}

const SELECT = { id: true, name: true, unit: true, currentStock: true, minStock: true } as const;

export async function getIngredients(menuId: string): Promise<IngredientRow[]> {
  const session = await getSession();
  if (!session) throw new Error("Not signed in");
  return prisma.ingredient.findMany({
    where: { menuId, menu: { owner: { email: session.email } } },
    orderBy: { createdAt: "asc" },
    select: SELECT,
  });
}

export async function createIngredient(
  menuId: string,
  data: { name: string; unit: string; currentStock: number; minStock: number }
): Promise<IngredientRow> {
  const session = await getSession();
  if (!session) throw new Error("Not signed in");
  const menu = await prisma.menu.findFirst({ where: { id: menuId, owner: { email: session.email } } });
  if (!menu) throw new Error("Menu not found");
  return prisma.ingredient.create({ data: { menuId, ...data }, select: SELECT });
}

async function verifyOwnership(ingredientId: string, menuId: string, email: string) {
  const row = await prisma.ingredient.findFirst({
    where: { id: ingredientId, menuId, menu: { owner: { email } } },
    select: { id: true },
  });
  if (!row) throw new Error("Ingredient not found");
}

export async function updateIngredient(
  ingredientId: string,
  menuId: string,
  data: { name: string; unit: string; currentStock: number; minStock: number }
): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Not signed in");
  await verifyOwnership(ingredientId, menuId, session.email);
  await prisma.ingredient.update({ where: { id: ingredientId }, data });
}

export async function adjustIngredientStock(
  ingredientId: string,
  menuId: string,
  currentStock: number
): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Not signed in");
  await verifyOwnership(ingredientId, menuId, session.email);
  await prisma.ingredient.update({ where: { id: ingredientId }, data: { currentStock } });
}

export async function deleteIngredient(ingredientId: string, menuId: string): Promise<void> {
  const session = await getSession();
  if (!session) throw new Error("Not signed in");
  await verifyOwnership(ingredientId, menuId, session.email);
  await prisma.ingredient.delete({ where: { id: ingredientId } });
}
