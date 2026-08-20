import { MenuContent } from "@/components/organisms/menu-content";
import type { Dish } from "@/lib/menu-seed";

export function MenuPage({
  restaurantName,
  logoUrl,
  bannerUrl,
  dishes,
}: {
  restaurantName: string;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  dishes: Dish[];
}) {
  return (
    <MenuContent restaurantName={restaurantName} logoUrl={logoUrl} bannerUrl={bannerUrl} dishes={dishes} />
  );
}
