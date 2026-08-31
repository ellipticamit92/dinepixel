import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMenuBySlug } from "@/lib/menu-repo";
import { SavedPage } from "@/components/templates/saved-page";

export async function generateMetadata(props: PageProps<"/[slug]/saved">): Promise<Metadata> {
  const { slug } = await props.params;
  const menu = await getMenuBySlug(slug);
  return { title: menu ? `Saved — ${menu.restaurantName}` : "Saved" };
}

export default async function Saved(props: PageProps<"/[slug]/saved">) {
  const { slug } = await props.params;
  const menu = await getMenuBySlug(slug);
  if (!menu) notFound();

  return (
    <SavedPage
      slug={slug}
      restaurantName={menu.restaurantName}
      theme={menu.theme}
      description={menu.description}
      logoUrl={menu.logoUrl}
      bannerUrl={menu.bannerUrl}
      zomatoUrl={menu.zomatoUrl}
      zomatoRating={menu.zomatoRating}
      swiggyUrl={menu.swiggyUrl}
      swiggyRating={menu.swiggyRating}
    />
  );
}
