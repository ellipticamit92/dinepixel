"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { PhoneFrame } from "@/components/molecules/phone-frame";
import { PhoneHero } from "@/components/molecules/phone-hero";
import { RAISED_SM, INSET, INSET_SM } from "@/lib/neu-shadows";
import {
  MENU_SECTIONS,
  ingredientSummary,
  markColor,
  priceStr,
  type Dish,
  type DishCategory,
  type MenuSection,
} from "@/lib/menu-seed";

interface LivePreviewPhoneProps {
  items: Dish[];
  tab: DishCategory;
  onTabChange: (tab: DishCategory) => void;
  empty: boolean;
  logoUrl?: string | null;
}

type SectionFilter = "all" | MenuSection;

export function LivePreviewPhone({ items, tab, onTabChange, empty, logoUrl }: LivePreviewPhoneProps) {
  const [section, setSection] = useState<SectionFilter>("all");
  const filtered = items.filter(
    (d) => d.cat === tab && (section === "all" || d.section === section)
  );
  const featured = filtered[0] ?? null;
  const rest = filtered.slice(1);
  const groups = MENU_SECTIONS.map((s) => ({
    section: s,
    dishes: rest.filter((d) => d.section === s),
  })).filter((g) => g.dishes.length > 0);
  const availableSections = MENU_SECTIONS.filter((s) =>
    items.some((d) => d.cat === tab && d.section === s)
  );

  return (
    <div className="sticky top-[92px]">
      <div className="mb-3 flex items-center gap-2 text-xs font-bold tracking-[0.8px] text-[oklch(0.56_0.03_60)] uppercase">
        <span className="animate-pl-pulse size-[7px] rounded-full bg-primary" />
        Live preview
      </div>
      <div className="mx-auto w-full max-w-[340px]">
        <PhoneFrame screenStyle={{ background: "oklch(0.95 0.012 84)" }}>
          <PhoneHero height={128} logoUrl={logoUrl} />

          {!empty ? (
            <>
              <div className="flex gap-1.5 overflow-x-auto px-3.5 pt-3 pb-2">
                <button
                  type="button"
                  onClick={() => setSection("all")}
                  className="shrink-0 rounded-full px-3 py-[6px] font-condensed text-[11.5px] font-bold tracking-[0.2px]"
                  style={{
                    background: "oklch(0.95 0.012 84)",
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
                    className="shrink-0 rounded-full px-3 py-[6px] font-condensed text-[11.5px] font-bold tracking-[0.2px]"
                    style={{
                      background: "oklch(0.95 0.012 84)",
                      color: section === s ? "oklch(0.28 0.02 60)" : "oklch(0.55 0.03 60)",
                      boxShadow: section === s ? INSET_SM : RAISED_SM,
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>

              <div className="flex flex-1 flex-col gap-3.5 overflow-y-auto px-3.5 pt-0.5 pb-[18px]">
                {featured ? (
                  <div
                    className="overflow-hidden rounded-[15px]"
                    style={{ background: "oklch(0.95 0.012 84)", boxShadow: RAISED_SM }}
                  >
                    <div className="relative h-24">
                      <div className="flex h-full w-full items-center justify-center bg-[oklch(0.88_0.015_82)] text-[oklch(0.68_0.03_74)]">
                        <ImageIcon className="size-5" strokeWidth={1.5} />
                      </div>
                      <div className="absolute top-[7px] left-[7px] rounded-full bg-primary px-2.5 py-[3px] text-[8px] font-bold tracking-[0.4px] text-primary-foreground uppercase">
                        ★ Popular this week
                      </div>
                    </div>
                    <div className="px-3 pt-2.5 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex min-w-0 items-center gap-[7px]">
                          <span
                            className="inline-flex size-3.5 shrink-0 items-center justify-center rounded-[3px] border-[1.5px]"
                            style={{ borderColor: markColor(featured.cat) }}
                          >
                            <span className="size-1.5 rounded-full" style={{ background: markColor(featured.cat) }} />
                          </span>
                          <span className="font-condensed text-[15px] font-bold text-[oklch(0.26_0.02_60)]">
                            {featured.name}
                          </span>
                        </div>
                        <span className="font-condensed text-[15px] font-bold whitespace-nowrap text-primary">
                          {priceStr(featured.price)}
                        </span>
                      </div>
                      <div className="mt-[5px] text-[10.5px] leading-[1.4] text-[oklch(0.52_0.02_60)]">
                        {ingredientSummary(featured)}
                      </div>
                      <div
                        className="mt-[9px] rounded-[10px] py-2 text-center font-condensed text-[11.5px] font-bold tracking-[0.3px] text-accent-foreground"
                        style={{ boxShadow: INSET_SM }}
                      >
                        ＋ Add to Order
                      </div>
                    </div>
                  </div>
                ) : null}

                {groups.map(({ section: s, dishes }) => (
                  <div key={s} className="flex flex-col gap-2.5">
                    {section === "all" ? (
                      <div className="flex items-center gap-1.5 px-0.5 text-[10.5px] font-bold tracking-[0.6px] text-[oklch(0.52_0.03_60)] uppercase">
                        {s}
                        <span className="h-px flex-1" style={{ background: "oklch(0.85 0.02 72)" }} />
                      </div>
                    ) : null}
                    {dishes.map((p) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-[11px] rounded-[13px] p-3"
                        style={{ background: "oklch(0.95 0.012 84)", boxShadow: RAISED_SM }}
                      >
                        <span
                          className="inline-flex size-4 shrink-0 items-center justify-center rounded-[3px] border-[1.5px]"
                          style={{ borderColor: markColor(p.cat) }}
                        >
                          <span className="size-[7px] rounded-full" style={{ background: markColor(p.cat) }} />
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="font-condensed text-[14.5px] font-bold text-[oklch(0.26_0.02_60)]">
                            {p.name}
                          </div>
                          <div className="text-[10.5px] font-semibold tracking-[0.6px] text-[oklch(0.6_0.03_60)] uppercase">
                            {ingredientSummary(p)}
                          </div>
                        </div>
                        <div className="font-condensed text-[14.5px] font-bold text-primary">
                          {priceStr(p.price)}
                        </div>
                        <span
                          className="flex size-[26px] shrink-0 items-center justify-center rounded-[9px] text-base leading-none text-accent-foreground"
                          style={{ background: "oklch(0.95 0.012 84)", boxShadow: RAISED_SM }}
                        >
                          +
                        </span>
                      </div>
                    ))}
                  </div>
                ))}

                {!featured && groups.length === 0 ? (
                  <div className="py-8 text-center text-[12.5px] font-semibold text-muted-foreground">
                    No dishes in this category yet.
                  </div>
                ) : null}
              </div>

              <div className="px-3.5 pt-2 pb-3.5">
                <div
                  className="flex gap-[7px] rounded-[15px] p-1.5"
                  style={{ background: "oklch(0.95 0.012 84)", boxShadow: INSET }}
                >
                  <button
                    type="button"
                    onClick={() => onTabChange("veg")}
                    className="font-condensed flex-1 rounded-xl py-2.5 text-sm font-bold tracking-[0.3px]"
                    style={{
                      background: "oklch(0.95 0.012 84)",
                      color: tab === "veg" ? "oklch(0.4 0.12 150)" : "oklch(0.52 0.03 60)",
                      boxShadow: tab === "veg" ? INSET_SM : RAISED_SM,
                    }}
                  >
                    Veg
                  </button>
                  <button
                    type="button"
                    onClick={() => onTabChange("nonveg")}
                    className="font-condensed flex-1 rounded-xl py-2.5 text-sm font-bold tracking-[0.3px]"
                    style={{
                      background: "oklch(0.95 0.012 84)",
                      color: tab === "nonveg" ? "oklch(0.48 0.19 25)" : "oklch(0.52 0.03 60)",
                      boxShadow: tab === "nonveg" ? INSET_SM : RAISED_SM,
                    }}
                  >
                    Non-Veg
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center gap-3.5 p-7 text-center">
              <div
                className="size-[52px] rounded-[15px]"
                style={{ background: "oklch(0.95 0.012 84)", boxShadow: INSET_SM }}
              />
              <div className="text-[13.5px] leading-[1.4] font-semibold text-[oklch(0.55_0.03_60)]">
                Your live menu will appear here once AI reads your upload.
              </div>
            </div>
          )}
        </PhoneFrame>
      </div>
    </div>
  );
}
