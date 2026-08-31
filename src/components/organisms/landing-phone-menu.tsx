import { PhoneMenuPreview } from "@/components/organisms/phone-menu-preview";
import { DEMO_DISHES } from "@/lib/menu-seed";

export function LandingPhoneMenu() {
  return (
    <div className="flex justify-center">
      <div className="w-[320px]">
        <PhoneMenuPreview
          dishes={DEMO_DISHES}
          slug="landing-demo"
          restaurantName="Bloom Cafe"
          description="Fine dining · Downtown"
          bannerUrl="/cafe_banner.jpg"
          float
        />
      </div>
    </div>
  );
}
