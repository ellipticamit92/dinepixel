import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMenuForSession } from "@/lib/menu-repo";
import { AdminSettingsPage } from "@/components/templates/admin-settings-page";

export const metadata: Metadata = {
  title: "Settings | Dinepixel",
};

export default async function Settings() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/settings");

  const menu = await getMenuForSession();

  return <AdminSettingsPage session={session} menu={menu} />;
}
