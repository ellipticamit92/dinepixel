import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MenuPage } from "@/components/templates/menu-page";
import { getMenuBySlug } from "@/lib/menu-repo";

export async function generateMetadata(props: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const menu = await getMenuBySlug(slug);
  return { title: menu ? `${menu.restaurantName} — Menu` : "Menu not found" };
}

export default async function Menu(props: PageProps<"/[slug]">) {
  const { slug } = await props.params;
  const menu = await getMenuBySlug(slug);
  if (!menu) notFound();

  return (
    <MenuPage
      restaurantName={menu.restaurantName}
      logoUrl={menu.logoUrl}
      bannerUrl={menu.bannerUrl}
      dishes={menu.dishes}
    />
  );
}
