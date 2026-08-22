"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { CircleUserRound, Heart, ImageIcon, Search, ShoppingCart, Table2, UtensilsCrossed } from "lucide-react";
import { PhoneHero } from "@/components/molecules/phone-hero";
import { InstallHint } from "@/components/molecules/install-hint";
import { RAISED_SM, RAISED_LG, INSET_SM, ACCENT_GLOW } from "@/lib/neu-shadows";
import { cartCount, cartTotal, useCart } from "@/lib/cart";
import { storeTable, useStoredTable } from "@/lib/table";
import type { MenuTheme } from "@/lib/menu-repo";
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
  theme = "plate",
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
  theme?: MenuTheme;
}) {
  const [tab, setTab] = useState<DishCategory>("veg");
  const [section, setSection] = useState<SectionFilter>("all");
  const [query, setQuery] = useState("");
  const { items: cartItems, add: addToCart } = useCart(slug);
  const storedTable = useStoredTable(slug) ?? table;

  useEffect(() => {
    if (table) storeTable(slug, table);
  }, [slug, table]);

  const addDishToCart = (dish: Dish) => {
    addToCart({ id: dish.id, name: dish.name, price: dish.price, imageUrl: dish.imageUrl });
    toast.success(`${dish.name} added to cart`);
  };

  const searching = query.trim().length > 0;
  const matchesQuery = (d: Dish) => {
    if (!searching) return true;
    const q = query.trim().toLowerCase();
    return (
      d.name.toLowerCase().includes(q) ||
      d.type.toLowerCase().includes(q) ||
      d.ingredients.some((i) => i.toLowerCase().includes(q))
    );
  };

  const filtered = dishes.filter(
    (d) => matchesTab(d, tab) && (section === "all" || d.section === section) && matchesQuery(d)
  );
  // While searching, show a flat results list rather than spotlighting the first match.
  const featured = searching ? null : (filtered[0] ?? null);
  const rest = searching ? filtered : filtered.slice(1);
  // Sections span both categories so the chip row stays stable when switching
  // Veg/Non-Veg — only the dish list below should change, not the chips.
  const availableSections = Array.from(new Set(dishes.map((d) => d.section)));
  const groups = availableSections
    .map((s) => ({ section: s, dishes: rest.filter((d) => d.section === s) }))
    .filter((g) => g.dishes.length > 0);

  return (
    <div
      data-menu-theme={theme}
      className="mx-auto flex min-h-dvh max-w-md flex-col bg-background pb-28 font-sans text-[oklch(0.28_0.02_60)]"
    >
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

      <div className="px-4 pt-4 pb-1">
        <div className="flex items-center gap-2.5 rounded-2xl px-4 py-3" style={{ boxShadow: INSET_SM }}>
          <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={2} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search menu…"
            className="w-full border-none bg-transparent text-sm font-medium text-[oklch(0.32_0.02_60)] outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex gap-2 px-4 pt-2 pb-1">
        <button
          type="button"
          onClick={() => {
            setTab("veg");
            setSection("all");
          }}
          className="font-condensed flex-1 rounded-xl py-2.5 text-sm font-bold tracking-[0.3px]"
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
          className="font-condensed flex-1 rounded-xl py-2.5 text-sm font-bold tracking-[0.3px]"
          style={{
            color: tab === "nonveg" ? "oklch(0.48 0.19 25)" : "oklch(0.52 0.03 60)",
            boxShadow: tab === "nonveg" ? INSET_SM : RAISED_SM,
          }}
        >
          Non-Veg
        </button>
      </div>

      <div className="flex gap-1.5 overflow-x-auto px-4 pt-2 pb-1">
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
                className="mt-3 w-full rounded-xl py-2.5 text-center font-condensed text-[13px] font-bold tracking-[0.3px] text-accent-foreground transition-colors hover:text-primary"
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
                <span className="h-px flex-1" style={{ background: "var(--shadow-dark)" }} />
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
                  className="flex size-7 shrink-0 items-center justify-center rounded-[10px] text-lg leading-none text-accent-foreground transition-transform duration-150 hover:scale-110 hover:text-primary active:scale-95"
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
            {searching ? `No dishes match "${query.trim()}".` : "No dishes in this category yet."}
          </div>
        ) : null}
      </div>

      <div className="px-6.5 pt-7 pb-2 text-center">
        <div className="text-[10px] font-bold tracking-[1.2px] text-[oklch(0.6_0.03_60)] uppercase">
          {restaurantName} · Menu
        </div>
        <div className="font-display mt-2 text-[13px] leading-[1.5] text-[oklch(0.52_0.02_60)] italic">
          Thank you for dining with us.
        </div>
        <Link
          href="/terms"
          className="mt-3 inline-block text-[11px] font-semibold tracking-[0.3px] text-[oklch(0.6_0.03_60)] underline-offset-2 hover:underline"
        >
          Terms &amp; Conditions
        </Link>
      </div>

      <div
        className="fixed right-0 bottom-0 left-0 z-10 mx-auto max-w-md px-5 pt-3 pb-5"
        style={{ background: "linear-gradient(transparent, var(--background) 30%)" }}
      >
        <div
          className="relative flex items-center justify-between rounded-[22px] px-5.5 py-3"
          style={{ background: "var(--background)", boxShadow: RAISED_LG }}
        >
          <button type="button" className="flex flex-col items-center gap-1">
            <UtensilsCrossed className="size-[19px] text-primary" strokeWidth={2} />
            <span className="text-[10px] font-bold tracking-[0.2px] text-primary">Menu</span>
          </button>
          <button
            type="button"
            onClick={() => toast("Saved dishes are coming soon")}
            className="flex flex-col items-center gap-1"
          >
            <Heart className="size-[19px] text-muted-foreground" strokeWidth={2} />
            <span className="text-[10px] font-bold tracking-[0.2px] text-muted-foreground">Saved</span>
          </button>

          <Link
            href={`/${slug}/cart`}
            aria-label={`View cart, ${cartCount(cartItems)} item${cartCount(cartItems) === 1 ? "" : "s"}, ${priceStr(cartTotal(cartItems))}`}
            className="relative -mt-6.5 flex size-[46px] items-center justify-center rounded-[15px] text-primary-foreground"
            style={{ background: "var(--primary)", boxShadow: ACCENT_GLOW }}
          >
            <ShoppingCart className="size-[19px]" strokeWidth={2} />
            {cartItems.length > 0 ? (
              <span
                className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-primary-foreground"
                style={{ background: "var(--nonveg)" }}
              >
                {cartCount(cartItems)}
              </span>
            ) : null}
          </Link>

          <button
            type="button"
            onClick={() => toast(storedTable ? `You're at Table ${storedTable}` : "No table selected")}
            className="flex flex-col items-center gap-1"
          >
            <Table2 className="size-[19px] text-muted-foreground" strokeWidth={2} />
            <span className="max-w-[52px] truncate text-[10px] font-bold tracking-[0.2px] text-muted-foreground">
              {storedTable ? `Table ${storedTable}` : "Table"}
            </span>
          </button>
          <button
            type="button"
            onClick={() => toast("Profile is coming soon")}
            className="flex flex-col items-center gap-1"
          >
            <CircleUserRound className="size-[19px] text-muted-foreground" strokeWidth={2} />
            <span className="text-[10px] font-bold tracking-[0.2px] text-muted-foreground">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}
