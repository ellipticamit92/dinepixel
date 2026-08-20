"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { PhoneHero } from "@/components/molecules/phone-hero";
import { RAISED_SM, INSET_SM } from "@/lib/neu-shadows";
import { ingredientSummary, markColor, priceStr, type Dish, type DishCategory } from "@/lib/menu-seed";

export function MenuContent({ restaurantName, dishes }: { restaurantName: string; dishes: Dish[] }) {
  const [tab, setTab] = useState<DishCategory>("veg");
  const filtered = dishes.filter((d) => d.cat === tab);
  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-background pb-10 font-sans text-[oklch(0.28_0.02_60)]">
      <PhoneHero height={190} name={restaurantName} />

      <div className="flex gap-2 px-4 pt-4 pb-2">
        <button
          type="button"
          onClick={() => setTab("veg")}
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
          onClick={() => setTab("nonveg")}
          className="font-condensed flex-1 rounded-xl py-3 text-sm font-bold tracking-[0.3px]"
          style={{
            color: tab === "nonveg" ? "oklch(0.48 0.19 25)" : "oklch(0.52 0.03 60)",
            boxShadow: tab === "nonveg" ? INSET_SM : RAISED_SM,
          }}
        >
          Non-Veg
        </button>
      </div>

      <div className="flex flex-col gap-3 px-4 pt-1">
        {featured ? (
          <div className="overflow-hidden rounded-2xl bg-background" style={{ boxShadow: RAISED_SM }}>
            <div className="relative h-36">
              <div className="flex h-full w-full items-center justify-center bg-[oklch(0.87_0.02_74)] text-[oklch(0.68_0.03_74)]">
                <ImageIcon className="size-7" strokeWidth={1.3} />
              </div>
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
                  {priceStr(featured.price)}
                </span>
              </div>
              <div className="mt-1.5 text-[12.5px] leading-[1.4] text-[oklch(0.52_0.02_60)]">
                {ingredientSummary(featured)}
              </div>
              <div
                className="mt-3 rounded-xl py-2.5 text-center font-condensed text-[13px] font-bold tracking-[0.3px] text-accent-foreground"
                style={{ boxShadow: INSET_SM }}
              >
                ＋ Add to Order
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl bg-background p-6 text-center text-sm text-[oklch(0.52_0.02_60)]" style={{ boxShadow: RAISED_SM }}>
            No dishes in this category yet.
          </div>
        )}

        {rest.map((d) => (
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
            <div className="min-w-0 flex-1">
              <div className="font-condensed text-[15px] font-bold text-[oklch(0.26_0.02_60)]">
                {d.name}
              </div>
              <div className="text-[11px] font-semibold tracking-[0.6px] text-[oklch(0.6_0.03_60)] uppercase">
                {ingredientSummary(d)}
              </div>
            </div>
            <div className="font-condensed text-[15px] font-bold text-primary">
              {priceStr(d.price)}
            </div>
            <span
              className="flex size-7 shrink-0 items-center justify-center rounded-[10px] text-lg leading-none text-accent-foreground"
              style={{ boxShadow: RAISED_SM }}
            >
              +
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
