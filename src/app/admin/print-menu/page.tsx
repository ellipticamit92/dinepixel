import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { getMenuForSession } from "@/lib/menu-repo";
import { PrintMenuGallery } from "@/components/organisms/print-menu-gallery";

export const metadata: Metadata = {
  title: "Print Menu | Dinepixel",
};

export default async function PrintMenuPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin/print-menu");

  const menu = await getMenuForSession();

  return <PrintMenuGallery session={session} menu={menu} />;
}
