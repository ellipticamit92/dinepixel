import { MenuContent } from "@/components/organisms/menu-content";
import type { Dish } from "@/lib/menu-seed";

export function MenuPage({
  slug,
  restaurantName,
  logoUrl,
  bannerUrl,
  zomatoUrl,
  zomatoRating,
  swiggyUrl,
  swiggyRating,
  dishes,
}: {
  slug: string;
  restaurantName: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  zomatoUrl?: string | null;
  zomatoRating?: number | null;
  swiggyUrl?: string | null;
  swiggyRating?: number | null;
  dishes: Dish[];
}) {
  return (
    <MenuContent
      slug={slug}
      restaurantName={restaurantName}
      logoUrl={logoUrl}
      bannerUrl={bannerUrl}
      zomatoUrl={zomatoUrl}
      zomatoRating={zomatoRating}
      swiggyUrl={swiggyUrl}
      swiggyRating={swiggyRating}
      dishes={dishes}
    />
  );
}
