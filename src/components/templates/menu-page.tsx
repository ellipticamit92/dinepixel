import { MenuContent } from "@/components/organisms/menu-content";
import type { Dish } from "@/lib/menu-seed";
import type { MenuTheme } from "@/lib/menu-repo";

export function MenuPage({
  slug,
  restaurantName,
  description,
  logoUrl,
  bannerUrl,
  zomatoUrl,
  zomatoRating,
  swiggyUrl,
  swiggyRating,
  dishes,
  table,
  theme,
  isOpen = true,
  paymentQrUrl,
  upiId,
  paypalUrl,
  stripeUrl,
}: {
  slug: string;
  restaurantName: string;
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  zomatoUrl?: string | null;
  zomatoRating?: number | null;
  swiggyUrl?: string | null;
  swiggyRating?: number | null;
  dishes: Dish[];
  table?: string;
  theme?: MenuTheme;
  isOpen?: boolean;
  paymentQrUrl?: string | null;
  upiId?: string | null;
  paypalUrl?: string | null;
  stripeUrl?: string | null;
}) {
  return (
    <MenuContent
      slug={slug}
      restaurantName={restaurantName}
      description={description}
      logoUrl={logoUrl}
      bannerUrl={bannerUrl}
      zomatoUrl={zomatoUrl}
      zomatoRating={zomatoRating}
      swiggyUrl={swiggyUrl}
      swiggyRating={swiggyRating}
      dishes={dishes}
      table={table}
      theme={theme}
      isOpen={isOpen}
      paymentQrUrl={paymentQrUrl}
      upiId={upiId}
      paypalUrl={paypalUrl}
      stripeUrl={stripeUrl}
    />
  );
}
