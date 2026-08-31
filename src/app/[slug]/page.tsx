import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { MenuPage } from "@/components/templates/menu-page";
import { getMenuBySlug, MENU_THEME_BACKGROUND } from "@/lib/menu-repo";

export async function generateViewport(props: PageProps<"/[slug]">): Promise<Viewport> {
  const { slug } = await props.params;
  const menu = await getMenuBySlug(slug);
  return { themeColor: MENU_THEME_BACKGROUND[menu?.theme ?? "plate"] };
}

export async function generateMetadata(props: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const menu = await getMenuBySlug(slug);
  if (!menu) return { title: "Menu not found" };

  const icon = menu.logoUrl ?? menu.bannerUrl ?? undefined;

  return {
    title: `${menu.restaurantName} — Menu`,
    manifest: `/${slug}/manifest.webmanifest`,
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: menu.restaurantName,
    },
    icons: icon ? { apple: icon } : undefined,
  };
}

export default async function Menu(props: PageProps<"/[slug]">) {
  const { slug } = await props.params;
  const { table } = await props.searchParams;
  const menu = await getMenuBySlug(slug);
  if (!menu) notFound();

  return (
    <MenuPage
      slug={slug}
      restaurantName={menu.restaurantName}
      description={menu.description}
      logoUrl={menu.logoUrl}
      bannerUrl={menu.bannerUrl}
      zomatoUrl={menu.zomatoUrl}
      zomatoRating={menu.zomatoRating}
      swiggyUrl={menu.swiggyUrl}
      swiggyRating={menu.swiggyRating}
      dishes={menu.dishes}
      table={typeof table === "string" ? table : undefined}
      theme={menu.theme}
      isOpen={menu.isOpen}
      paymentQrUrl={menu.paymentQrUrl}
      upiId={menu.upiId}
      paypalUrl={menu.paypalUrl}
      stripeUrl={menu.stripeUrl}
    />
  );
}
