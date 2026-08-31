import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMenuForSession } from "@/lib/menu-repo";
import { AdminPaymentPage } from "@/components/templates/admin-payment-page";

export const metadata: Metadata = {
  title: "Payment | Dinepixel",
};

export default async function Payment() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/payment");

  const menu = await getMenuForSession();

  return <AdminPaymentPage session={session} menu={menu} />;
}
