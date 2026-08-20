import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMenuBySlug } from "@/lib/menu-repo";
import { CartPage } from "@/components/templates/cart-page";

export async function generateMetadata(props: PageProps<"/[slug]/cart">): Promise<Metadata> {
  const { slug } = await props.params;
  const menu = await getMenuBySlug(slug);
  return { title: menu ? `Cart — ${menu.restaurantName}` : "Cart" };
}

export default async function Cart(props: PageProps<"/[slug]/cart">) {
  const { slug } = await props.params;
  const menu = await getMenuBySlug(slug);
  if (!menu) notFound();

  return <CartPage slug={slug} restaurantName={menu.restaurantName} />;
}
