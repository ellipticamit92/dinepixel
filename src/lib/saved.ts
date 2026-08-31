"use client";

import { useCallback, useEffect, useState } from "react";
import type { DishCategory } from "@/lib/menu-seed";

export interface SavedDish {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  cat: DishCategory;
  section: string;
  type: string;
  ingredients: string[];
}

const SAVED_EVENT = "dinepixel-saved-changed";

function savedKey(slug: string): string {
  return `dinepixel-saved:${slug}`;
}

function readSaved(slug: string): SavedDish[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(savedKey(slug));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeSaved(slug: string, items: SavedDish[]): void {
  window.localStorage.setItem(savedKey(slug), JSON.stringify(items));
  window.dispatchEvent(new Event(SAVED_EVENT));
}

/** Saved dishes are scoped per cafe slug and live in localStorage — no auth needed. */
export function useSaved(slug: string) {
  const [items, setItems] = useState<SavedDish[]>([]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(readSaved(slug));
    const handler = () => setItems(readSaved(slug));
    window.addEventListener(SAVED_EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(SAVED_EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, [slug]);

  const toggle = useCallback(
    (dish: SavedDish) => {
      const current = readSaved(slug);
      const exists = current.some((i) => i.id === dish.id);
      const next = exists ? current.filter((i) => i.id !== dish.id) : [...current, dish];
      writeSaved(slug, next);
      setItems(next);
    },
    [slug]
  );

  const remove = useCallback(
    (id: string) => {
      const current = readSaved(slug);
      const next = current.filter((i) => i.id !== id);
      writeSaved(slug, next);
      setItems(next);
    },
    [slug]
  );

  const isSaved = useCallback((id: string) => readSaved(slug).some((i) => i.id === id), [slug]);

  return { items, toggle, remove, isSaved };
}
