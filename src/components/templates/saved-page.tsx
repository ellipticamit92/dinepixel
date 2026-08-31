"use client";

import Link from "next/link";
import { ChevronLeft, CircleUserRound, Heart, ShoppingCart, Table2, UtensilsCrossed } from "lucide-react";
import { toast } from "sonner";
import { cartCount, cartTotal, useCart } from "@/lib/cart";
import { useSaved } from "@/lib/saved";
import { priceStr, type Dish } from "@/lib/menu-seed";
import { ACCENT_GLOW, INSET_SM, RAISED_LG, RAISED_SM } from "@/lib/neu-shadows";
import { DishCard } from "@/components/molecules/dish-card";
import { PhoneHero } from "@/components/molecules/phone-hero";
import type { MenuTheme } from "@/lib/menu-repo";

export function SavedPage({
  slug,
  restaurantName,
  theme = "plate",
  description,
  logoUrl,
  bannerUrl,
  zomatoUrl,
  zomatoRating,
  swiggyUrl,
  swiggyRating,
  isOpen = true,
}: {
  slug: string;
  restaurantName: string;
  theme?: MenuTheme;
  description?: string | null;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  zomatoUrl?: string | null;
  zomatoRating?: number | null;
  swiggyUrl?: string | null;
  swiggyRating?: number | null;
  isOpen?: boolean;
}) {
  const { items: savedItems, remove } = useSaved(slug);
  const { items: cartItems, add: addToCart } = useCart(slug);
  const count = cartCount(cartItems);
  const total = cartTotal(cartItems);

  return (
    <div
      data-menu-theme={theme}
      className="mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background pb-28 font-sans text-[oklch(0.28_0.02_60)]"
      style={!isOpen ? { filter: "grayscale(1)" } : undefined}
    >
      {/* Hero banner */}
      <div className="relative">
        <PhoneHero
          height={190}
          logoSize={64}
          name={restaurantName}
          {...(description ? { location: description } : {})}
          logoUrl={logoUrl}
          bannerUrl={bannerUrl}
          zomatoUrl={zomatoUrl}
          zomatoRating={zomatoRating}
          swiggyUrl={swiggyUrl}
          swiggyRating={swiggyRating}
          isOpen={isOpen}
        />
        {/* Back button overlaid on top-left of banner */}
        <Link
          href={`/${slug}`}
          className="absolute top-[18px] left-[18px] flex size-9 shrink-0 items-center justify-center rounded-[10px] backdrop-blur-[6px]"
          style={{ background: "oklch(0.95 0.012 84 / 0.35)", border: "1px solid oklch(1 0 0 / 0.25)" }}
        >
          <ChevronLeft className="size-4 text-white" strokeWidth={2.5} />
        </Link>
      </div>

      {/* Header bar */}
      <div className="flex items-center gap-3 px-5 pt-3 pb-1">
        <h1 className="font-display text-xl text-[oklch(0.24_0.02_60)]">Saved dishes</h1>
        {savedItems.length > 0 ? (
          <span
            className="ml-1 rounded-full px-2.5 py-[3px] font-condensed text-xs font-bold text-primary"
            style={{ boxShadow: INSET_SM }}
          >
            {savedItems.length}
          </span>
        ) : null}
      </div>

      {savedItems.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
          <Heart className="size-8 text-muted-foreground" strokeWidth={1.5} />
          <div className="text-[15px] font-semibold text-muted-foreground">No saved dishes yet.</div>
          <Link
            href={`/${slug}`}
            className="rounded-xl px-5 py-2.5 font-condensed text-sm font-bold text-[oklch(0.35_0.02_60)]"
            style={{ boxShadow: RAISED_SM }}
          >
            Browse the menu
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-3 px-5 pt-1">
          {savedItems.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish as Dish}
              onAdd={(item) => { addToCart(item); toast.success(`${dish.name} added to cart`); }}
              onRemove={() => { remove(dish.id); toast.success(`${dish.name} removed from saved`); }}
            />
          ))}
        </div>
      )}

      {/* Fixed bottom nav */}
      <div
        className="fixed inset-x-0 bottom-0 z-10 mx-auto max-w-md px-5 pt-3 pb-5"
        style={{ background: "linear-gradient(transparent, var(--background) 30%)" }}
      >
        <div
          className="relative flex items-center justify-between rounded-[22px] px-5.5 py-3"
          style={{ background: "var(--background)", boxShadow: RAISED_LG }}
        >
          <Link href={`/${slug}`} className="flex flex-col items-center gap-1">
            <UtensilsCrossed className="size-[19px] text-muted-foreground" strokeWidth={2} />
            <span className="text-[10px] font-bold tracking-[0.2px] text-muted-foreground">Menu</span>
          </Link>

          <button type="button" className="relative flex flex-col items-center gap-1">
            <Heart className="size-[19px] fill-[var(--nonveg)] text-[var(--nonveg)]" strokeWidth={2} />
            {savedItems.length > 0 ? (
              <span
                className="absolute -top-1 -right-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
                style={{ background: "var(--nonveg)" }}
              >
                {savedItems.length}
              </span>
            ) : null}
            <span className="text-[10px] font-bold tracking-[0.2px] text-[var(--nonveg)]">Saved</span>
          </button>

          <Link
            href={`/${slug}/cart`}
            aria-label={`View cart, ${count} item${count === 1 ? "" : "s"}, ${priceStr(total)}`}
            className="relative -mt-6.5 flex size-[46px] items-center justify-center rounded-[15px] text-primary-foreground"
            style={{ background: "var(--primary)", boxShadow: ACCENT_GLOW }}
          >
            <ShoppingCart className="size-[19px]" strokeWidth={2} />
            {cartItems.length > 0 ? (
              <span
                className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-primary-foreground"
                style={{ background: "var(--nonveg)" }}
              >
                {count}
              </span>
            ) : null}
          </Link>

          <button type="button" className="flex flex-col items-center gap-1">
            <Table2 className="size-[19px] text-muted-foreground" strokeWidth={2} />
            <span className="text-[10px] font-bold tracking-[0.2px] text-muted-foreground">Table</span>
          </button>

          <button type="button" className="flex flex-col items-center gap-1">
            <CircleUserRound className="size-[19px] text-muted-foreground" strokeWidth={2} />
            <span className="text-[10px] font-bold tracking-[0.2px] text-muted-foreground">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
