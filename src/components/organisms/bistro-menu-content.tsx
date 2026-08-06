"use client";

import { useState } from "react";
import { ImageIcon, Search, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

const RAISED = "5px 5px 11px oklch(0.82 0.04 295), -5px -5px 11px oklch(0.98 0.015 300)";
const RAISED_MD = "7px 7px 16px oklch(0.82 0.04 295), -7px -7px 16px oklch(0.98 0.015 300)";
const RAISED_LG = "8px 8px 20px oklch(0.81 0.045 295), -8px -8px 20px oklch(0.98 0.015 300)";
const INSET = "inset 4px 4px 9px oklch(0.82 0.04 295), inset -4px -4px 9px oklch(0.98 0.015 300)";

const CATEGORIES = ["Burgers", "Pizzas", "Sides", "Beverages"];

const BURGERS = [
  {
    id: "truffle",
    name: "Truffle Umami Burger",
    priceStr: "$18.50",
    chefPick: true,
    desc: "Wagyu-beef patty, truffle aioli, aged gruyère, caramelized onion.",
    badges: [
      { label: "Veg", bg: "oklch(0.9 0.07 150)", fg: "oklch(0.42 0.12 150)", round: "2px" },
      { label: "Spicy", bg: "oklch(0.93 0.07 30)", fg: "oklch(0.52 0.17 30)", round: "50%" },
    ],
  },
  {
    id: "crispy",
    name: "Spicy Crispy Chicken",
    priceStr: "$15.00",
    chefPick: false,
    desc: "Buttermilk fried chicken, house-made spicy slaw, pickles.",
    badges: [{ label: "Spicy", bg: "oklch(0.93 0.07 30)", fg: "oklch(0.52 0.17 30)", round: "50%" }],
  },
];

const NAV = [
  { label: "Menu", icon: "✦", active: true },
  { label: "Saved", icon: "♡", active: false },
  { label: "Table", icon: "▤", active: false },
  { label: "Profile", icon: "◔", active: false },
];

export function BistroMenuContent() {
  const [activeCat, setActiveCat] = useState("Burgers");

  return (
    <div
      className="mx-auto flex min-h-dvh max-w-md flex-col font-sans"
      style={{ background: "oklch(0.92 0.025 295)", color: "oklch(0.3 0.05 295)" }}
    >
      {/* hero */}
      <div className="px-3.5 pt-3.5">
        <div
          className="relative h-[220px] overflow-hidden rounded-[26px]"
          style={{ boxShadow: RAISED_LG }}
        >
          <div className="flex h-full w-full items-center justify-center bg-[oklch(0.8_0.03_295)] text-[oklch(0.55_0.06_295)]">
            <ImageIcon className="size-8" strokeWidth={1.3} />
          </div>
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(to top, oklch(0.2 0.05 295 / 0.82) 6%, oklch(0.2 0.05 295 / 0.1) 52%, oklch(0.2 0.05 295 / 0.25))",
            }}
          />
          <div className="absolute top-3 right-3 flex gap-2">
            {["↩", "♡", "⤴"].map((g) => (
              <div
                key={g}
                className="flex size-[34px] items-center justify-center rounded-[11px] border border-white/25 text-[15px] text-[oklch(0.99_0.01_300)] backdrop-blur-[6px]"
                style={{ background: "oklch(0.92 0.025 295 / 0.32)" }}
              >
                {g}
              </div>
            ))}
          </div>
          <div className="pointer-events-none absolute right-4 bottom-3.5 left-4">
            <div className="font-fraunces text-[30px] leading-none font-semibold text-[oklch(0.99_0.01_300)]">
              The Bistro
            </div>
            <div className="mt-2 flex items-center gap-2.5 text-[12.5px] font-semibold text-[oklch(0.93_0.02_300)]">
              <span>◉ Downtown Culinary District</span>
              <span
                className="rounded-full px-2.5 py-[3px] backdrop-blur-[6px]"
                style={{ background: "oklch(0.92 0.025 295 / 0.3)" }}
              >
                ★ 4.9 <span className="opacity-85">(2k+ reviews)</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* category chips */}
      <div className="flex gap-2.5 overflow-x-auto px-4 pt-4.5 pb-1">
        {CATEGORIES.map((cat) => {
          const on = cat === activeCat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCat(cat)}
              className="shrink-0 rounded-[15px] px-5 py-2.5 text-sm font-bold tracking-[0.2px] whitespace-nowrap"
              style={{
                background: "oklch(0.92 0.025 295)",
                color: on ? "oklch(0.4 0.14 295)" : "oklch(0.5 0.05 295)",
                boxShadow: on ? INSET : RAISED,
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* search */}
      <div className="px-4 pt-3.5 pb-1">
        <div
          className="flex items-center gap-2.5 rounded-2xl px-4.5 py-3.5"
          style={{ boxShadow: INSET }}
        >
          <Search className="size-4 text-[oklch(0.6_0.05_295)]" strokeWidth={2} />
          <span className="text-[15px] font-medium text-[oklch(0.6_0.04_295)]">
            Search menu…
          </span>
        </div>
      </div>

      {/* Signature Burgers */}
      <div className="px-4 pt-5.5">
        <h2 className="mb-3.5 font-fraunces text-2xl font-semibold text-[oklch(0.3_0.05_295)]">
          Signature Burgers
        </h2>
        <div className="flex flex-col gap-3.5">
          {BURGERS.map((it) => (
            <div
              key={it.id}
              className="relative flex gap-3.5 rounded-[20px] p-3.5"
              style={{ background: "oklch(0.92 0.025 295)", boxShadow: RAISED_MD }}
            >
              <div
                className="relative size-[90px] shrink-0 overflow-hidden rounded-[15px]"
                style={{ boxShadow: "inset 2px 2px 5px oklch(0.75 0.05 295 / 0.5)" }}
              >
                <div className="flex h-full w-full items-center justify-center bg-[oklch(0.8_0.03_295)] text-[oklch(0.55_0.06_295)]">
                  <ImageIcon className="size-5" strokeWidth={1.3} />
                </div>
                {it.chefPick ? (
                  <div
                    className="absolute top-1.5 left-1.5 rounded-[7px] px-1.5 py-1 text-[7.5px] font-bold tracking-[0.5px] text-[oklch(0.99_0.01_300)] uppercase"
                    style={{ background: "oklch(0.55 0.16 295)" }}
                  >
                    Chef&apos;s Choice
                  </div>
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex justify-between gap-2">
                  <div className="font-fraunces text-[17px] leading-[1.15] font-semibold text-[oklch(0.28_0.05_295)]">
                    {it.name}
                  </div>
                  <div className="text-[15px] font-bold whitespace-nowrap" style={{ color: "oklch(0.55 0.18 292)" }}>
                    {it.priceStr}
                  </div>
                </div>
                <div className="mt-[5px] text-[12.5px] leading-[1.4] text-[oklch(0.52_0.04_295)] text-pretty">
                  {it.desc}
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  {it.badges.map((b) => (
                    <span
                      key={b.label}
                      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[10px] font-bold"
                      style={{ background: b.bg, color: b.fg }}
                    >
                      <span
                        className="inline-block size-[7px] border-[1.5px]"
                        style={{ borderColor: b.fg, borderRadius: b.round }}
                      />
                      {b.label}
                    </span>
                  ))}
                  <div className="flex-1" />
                  <button
                    className="flex size-[30px] items-center justify-center rounded-[10px] text-lg leading-none"
                    style={{ background: "oklch(0.92 0.025 295)", color: "oklch(0.5 0.14 295)", boxShadow: RAISED }}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Artisanal Pizzas */}
      <div className="px-4 pt-6.5">
        <h2 className="mb-3.5 font-fraunces text-2xl font-semibold text-[oklch(0.3_0.05_295)]">
          Artisanal Pizzas
        </h2>

        <div className="overflow-hidden rounded-[22px]" style={{ background: "oklch(0.92 0.025 295)", boxShadow: RAISED_LG }}>
          <div className="relative h-[170px]">
            <div className="flex h-full w-full items-center justify-center bg-[oklch(0.8_0.03_295)] text-[oklch(0.55_0.06_295)]">
              <ImageIcon className="size-7" strokeWidth={1.3} />
            </div>
            <div
              className="absolute top-3 left-3 rounded-full px-3 py-1.5 text-[10px] font-bold tracking-[0.5px] text-[oklch(0.99_0.01_300)] uppercase"
              style={{ background: "oklch(0.55 0.16 295)" }}
            >
              ★ Popular This Week
            </div>
          </div>
          <div className="px-4.5 pt-4 pb-4.5">
            <div className="flex items-start justify-between gap-2.5">
              <div className="font-fraunces text-[21px] font-semibold text-[oklch(0.28_0.05_295)]">
                Burrata &amp; Prosciutto
              </div>
              <div className="text-[17px] font-bold whitespace-nowrap" style={{ color: "oklch(0.55 0.18 292)" }}>
                $22.00
              </div>
            </div>
            <div className="mt-2 text-[13px] leading-[1.5] text-[oklch(0.5_0.04_295)] text-pretty">
              San Marzano tomato base, fresh burrata, 24-month aged
              prosciutto di parma, wild arugula, and extra virgin olive oil
              drizzle.
            </div>
            <button
              className="mt-[15px] flex w-full items-center justify-center gap-2.5 rounded-2xl py-3.5 text-[15px] font-bold tracking-[0.3px]"
              style={{ background: "oklch(0.92 0.025 295)", color: "oklch(0.48 0.15 295)", boxShadow: RAISED }}
            >
              <span className="text-base">＋</span> Add to Order
            </button>
          </div>
        </div>

        <div
          className="mt-3.5 flex gap-3.5 rounded-[20px] p-3.5"
          style={{ background: "oklch(0.92 0.025 295)", boxShadow: RAISED_MD }}
        >
          <div
            className="size-[90px] shrink-0 overflow-hidden rounded-[15px]"
            style={{ boxShadow: "inset 2px 2px 5px oklch(0.75 0.05 295 / 0.5)" }}
          >
            <div className="flex h-full w-full items-center justify-center bg-[oklch(0.8_0.03_295)] text-[oklch(0.55_0.06_295)]">
              <ImageIcon className="size-5" strokeWidth={1.3} />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex justify-between gap-2">
              <div className="font-fraunces text-[17px] leading-[1.15] font-semibold text-[oklch(0.28_0.05_295)]">
                Mediterranean Garden
              </div>
              <div className="text-[15px] font-bold whitespace-nowrap" style={{ color: "oklch(0.55 0.18 292)" }}>
                $19.00
              </div>
            </div>
            <div className="mt-[5px] text-[12.5px] leading-[1.4] text-[oklch(0.52_0.04_295)] text-pretty">
              Roasted bell peppers, kalamata olives, artichokes, sun-dried
              tomato.
            </div>
            <div className="mt-2.5 flex items-center gap-2">
              <span
                className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-[3px] text-[10px] font-bold"
                style={{ background: "oklch(0.9 0.07 150)", color: "oklch(0.42 0.12 150)" }}
              >
                <span className="inline-block size-[7px] rounded-[2px] border-[1.5px]" style={{ borderColor: "oklch(0.42 0.12 150)" }} />
                Vegetarian
              </span>
              <div className="flex-1" />
              <button
                className="flex size-[30px] items-center justify-center rounded-[10px] text-lg leading-none"
                style={{ background: "oklch(0.92 0.025 295)", color: "oklch(0.5 0.14 295)", boxShadow: RAISED }}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* footer */}
      <div className="px-6.5 pt-7.5 pb-28 text-center">
        <div className="text-[10px] font-bold tracking-[1.4px] text-[oklch(0.62_0.05_295)] uppercase">
          Menu · Tech-powered experience
        </div>
        <div className="font-fraunces mt-3 text-sm leading-[1.5] text-[oklch(0.5_0.05_295)] italic">
          &quot;Dedicated to the art of fresh flavors since 2012.&quot;
        </div>
      </div>

      {/* bottom nav */}
      <div
        className="fixed right-0 bottom-0 left-0 mx-auto max-w-md px-5.5 pt-3 pb-5"
        style={{
          background: "linear-gradient(transparent, oklch(0.92 0.025 295) 30%)",
        }}
      >
        <div
          className="relative flex items-center justify-between rounded-[22px] px-5.5 py-3"
          style={{ background: "oklch(0.92 0.025 295)", boxShadow: RAISED_LG }}
        >
          {NAV.slice(0, 2).map((n) => (
            <button key={n.label} className="flex flex-col items-center gap-1">
              <span className="text-[19px]" style={{ color: n.active ? "oklch(0.5 0.16 295)" : "oklch(0.6 0.04 295)" }}>
                {n.icon}
              </span>
              <span
                className="text-[10px] font-bold tracking-[0.2px]"
                style={{ color: n.active ? "oklch(0.5 0.16 295)" : "oklch(0.6 0.04 295)" }}
              >
                {n.label}
              </span>
            </button>
          ))}
          <button className="relative -mt-6.5 flex size-[46px] items-center justify-center rounded-[15px] text-[oklch(0.99_0.01_300)]"
            style={{ background: "oklch(0.55 0.16 295)", boxShadow: "4px 6px 14px oklch(0.55 0.16 295 / 0.5)" }}
          >
            <ShoppingCart className="size-[19px]" strokeWidth={2} />
            <span
              className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-[oklch(0.99_0.01_300)]"
              style={{ background: "oklch(0.65 0.2 25)" }}
            >
              6
            </span>
          </button>
          {NAV.slice(2).map((n) => (
            <button key={n.label} className={cn("flex flex-col items-center gap-1")}>
              <span className="text-[19px]" style={{ color: "oklch(0.6 0.04 295)" }}>
                {n.icon}
              </span>
              <span className="text-[10px] font-bold tracking-[0.2px]" style={{ color: "oklch(0.6 0.04 295)" }}>
                {n.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
