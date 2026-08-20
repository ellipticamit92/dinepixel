import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { BuilderPage } from "@/components/templates/builder-page";

export const metadata: Metadata = {
  title: "Builder | Dinepixel",
};

export default async function Builder() {
  const session = await getSession();
  if (!session) redirect("/login?next=/builder");

  return <BuilderPage session={session} />;
}
