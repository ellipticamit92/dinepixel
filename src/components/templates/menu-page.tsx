import { MenuContent } from "@/components/organisms/menu-content";
import type { Dish } from "@/lib/menu-seed";

export function MenuPage({ restaurantName, dishes }: { restaurantName: string; dishes: Dish[] }) {
  return <MenuContent restaurantName={restaurantName} dishes={dishes} />;
}
