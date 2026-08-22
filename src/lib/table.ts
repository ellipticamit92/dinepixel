"use client";

import { useEffect, useState } from "react";

function tableKey(slug: string): string {
  return `dinepixel-table:${slug}`;
}

/** Remembers which table a guest scanned in for, so it survives navigating from the menu to the cart. */
export function storeTable(slug: string, table: string): void {
  if (typeof window === "undefined" || !table) return;
  window.localStorage.setItem(tableKey(slug), table);
}

function readTable(slug: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(tableKey(slug));
}

export function useStoredTable(slug: string): string | null {
  const [table, setTable] = useState<string | null>(null);

  useEffect(() => {
    // localStorage doesn't exist during SSR, so the initial read can only happen post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTable(readTable(slug));
  }, [slug]);

  return table;
}
