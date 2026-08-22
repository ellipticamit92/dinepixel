import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMenuForSession } from "@/lib/menu-repo";
import { AdminTablesPage } from "@/components/templates/admin-tables-page";

export const metadata: Metadata = {
  title: "Table QR codes | Dinepixel",
};

export default async function Tables() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/tables");

  const menu = await getMenuForSession();

  return <AdminTablesPage session={session} menu={menu} />;
}
