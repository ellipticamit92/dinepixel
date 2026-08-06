"use client";

import { useState } from "react";
import { ImageIcon } from "lucide-react";
import { PhoneFrame } from "@/components/molecules/phone-frame";
import { PhoneHero } from "@/components/molecules/phone-hero";
import { RAISED_SM, INSET } from "@/lib/neu-shadows";
import { LANDING_DEMO, type DishCategory } from "@/lib/menu-seed";
import { cn } from "@/lib/utils";

export function LandingPhoneMenu() {
  const [tab, setTab] = useState<DishCategory>("veg");
  const data = LANDING_DEMO[tab];
  const mark = tab === "veg" ? "var(--veg)" : "var(--nonveg)";

  return (
    <div className="flex justify-center">
      <PhoneFrame float className="w-[290px]" screenStyle={{ background: "oklch(0.94 0.014 82)" }}>
        <PhoneHero />

        <div className="px-[13px] pt-[11px] pb-1.5 font-display text-[15px] tracking-[0.3px] text-[oklch(0.3_0.02_60)]">
          {data.heading}
        </div>

        <div className="flex flex-1 flex-col gap-[9px] overflow-hidden px-3">
          {/* featured */}
          <div className="overflow-hidden rounded-[14px]" style={{ background: "oklch(0.94 0.014 82)", boxShadow: RAISED_SM }}>
            <div className="relative h-[82px]">
              <div className="flex h-full w-full items-center justify-center bg-[oklch(0.87_0.02_74)] text-[oklch(0.68_0.03_74)]">
                <ImageIcon className="size-5" strokeWidth={1.5} />
              </div>
              <div className="absolute top-1.5 left-1.5 rounded-full bg-primary px-2 py-0.5 text-[6.5px] font-bold tracking-[0.4px] text-primary-foreground uppercase">
                ★ Popular this week
              </div>
            </div>
            <div className="px-2.5 pt-2 pb-2.5">
              <div className="flex items-start justify-between gap-1.5">
                <div className="flex min-w-0 items-center gap-1.5">
                  <span className="inline-flex size-3 shrink-0 items-center justify-center rounded-[2px] border-[1.5px]" style={{ borderColor: mark }}>
                    <span className="size-[5px] rounded-full" style={{ background: mark }} />
                  </span>
                  <span className="font-condensed text-[12.5px] font-bold text-[oklch(0.26_0.02_60)]">
                    {data.featured.name}
                  </span>
                </div>
                <span className="text-[12px] font-bold whitespace-nowrap text-primary">
                  {data.featured.priceStr}
                </span>
              </div>
              <div className="mt-1 text-[9.5px] leading-[1.35] text-[oklch(0.52_0.02_60)]">
                {data.featured.desc}
              </div>
              <div
                className="mt-[7px] rounded-[9px] py-1.5 text-center font-condensed text-[10px] font-bold tracking-[0.3px] text-accent-foreground"
                style={{ boxShadow: INSET }}
              >
                ＋ Add to Order
              </div>
            </div>
          </div>

          {/* rows */}
          {data.rest.map((r) => (
            <div
              key={r.slot}
              className="flex gap-2.5 rounded-[14px] p-[9px]"
              style={{ background: "oklch(0.94 0.014 82)", boxShadow: RAISED_SM }}
            >
              <div className="relative size-[52px] shrink-0 overflow-hidden rounded-[11px] bg-[oklch(0.87_0.02_74)] text-[oklch(0.68_0.03_74)] flex items-center justify-center">
                <ImageIcon className="size-4" strokeWidth={1.5} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-1.5">
                  <span className="font-condensed text-[12px] leading-[1.05] font-bold text-[oklch(0.26_0.02_60)]">
                    {r.name}
                  </span>
                  <span className="text-[11.5px] font-bold whitespace-nowrap text-primary">
                    {r.priceStr}
                  </span>
                </div>
                <div className="mt-[3px] text-[9px] leading-[1.35] text-[oklch(0.52_0.02_60)]">
                  {r.desc}
                </div>
                <div className="mt-1.5 flex items-center gap-[5px]">
                  <span className="inline-flex size-[11px] shrink-0 items-center justify-center rounded-[2px] border-[1.5px]" style={{ borderColor: mark }}>
                    <span className="size-[5px] rounded-full" style={{ background: mark }} />
                  </span>
                  <span className="flex-1" />
                  <span
                    className="flex size-[22px] items-center justify-center rounded-[8px] text-[14px] leading-none text-accent-foreground"
                    style={{ background: "oklch(0.94 0.014 82)", boxShadow: RAISED_SM }}
                  >
                    +
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* pinned veg/nonveg toggle */}
        <div className="px-3 pt-[9px] pb-3">
          <div className="flex gap-[7px] rounded-[15px] p-1.5" style={{ background: "oklch(0.94 0.014 82)", boxShadow: INSET }}>
            <button
              onClick={() => setTab("veg")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-[11px] py-[9px] font-condensed text-[12.5px] font-bold tracking-[0.3px] cursor-pointer"
              )}
              style={{
                background: "oklch(0.94 0.014 82)",
                color: tab === "veg" ? "oklch(0.45 0.13 150)" : "oklch(0.55 0.03 60)",
                boxShadow: tab === "veg" ? INSET : RAISED_SM,
              }}
            >
              <span className="inline-flex size-[11px] items-center justify-center rounded-[2px] border-[1.5px]" style={{ borderColor: "currentColor" }}>
                <span className="size-[5px] rounded-full" style={{ background: "currentColor" }} />
              </span>
              Veg
            </button>
            <button
              onClick={() => setTab("nonveg")}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-[11px] py-[9px] font-condensed text-[12.5px] font-bold tracking-[0.3px] cursor-pointer"
              style={{
                background: "oklch(0.94 0.014 82)",
                color: tab === "nonveg" ? "oklch(0.5 0.18 25)" : "oklch(0.55 0.03 60)",
                boxShadow: tab === "nonveg" ? INSET : RAISED_SM,
              }}
            >
              <span className="inline-flex size-[11px] items-center justify-center rounded-full border-[1.5px]" style={{ borderColor: "currentColor" }}>
                <span className="size-[5px] rounded-full" style={{ background: "currentColor" }} />
              </span>
              Non-Veg
            </button>
          </div>
        </div>
      </PhoneFrame>
    </div>
  );
}
