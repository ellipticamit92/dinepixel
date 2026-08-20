import type { Metadata } from "next";
import { AuthPage } from "@/components/templates/auth-page";

export const metadata: Metadata = {
  title: "Sign in | Dinepixel",
};

export default async function Login({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return <AuthPage mode="login" next={next} error={error} />;
}
