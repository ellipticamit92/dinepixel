import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { AdminDashboardPage } from "@/components/templates/admin-dashboard-page";

export const metadata: Metadata = {
  title: "Dashboard | Plate",
};

export default async function Admin() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin");

  return <AdminDashboardPage session={session} />;
}
