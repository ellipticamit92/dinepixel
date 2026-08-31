"use client";

import { CircleUserRound, CreditCard, Heart, ShoppingCart, UtensilsCrossed } from "lucide-react";
import { PhoneFrame } from "@/components/molecules/phone-frame";
import { MenuContent } from "@/components/organisms/menu-content";
import { ACCENT_GLOW, INSET_SM, RAISED_LG, RAISED_SM } from "@/lib/neu-shadows";
import type { Dish } from "@/lib/menu-seed";
import type { MenuTheme } from "@/lib/menu-repo";

interface PhoneMenuPreviewProps {
  dishes: Dish[];
  slug?: string;
  restaurantName?: string;
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  zomatoUrl?: string | null;
  zomatoRating?: number | null;
  swiggyUrl?: string | null;
  swiggyRating?: number | null;
  theme?: MenuTheme;
  float?: boolean;
  empty?: boolean;
  isOpen?: boolean;
}

export function PhoneMenuPreview({
  dishes,
  slug = "preview",
  restaurantName = "Your Restaurant",
  description,
  logoUrl,
  bannerUrl,
  zomatoUrl,
  zomatoRating,
  swiggyUrl,
  swiggyRating,
  theme = "plate",
  float = false,
  empty = false,
  isOpen = true,
}: PhoneMenuPreviewProps) {
  return (
    <div data-menu-theme={theme}>
      <PhoneFrame float={float} screenStyle={{ background: "var(--background)" }}>
        {empty ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3.5 p-7 text-center">
            <div
              className="size-[52px] rounded-[15px]"
              style={{ background: "var(--background)", boxShadow: INSET_SM }}
            />
            <div className="text-[13.5px] leading-[1.4] font-semibold text-[var(--muted-foreground)]">
              Your live menu will appear here once AI reads your upload.
            </div>
          </div>
        ) : (
          <>
            {/* Scrollable menu content */}
            <div className="min-h-0 flex-1 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
              <MenuContent
                preview
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
                theme={theme}
                isOpen={isOpen}
              />
            </div>

            {/* Static bottom nav — always visible, never scrolls away */}
            <div
              className="shrink-0 px-3 pt-2 pb-3"
              style={{ background: "linear-gradient(transparent, var(--background) 40%)" }}
            >
              <div
                className="relative flex items-center justify-between rounded-[18px] px-4 py-2.5"
                style={{ background: "var(--background)", boxShadow: RAISED_LG }}
              >
                {/* Menu — active */}
                <button type="button" className="flex flex-col items-center gap-[3px]">
                  <UtensilsCrossed className="size-[16px] text-primary" strokeWidth={2} />
                  <span className="text-[8.5px] font-bold tracking-[0.2px] text-primary">Menu</span>
                </button>

                {/* Saved */}
                <button type="button" className="flex flex-col items-center gap-[3px]">
                  <Heart className="size-[16px] text-muted-foreground" strokeWidth={2} />
                  <span className="text-[8.5px] font-bold tracking-[0.2px] text-muted-foreground">Saved</span>
                </button>

                {/* Cart — elevated center button */}
                <button
                  type="button"
                  className="-mt-5 flex size-[38px] items-center justify-center rounded-[12px] text-primary-foreground"
                  style={{ background: "var(--primary)", boxShadow: ACCENT_GLOW }}
                >
                  <ShoppingCart className="size-[16px]" strokeWidth={2} />
                </button>

                {/* Pay */}
                <button type="button" className="flex flex-col items-center gap-[3px]">
                  <CreditCard className="size-[16px] text-muted-foreground" strokeWidth={2} />
                  <span className="text-[8.5px] font-bold tracking-[0.2px] text-muted-foreground">Pay</span>
                </button>

                {/* Profile */}
                <button type="button" className="flex flex-col items-center gap-[3px]">
                  <CircleUserRound className="size-[16px] text-muted-foreground" strokeWidth={2} />
                  <span className="text-[8.5px] font-bold tracking-[0.2px] text-muted-foreground">Profile</span>
                </button>
              </div>
            </div>
          </>
        )}
      </PhoneFrame>
    </div>
  );
}
