"use client";

import { useCallback, useEffect, useState } from "react";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  qty: number;
}

const CART_EVENT = "dinepixel-cart-changed";

function cartKey(slug: string): string {
  return `dinepixel-cart:${slug}`;
}

function readCart(slug: string): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(cartKey(slug));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCart(slug: string, items: CartItem[]): void {
  window.localStorage.setItem(cartKey(slug), JSON.stringify(items));
  window.dispatchEvent(new Event(CART_EVENT));
}

export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

export function cartTotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.qty * i.price, 0);
}

/** Cart is scoped per cafe slug and lives in localStorage — no backend, no auth needed for a visitor cart. */
export function useCart(slug: string) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    // localStorage doesn't exist during SSR, so the initial read can only happen post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readCart(slug));
    const handler = () => setItems(readCart(slug));
    window.addEventListener(CART_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(CART_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [slug]);

  const add = useCallback(
    (item: Omit<CartItem, "qty">) => {
      const current = readCart(slug);
      const existing = current.find((i) => i.id === item.id);
      const next = existing
        ? current.map((i) => (i.id === item.id ? { ...i, qty: i.qty + 1 } : i))
        : [...current, { ...item, qty: 1 }];
      writeCart(slug, next);
      setItems(next);
    },
    [slug]
  );

  const setQty = useCallback(
    (id: string, qty: number) => {
      const current = readCart(slug);
      const next =
        qty <= 0
          ? current.filter((i) => i.id !== id)
          : current.map((i) => (i.id === id ? { ...i, qty } : i));
      writeCart(slug, next);
      setItems(next);
    },
    [slug]
  );

  return { items, add, setQty };
}
