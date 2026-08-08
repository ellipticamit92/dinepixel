import type { Metadata } from "next";
import { AuthPage } from "@/components/templates/auth-page";

export const metadata: Metadata = {
  title: "Register | Plate",
};

export default async function Signup({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next, error } = await searchParams;
  return <AuthPage mode="register" next={next} error={error} />;
}
