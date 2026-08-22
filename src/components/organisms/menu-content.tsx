"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { ImageIcon, ShoppingCart } from "lucide-react";
import { PhoneHero } from "@/components/molecules/phone-hero";
import { InstallHint } from "@/components/molecules/install-hint";
import { RAISED_SM, INSET, INSET_SM, ACCENT_GLOW } from "@/lib/neu-shadows";
import { cartCount, cartTotal, useCart } from "@/lib/cart";
import { storeTable } from "@/lib/table";
import {
  dishPriceLabel,
  ingredientSummary,
  markColor,
  matchesTab,
  priceStr,
  type Dish,
  type DishCategory,
  type MenuSection,
} from "@/lib/menu-seed";

type SectionFilter = "all" | MenuSection;

export function MenuContent({
  slug,
  restaurantName,
  logoUrl,
  bannerUrl,
  zomatoUrl,
  zomatoRating,
  swiggyUrl,
  swiggyRating,
  dishes,
  table,
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
  table?: string;
}) {
  const [tab, setTab] = useState<DishCategory>("veg");
  const [section, setSection] = useState<SectionFilter>("all");
  const { items: cartItems, add: addToCart } = useCart(slug);

  useEffect(() => {
    if (table) storeTable(slug, table);
  }, [slug, table]);

  const addDishToCart = (dish: Dish) => {
    addToCart({ id: dish.id, name: dish.name, price: dish.price, imageUrl: dish.imageUrl });
    toast.success(`${dish.name} added to cart`);
  };

  const filtered = dishes.filter(
    (d) => matchesTab(d, tab) && (section === "all" || d.section === section)
  );
  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);
  // Sections span both categories so the chip row stays stable when switching
  // Veg/Non-Veg — only the dish list below should change, not the chips.
  const availableSections = Array.from(new Set(dishes.map((d) => d.section)));
  const groups = availableSections
    .map((s) => ({ section: s, dishes: rest.filter((d) => d.section === s) }))
    .filter((g) => g.dishes.length > 0);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-background pb-28 font-sans text-[oklch(0.28_0.02_60)]">
      <PhoneHero
        height={190}
        logoSize={64}
        name={restaurantName}
        logoUrl={logoUrl}
        bannerUrl={bannerUrl}
        zomatoUrl={zomatoUrl}
        zomatoRating={zomatoRating}
        swiggyUrl={swiggyUrl}
        swiggyRating={swiggyRating}
      />

      <InstallHint />

      <div className="flex gap-1.5 overflow-x-auto px-4 pt-4 pb-1">
        <button
          type="button"
          onClick={() => setSection("all")}
          className="shrink-0 rounded-full px-3.5 py-2 font-condensed text-[12.5px] font-bold tracking-[0.2px]"
          style={{
            color: section === "all" ? "oklch(0.28 0.02 60)" : "oklch(0.55 0.03 60)",
            boxShadow: section === "all" ? INSET_SM : RAISED_SM,
          }}
        >
          All
        </button>
        {availableSections.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSection(s)}
            className="shrink-0 rounded-full px-3.5 py-2 font-condensed text-[12.5px] font-bold tracking-[0.2px]"
            style={{
              color: section === s ? "oklch(0.28 0.02 60)" : "oklch(0.55 0.03 60)",
              boxShadow: section === s ? INSET_SM : RAISED_SM,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="flex flex-1 flex-col gap-3 px-4 pt-1">
        {featured ? (
          <div className="overflow-hidden rounded-2xl bg-background" style={{ boxShadow: RAISED_SM }}>
            <div className="relative h-36">
              {featured.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={featured.imageUrl} alt="" className="size-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[oklch(0.87_0.02_74)] text-[oklch(0.68_0.03_74)]">
                  <ImageIcon className="size-7" strokeWidth={1.3} />
                </div>
              )}
              <div className="absolute top-2.5 left-2.5 rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-[0.4px] text-primary-foreground uppercase">
                ★ Popular this week
              </div>
            </div>
            <div className="px-4 pt-3 pb-4">
              <div className="flex items-start justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                  <span
                    className="inline-flex size-4 shrink-0 items-center justify-center rounded-[3px] border-[1.5px]"
                    style={{ borderColor: markColor(featured.cat) }}
                  >
                    <span className="size-1.5 rounded-full" style={{ background: markColor(featured.cat) }} />
                  </span>
                  <span className="font-condensed text-base font-bold text-[oklch(0.26_0.02_60)]">
                    {featured.name}
                  </span>
                </div>
                <span className="font-condensed text-base font-bold whitespace-nowrap text-primary">
                  {dishPriceLabel(featured)}
                </span>
              </div>
              <div className="mt-1.5 text-[12.5px] leading-[1.4] text-[oklch(0.52_0.02_60)]">
                {ingredientSummary(featured)}
              </div>
              <button
                type="button"
                onClick={() => addDishToCart(featured)}
                className="mt-3 w-full rounded-xl py-2.5 text-center font-condensed text-[13px] font-bold tracking-[0.3px] text-accent-foreground"
                style={{ boxShadow: INSET_SM }}
              >
                ＋ Add to Order
              </button>
            </div>
          </div>
        ) : null}

        {groups.map(({ section: s, dishes: sectionDishes }) => (
          <div key={s} className="flex flex-col gap-3">
            {section === "all" ? (
              <div className="flex items-center gap-1.5 px-0.5 text-[11px] font-bold tracking-[0.6px] text-[oklch(0.52_0.03_60)] uppercase">
                {s}
                <span className="h-px flex-1" style={{ background: "oklch(0.85 0.02 72)" }} />
              </div>
            ) : null}
            {sectionDishes.map((d) => (
              <div
                key={d.id}
                className="flex items-center gap-3 rounded-2xl bg-background p-3.5"
                style={{ boxShadow: RAISED_SM }}
              >
                <span
                  className="inline-flex size-[18px] shrink-0 items-center justify-center rounded-[3px] border-[1.5px]"
                  style={{ borderColor: markColor(d.cat) }}
                >
                  <span className="size-2 rounded-full" style={{ background: markColor(d.cat) }} />
                </span>
                {d.imageUrl ? (
                  <div className="size-11 shrink-0 overflow-hidden rounded-[10px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={d.imageUrl} alt="" className="size-full object-cover" />
                  </div>
                ) : null}
                <div className="min-w-0 flex-1">
                  <div className="font-condensed text-[15px] font-bold text-[oklch(0.26_0.02_60)]">
                    {d.name}
                  </div>
                  <div className="text-[11px] font-semibold tracking-[0.6px] text-[oklch(0.6_0.03_60)] uppercase">
                    {ingredientSummary(d)}
                  </div>
                </div>
                <div className="font-condensed text-[15px] font-bold whitespace-nowrap text-primary">
                  {dishPriceLabel(d)}
                </div>
                <button
                  type="button"
                  onClick={() => addDishToCart(d)}
                  className="flex size-7 shrink-0 items-center justify-center rounded-[10px] text-lg leading-none text-accent-foreground"
                  style={{ boxShadow: RAISED_SM }}
                >
                  +
                </button>
              </div>
            ))}
          </div>
        ))}

        {!featured && groups.length === 0 ? (
          <div className="py-10 text-center text-sm font-semibold text-muted-foreground">
            No dishes in this category yet.
          </div>
        ) : null}
      </div>

      <div className="px-4 pt-6 text-center">
        <Link
          href="/terms"
          className="text-[11px] font-semibold tracking-[0.3px] text-[oklch(0.6_0.03_60)] underline-offset-2 hover:underline"
        >
          Terms &amp; Conditions
        </Link>
      </div>

      <div
        className="fixed right-0 bottom-0 left-0 z-10 mx-auto max-w-md px-4 pt-4 pb-5"
        style={{ background: "linear-gradient(transparent, var(--background) 35%)" }}
      >
        {cartItems.length > 0 ? (
          <Link
            href={`/${slug}/cart`}
            className="mb-2 flex items-center justify-between rounded-2xl bg-primary px-4 py-3 font-condensed text-sm font-bold text-primary-foreground"
            style={{ boxShadow: ACCENT_GLOW }}
          >
            <span className="flex items-center gap-2">
              <ShoppingCart className="size-4" strokeWidth={2} />
              {cartCount(cartItems)} item{cartCount(cartItems) > 1 ? "s" : ""} · {priceStr(cartTotal(cartItems))}
            </span>
            <span>View Cart →</span>
          </Link>
        ) : null}
        <div className="flex gap-2 rounded-2xl p-1.5" style={{ boxShadow: INSET, background: "var(--background)" }}>
          <button
            type="button"
            onClick={() => {
              setTab("veg");
              setSection("all");
            }}
            className="font-condensed flex-1 rounded-xl py-3 text-sm font-bold tracking-[0.3px]"
            style={{
              color: tab === "veg" ? "oklch(0.4 0.12 150)" : "oklch(0.52 0.03 60)",
              boxShadow: tab === "veg" ? INSET_SM : RAISED_SM,
            }}
          >
            Veg
          </button>
          <button
            type="button"
            onClick={() => {
              setTab("nonveg");
              setSection("all");
            }}
            className="font-condensed flex-1 rounded-xl py-3 text-sm font-bold tracking-[0.3px]"
            style={{
              color: tab === "nonveg" ? "oklch(0.48 0.19 25)" : "oklch(0.52 0.03 60)",
              boxShadow: tab === "nonveg" ? INSET_SM : RAISED_SM,
            }}
          >
            Non-Veg
          </button>
        </div>
      </div>
    </div>
  );
}
