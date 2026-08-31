import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getAllMenusForSession, getMenuForSession, getRegularCustomers } from "@/lib/menu-repo";
import { AdminDashboardPage } from "@/components/templates/admin-dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard | Dinepixel",
};

export default async function Admin(props: PageProps<"/admin">) {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");

  const { menu: menuId } = await props.searchParams;
  const selectedMenuId = typeof menuId === "string" ? menuId : undefined;

  const [menu, allMenus] = await Promise.all([
    getMenuForSession(selectedMenuId),
    getAllMenusForSession(),
  ]);

  const regularCustomers = menu ? await getRegularCustomers(menu.id) : [];

  return (
    <AdminDashboardPage
      session={session}
      menu={menu}
      allMenus={allMenus}
      regularCustomers={regularCustomers}
    />
  );
}
