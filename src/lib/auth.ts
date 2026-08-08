import { cookies } from "next/headers";

export const SESSION_COOKIE = "plate_session";

export interface Session {
  email: string;
  name: string;
}

export async function getSession(): Promise<Session | null> {
  const raw = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (typeof parsed?.email === "string" && typeof parsed?.name === "string") {
      return parsed as Session;
    }
    return null;
  } catch {
    return null;
  }
}
