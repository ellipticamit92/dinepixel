"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import {
  CircleUserRound,
  CreditCard,
  Heart,
  ImageIcon,
  Search,
  ShoppingCart,
  UtensilsCrossed,
  X,
} from "lucide-react";
import { PhoneHero } from "@/components/molecules/phone-hero";
import { InstallHint } from "@/components/molecules/install-hint";
import { DishCard, FeaturedDishCard } from "@/components/molecules/dish-card";
import { RAISED_SM, RAISED_LG, INSET_SM, ACCENT_GLOW } from "@/lib/neu-shadows";
import { cartCount, cartTotal, useCart } from "@/lib/cart";
import { useSaved, type SavedDish } from "@/lib/saved";
import { storeTable } from "@/lib/table";

import type { MenuTheme } from "@/lib/menu-repo";
import {
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
  description,
  logoUrl,
  bannerUrl,
  zomatoUrl,
  zomatoRating,
  swiggyUrl,
  swiggyRating,
  dishes,
  table,
  theme = "plate",
  preview,
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
  preview?: boolean;
  isOpen?: boolean;
  paymentQrUrl?: string | null;
  upiId?: string | null;
  paypalUrl?: string | null;
  stripeUrl?: string | null;
}) {
  const [tab, setTab] = useState<DishCategory>("veg");
  const [section, setSection] = useState<SectionFilter>("all");
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [paymentSheetOpen, setPaymentSheetOpen] = useState(false);
  const { items: cartItems, add: addToCart } = useCart(slug);
  const { items: savedItems, toggle: toggleSaved, isSaved } = useSaved(slug);

  const toSavedDish = (d: Dish): SavedDish => ({
    id: d.id,
    name: d.name,
    price: d.price,
    imageUrl: d.imageUrl,
    cat: d.cat,
    section: d.section,
    type: d.type,
    ingredients: d.ingredients,
    halfPrice: d.halfPrice,
    fullPrice: d.fullPrice,
    smallPrice: d.smallPrice,
    mediumPrice: d.mediumPrice,
    largePrice: d.largePrice,
  });

  useEffect(() => {
    if (table) storeTable(slug, table);
  }, [slug, table]);

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
    (d) =>
      matchesTab(d, tab) &&
      (section === "all" || d.section === section) &&
      matchesQuery(d),
  );
  // Use the owner-pinned "Popular this week" dish if it passes current filters; else fallback to first.
  const pinnedDish = dishes.find((d) => d.featured) ?? null;
  const pinnedInView = pinnedDish
    ? filtered.some((d) => d.id === pinnedDish.id)
    : false;
  const featured = searching
    ? null
    : pinnedInView
      ? pinnedDish
      : (filtered[0] ?? null);
  const rest = searching
    ? filtered
    : filtered.filter((d) => d.id !== featured?.id);
  // Sections span both categories so the chip row stays stable when switching
  // Veg/Non-Veg — only the dish list below should change, not the chips.
  const availableSections = Array.from(new Set(dishes.map((d) => d.section)));
  const groups = availableSections
    .map((s) => ({ section: s, dishes: rest.filter((d) => d.section === s) }))
    .filter((g) => g.dishes.length > 0);

  return (
    <div
      data-menu-theme={theme}
      className={
        preview
          ? "flex flex-col bg-background font-sans text-[oklch(0.28_0.02_60)]"
          : "mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background pb-28 font-sans text-[oklch(0.28_0.02_60)]"
      }
      style={!isOpen ? { filter: "grayscale(1)" } : undefined}
    >
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

      {!preview && <InstallHint />}

      {/* Veg / Non-Veg tabs + search icon on same row */}
      <div className={`flex items-center gap-2 pt-4 pb-1 ${preview ? "px-3" : "px-5"}`}>
        <button
          type="button"
          onClick={() => { setTab("veg"); setSection("all"); }}
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
          onClick={() => { setTab("nonveg"); setSection("all"); }}
          className="font-condensed flex-1 rounded-xl py-2.5 text-sm font-bold tracking-[0.3px]"
          style={{
            color: tab === "nonveg" ? "oklch(0.48 0.19 25)" : "oklch(0.52 0.03 60)",
            boxShadow: tab === "nonveg" ? INSET_SM : RAISED_SM,
          }}
        >
          Non-Veg
        </button>
        <button
          type="button"
          onClick={() => { setSearchOpen((v) => !v); if (searchOpen) setQuery(""); }}
          className="ml-1 flex size-[34px] shrink-0 items-center justify-center rounded-[10px]"
          style={{ boxShadow: searchOpen ? INSET_SM : RAISED_SM }}
        >
          <Search
            className="size-4"
            strokeWidth={2}
            style={{ color: searchOpen ? "oklch(0.38 0.02 60)" : "oklch(0.55 0.03 60)" }}
          />
        </button>
      </div>

      {/* Collapsible search input */}
      {searchOpen && (
        <div className={`pt-2 pb-1 ${preview ? "px-3" : "px-5"}`}>
          <div
            className="flex items-center gap-2.5 rounded-2xl px-4 py-3"
            style={{ boxShadow: INSET_SM }}
          >
            <Search className="size-4 shrink-0 text-muted-foreground" strokeWidth={2} />
            <input
              // eslint-disable-next-line jsx-a11y/no-autofocus
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search menu…"
              className="w-full border-none bg-transparent text-sm font-medium text-[oklch(0.32_0.02_60)] outline-none placeholder:text-muted-foreground"
            />
          </div>
        </div>
      )}

      <div
        className={`flex gap-1.5 overflow-x-auto pt-2 pb-1 ${preview ? "px-3" : "px-5"}`}
      >
        <button
          type="button"
          onClick={() => setSection("all")}
          className="shrink-0 rounded-full px-3.5 py-2 font-condensed text-[12.5px] font-bold tracking-[0.2px]"
          style={{
            color:
              section === "all" ? "oklch(0.28 0.02 60)" : "oklch(0.55 0.03 60)",
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
              color:
                section === s ? "oklch(0.28 0.02 60)" : "oklch(0.55 0.03 60)",
              boxShadow: section === s ? INSET_SM : RAISED_SM,
            }}
          >
            {s}
          </button>
        ))}
      </div>

      <div
        className={`flex flex-1 flex-col gap-3 pt-1 ${preview ? "px-3" : "px-5"}`}
      >
        {featured ? (
          <div
            className="overflow-hidden rounded-2xl bg-background"
            style={{ boxShadow: RAISED_SM }}
          >
            <div className="relative h-36">
              {featured.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={featured.imageUrl}
                  alt=""
                  className="size-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[oklch(0.87_0.02_74)] text-[oklch(0.68_0.03_74)]">
                  <ImageIcon className="size-7" strokeWidth={1.3} />
                </div>
              )}
              <div className="absolute top-2.5 left-2.5 rounded-full bg-primary px-3 py-1 text-[10px] font-bold tracking-[0.4px] text-primary-foreground uppercase">
                ★ Popular this week
              </div>
            </div>
            <FeaturedDishCard
              dish={featured}
              onAdd={(item) => {
                addToCart(item);
                toast.success(`${featured.name} added to cart`);
              }}
              isSaved={isSaved(featured.id)}
              onSave={() => {
                toggleSaved(toSavedDish(featured));
                toast.success(
                  isSaved(featured.id)
                    ? `${featured.name} removed from saved`
                    : `${featured.name} saved`,
                );
              }}
            />
          </div>
        ) : null}

        {groups.map(({ section: s, dishes: sectionDishes }) => (
          <div key={s} className="flex flex-col gap-3">
            {section === "all" ? (
              <div className="flex items-center gap-1.5 px-0.5 text-[11px] font-bold tracking-[0.6px] text-[oklch(0.52_0.03_60)] uppercase">
                {s}
                <span
                  className="h-px flex-1"
                  style={{ background: "var(--shadow-dark)" }}
                />
              </div>
            ) : null}
            {sectionDishes.map((d) => (
              <DishCard
                key={d.id}
                dish={d}
                onAdd={(item) => {
                  addToCart(item);
                  toast.success(`${d.name} added to cart`);
                }}
                isSaved={isSaved(d.id)}
                onSave={() => {
                  toggleSaved(toSavedDish(d));
                  toast.success(
                    isSaved(d.id)
                      ? `${d.name} removed from saved`
                      : `${d.name} saved`,
                  );
                }}
              />
            ))}
          </div>
        ))}

        {!featured && groups.length === 0 ? (
          <div className="py-10 text-center text-sm font-semibold text-muted-foreground">
            {searching
              ? `No dishes match "${query.trim()}".`
              : "No dishes in this category yet."}
          </div>
        ) : null}
      </div>

      <div
        className={
          preview ? "px-3 pt-6 pb-2 text-center" : "px-5 pt-7 pb-2 text-center"
        }
      >
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

      {!preview && (
        <div
          className="fixed right-0 bottom-0 left-0 z-10 mx-auto max-w-md px-5 pt-3 pb-5"
          style={{
            background: "linear-gradient(transparent, var(--background) 30%)",
          }}
        >
          <div
            className="relative flex items-center justify-between rounded-[22px] px-5.5 py-3"
            style={{ background: "var(--background)", boxShadow: RAISED_LG }}
          >
            <button type="button" className="flex flex-col items-center gap-1">
              <UtensilsCrossed
                className="size-[19px] text-primary"
                strokeWidth={2}
              />
              <span className="text-[10px] font-bold tracking-[0.2px] text-primary">
                Menu
              </span>
            </button>
            <Link
              href={`/${slug}/saved`}
              className="relative flex flex-col items-center gap-1"
            >
              <Heart
                className="size-[19px]"
                strokeWidth={2}
                style={{
                  fill: savedItems.length > 0 ? "var(--nonveg)" : "transparent",
                  color:
                    savedItems.length > 0
                      ? "var(--nonveg)"
                      : "var(--muted-foreground)",
                }}
              />
              {savedItems.length > 0 ? (
                <span
                  className="absolute -top-1 -right-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 text-[9px] font-bold text-white"
                  style={{ background: "var(--nonveg)" }}
                >
                  {savedItems.length}
                </span>
              ) : null}
              <span
                className="text-[10px] font-bold tracking-[0.2px]"
                style={{
                  color:
                    savedItems.length > 0
                      ? "var(--nonveg)"
                      : "var(--muted-foreground)",
                }}
              >
                Saved
              </span>
            </Link>

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
              onClick={() => setPaymentSheetOpen(true)}
              className="flex flex-col items-center gap-1"
            >
              <CreditCard
                className="size-[19px] text-muted-foreground"
                strokeWidth={2}
              />
              <span className="text-[10px] font-bold tracking-[0.2px] text-muted-foreground">
                Pay
              </span>
            </button>
            <button
              type="button"
              onClick={() => toast("Profile is coming soon")}
              className="flex flex-col items-center gap-1"
            >
              <CircleUserRound
                className="size-[19px] text-muted-foreground"
                strokeWidth={2}
              />
              <span className="text-[10px] font-bold tracking-[0.2px] text-muted-foreground">
                Profile
              </span>
            </button>
          </div>
        </div>
      )}

      {/* Payment bottom sheet */}
      {!preview && paymentSheetOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-20"
            style={{ background: "oklch(0.1 0.01 60 / 0.4)" }}
            onClick={() => setPaymentSheetOpen(false)}
          />
          {/* Sheet */}
          <div
            className="fixed right-0 bottom-0 left-0 z-30 mx-auto max-w-md rounded-t-[24px] bg-background px-5 pt-5 pb-8"
            style={{ boxShadow: "0 -6px 32px oklch(0.2 0.02 60 / 0.18)" }}
          >
            {/* Handle */}
            <div
              className="mx-auto mb-4 h-1 w-10 rounded-full"
              style={{ background: "oklch(0.78 0.02 72)" }}
            />

            <div className="mb-4 flex items-center justify-between">
              <span className="font-display text-[20px] text-[oklch(0.24_0.02_60)]">
                Payment
              </span>
              <button
                type="button"
                onClick={() => setPaymentSheetOpen(false)}
                className="flex size-8 items-center justify-center rounded-[10px]"
                style={{ boxShadow: RAISED_SM }}
              >
                <X className="size-4 text-muted-foreground" strokeWidth={2} />
              </button>
            </div>

            {paymentQrUrl || upiId || paypalUrl || stripeUrl ? (
              <div className="flex flex-col gap-4">
                {paymentQrUrl && (
                  <div className="flex flex-col items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={paymentQrUrl}
                      alt="Payment QR"
                      className="size-[180px] rounded-[18px] object-contain"
                      style={{ boxShadow: RAISED_SM }}
                    />
                    <span className="text-[12px] font-semibold text-muted-foreground">
                      Scan to pay
                    </span>
                  </div>
                )}
                {upiId && (
                  <div
                    className="flex items-center justify-between rounded-[14px] px-4 py-3"
                    style={{ boxShadow: INSET_SM }}
                  >
                    <div>
                      <div className="text-[10px] font-bold tracking-[0.5px] text-muted-foreground uppercase">
                        UPI ID
                      </div>
                      <div className="mt-0.5 font-condensed text-[15px] font-bold text-[oklch(0.26_0.02_60)]">
                        {upiId}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(upiId);
                        toast.success("UPI ID copied");
                      }}
                      className="rounded-[9px] px-3 py-1.5 font-condensed text-[12px] font-bold text-[oklch(0.42_0.12_150)]"
                      style={{ boxShadow: RAISED_SM }}
                    >
                      Copy
                    </button>
                  </div>
                )}
                {paypalUrl && (
                  <a
                    href={paypalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-[14px] py-3.5 font-condensed text-[15px] font-bold text-white"
                    style={{
                      background: "oklch(0.42 0.18 240)",
                      boxShadow: RAISED_SM,
                    }}
                  >
                    <CreditCard className="size-4" strokeWidth={2} />
                    Pay with PayPal
                  </a>
                )}
                {stripeUrl && (
                  <a
                    href={stripeUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 rounded-[14px] py-3.5 font-condensed text-[15px] font-bold text-white"
                    style={{
                      background: "oklch(0.46 0.2 290)",
                      boxShadow: RAISED_SM,
                    }}
                  >
                    <CreditCard className="size-4" strokeWidth={2} />
                    Pay with Stripe
                  </a>
                )}
              </div>
            ) : (
              <div className="py-8 text-center text-sm font-semibold text-muted-foreground">
                No payment methods set up yet.
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
