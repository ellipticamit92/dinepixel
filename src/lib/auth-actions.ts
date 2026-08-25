"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { SESSION_COOKIE, type Session } from "@/lib/auth";

const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") ? next : "/admin";
}

async function setSession(session: Session) {
  (await cookies()).set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!email || !password) {
    redirect(`/login?next=${encodeURIComponent(next)}&error=missing`);
  }

  await setSession({ email, name: email.split("@")[0] });
  redirect(next);
}

export async function register(formData: FormData) {
  const restaurantName = String(formData.get("restaurantName") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const next = safeNext(formData.get("next"));

  if (!email || !password) {
    redirect(`/signup?next=${encodeURIComponent(next)}&error=missing`);
  }

  await setSession({ email, name: restaurantName || email.split("@")[0] });
  redirect(next);
}

export async function logout() {
  (await cookies()).delete(SESSION_COOKIE);
  revalidatePath("/", "layout");
  redirect("/login");
}
