"use client";

import { useEffect, useState } from "react";

function phoneKey(slug: string): string {
  return `dinepixel-phone:${slug}`;
}

/** Remembers a guest's opted-in phone number so repeat orders don't require retyping it. */
export function storePhone(slug: string, phone: string): void {
  if (typeof window === "undefined" || !phone) return;
  window.localStorage.setItem(phoneKey(slug), phone);
}

function readPhone(slug: string): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(phoneKey(slug));
}

export function useStoredPhone(slug: string): string | null {
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    // localStorage doesn't exist during SSR, so the initial read can only happen post-mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhone(readPhone(slug));
  }, [slug]);

  return phone;
}
