import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMenuForSession, getRegularCustomers } from "@/lib/menu-repo";
import { AdminDashboardPage } from "@/components/templates/admin-dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard | Dinepixel",
};

export default async function Admin() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");

  const menu = await getMenuForSession();
  
  const regularCustomers = menu ? await getRegularCustomers(menu.id) : [];

  return <AdminDashboardPage session={session} menu={menu} regularCustomers={regularCustomers} />;
}
