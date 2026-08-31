"use client";

import { useState } from "react";
import { Heart, ImageIcon, Trash2 } from "lucide-react";
import { RAISED_SM, INSET_SM } from "@/lib/neu-shadows";
import {
  dishPriceLabel,
  markColor,
  pricingModeOf,
  priceStr,
  type Dish,
} from "@/lib/menu-seed";

export interface CartPayload {
  id: string;
  name: string;
  price: number;
  imageUrl?: string | null;
}

interface DishCardProps {
  dish: Dish;
  onAdd: (item: CartPayload) => void;
  /** Heart button — shown when provided */
  isSaved?: boolean;
  onSave?: () => void;
  /** Trash button — shown when provided (saved page) */
  onRemove?: () => void;
}

function getSizeOptions(dish: Dish) {
  const mode = pricingModeOf(dish);
  if (mode === "sizes") {
    const opts: { key: string; price: number }[] = [];
    if (dish.smallPrice != null)
      opts.push({ key: "S", price: dish.smallPrice });
    if (dish.mediumPrice != null)
      opts.push({ key: "M", price: dish.mediumPrice });
    if (dish.largePrice != null)
      opts.push({ key: "L", price: dish.largePrice });
    return opts;
  }
  if (mode === "halfFull") {
    const opts: { key: string; price: number }[] = [];
    if (dish.halfPrice != null)
      opts.push({ key: "Half", price: dish.halfPrice });
    if (dish.fullPrice != null)
      opts.push({ key: "Full", price: dish.fullPrice });
    return opts;
  }
  return [];
}

export function DishCard({
  dish,
  onAdd,
  isSaved = false,
  onSave,
  onRemove,
}: DishCardProps) {
  const opts = getSizeOptions(dish);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const effectiveKey = selectedKey ?? opts[0]?.key ?? null;
  const effectivePrice =
    opts.find((o) => o.key === effectiveKey)?.price ?? dish.price;
  const mode = pricingModeOf(dish);

  const handleAdd = () => {
    if (opts.length > 0 && effectiveKey) {
      onAdd({
        id: `${dish.id}-${effectiveKey.toLowerCase()}`,
        name: `${dish.name} (${effectiveKey})`,
        price: effectivePrice,
        imageUrl: dish.imageUrl,
      });
    } else {
      onAdd({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        imageUrl: dish.imageUrl,
      });
    }
  };

  return (
    <div
      className="flex gap-3 rounded-2xl bg-background p-3"
      style={{ boxShadow: RAISED_SM }}
    >
      {/* Thumbnail */}
      <div
        className="size-[72px] shrink-0 overflow-hidden rounded-[14px]"
        style={{ boxShadow: RAISED_SM }}
      >
        {dish.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={dish.imageUrl} alt="" className="size-full object-cover" />
        ) : (
          <div className="flex size-full items-center justify-center bg-[oklch(0.87_0.02_74)] text-[oklch(0.68_0.03_74)]">
            <ImageIcon className="size-5" strokeWidth={1.3} />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col py-0.5">
        {/* Row 1: name | price */}
        <div className="flex items-start justify-between gap-1.5">
          <span className="font-condensed text-[15px] font-bold leading-tight text-[oklch(0.26_0.02_60)]">
            {dish.name}
          </span>
          <div className="flex flex-col items-end">
            <span className="font-condensed text-md font-bold whitespace-nowrap text-primary">
              {opts.length > 0
                ? priceStr(effectivePrice)
                : dishPriceLabel(dish)}
            </span>
          </div>
        </div>

        {/* Row 2: veg dot + section --- flex --- Half/Full pills */}
        <div className="mt-1.5 flex items-center gap-1.5">
          <span
            className="inline-flex size-[14px] shrink-0 items-center justify-center rounded-[3px] border-[1.5px]"
            style={{ borderColor: markColor(dish.cat) }}
          >
            <span
              className="size-[6px] rounded-full"
              style={{ background: markColor(dish.cat) }}
            />
          </span>
          <span className="text-[11px] font-semibold text-[oklch(0.6_0.03_60)]">
            {dish.section}
          </span>
          <div className="flex-1" />
          {effectiveKey && (
            <span className="text-[9.5px] font-bold tracking-[0.4px] text-muted-foreground uppercase">
              {effectiveKey}
            </span>
          )}
        </div>

        {/* Row 3: S/M/L or price pill --- flex --- action buttons */}
        <div className="mt-1.5 flex items-center gap-1.5">
          {mode === "halfFull" &&
            opts.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => setSelectedKey(o.key)}
                className="rounded-full px-2.5 py-1 font-condensed text-[11.5px] font-bold uppercase tracking-[0.2px]"
                style={{
                  color:
                    effectiveKey === o.key
                      ? "oklch(0.30 0.02 60)"
                      : "oklch(0.55 0.03 60)",
                  boxShadow: effectiveKey === o.key ? INSET_SM : RAISED_SM,
                }}
              >
                {o.key}
              </button>
            ))}
          {mode === "sizes" ? (
            opts.map((o) => (
              <button
                key={o.key}
                type="button"
                onClick={() => setSelectedKey(o.key)}
                className="rounded-full px-2.5 py-1 font-condensed text-[11.5px] font-bold uppercase tracking-[0.2px]"
                style={{
                  color:
                    effectiveKey === o.key
                      ? "oklch(0.30 0.02 60)"
                      : "oklch(0.55 0.03 60)",
                  boxShadow: effectiveKey === o.key ? INSET_SM : RAISED_SM,
                }}
              >
                {o.key}
              </button>
            ))
          ) : mode === "single" ? (
            <span
              className="rounded-full px-2.5 py-1 font-condensed text-[11.5px] font-bold"
              style={{ color: "oklch(0.30 0.02 60)", boxShadow: INSET_SM }}
            >
              {priceStr(dish.price)}
            </span>
          ) : null}

          <div className="flex-1" />

          {onSave && (
            <button
              type="button"
              onClick={onSave}
              aria-label={isSaved ? "Remove from saved" : "Save dish"}
              className="flex size-[28px] shrink-0 items-center justify-center rounded-[9px]"
              style={{ boxShadow: RAISED_SM }}
            >
              <Heart
                className="size-3.5"
                strokeWidth={2}
                style={{
                  fill: isSaved ? "var(--nonveg)" : "transparent",
                  color: isSaved ? "var(--nonveg)" : "var(--muted-foreground)",
                }}
              />
            </button>
          )}

          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              aria-label="Remove from saved"
              className="flex size-[28px] shrink-0 items-center justify-center rounded-[9px]"
              style={{ boxShadow: RAISED_SM }}
            >
              <Trash2
                className="size-3.5 text-[oklch(0.6_0.03_60)]"
                strokeWidth={2}
              />
            </button>
          )}

          <button
            type="button"
            onClick={handleAdd}
            className="flex size-[28px] shrink-0 items-center justify-center rounded-[9px] text-base leading-none text-accent-foreground transition-transform duration-150 hover:scale-110 hover:text-primary active:scale-95"
            style={{ boxShadow: RAISED_SM }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}

/** Featured-card body — the banner image is rendered by the parent, this covers the text + action area */
export function FeaturedDishCard({
  dish,
  onAdd,
  isSaved = false,
  onSave,
}: {
  dish: Dish;
  onAdd: (item: CartPayload) => void;
  isSaved?: boolean;
  onSave?: () => void;
}) {
  const opts = getSizeOptions(dish);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const effectiveKey = selectedKey ?? opts[0]?.key ?? null;
  const effectivePrice =
    opts.find((o) => o.key === effectiveKey)?.price ?? dish.price;

  const handleAdd = () => {
    if (opts.length > 0 && effectiveKey) {
      onAdd({
        id: `${dish.id}-${effectiveKey.toLowerCase()}`,
        name: `${dish.name} (${effectiveKey})`,
        price: effectivePrice,
        imageUrl: dish.imageUrl,
      });
    } else {
      onAdd({
        id: dish.id,
        name: dish.name,
        price: dish.price,
        imageUrl: dish.imageUrl,
      });
    }
  };

  return (
    <div className="px-4 pt-3 pb-4">
      {/* Single row: veg mark · name · size pills · price */}
      <div className="flex items-center gap-2">
        <span
          className="inline-flex size-4 shrink-0 items-center justify-center rounded-[3px] border-[1.5px]"
          style={{ borderColor: markColor(dish.cat) }}
        >
          <span
            className="size-1.5 rounded-full"
            style={{ background: markColor(dish.cat) }}
          />
        </span>
        <span className="font-condensed min-w-0 flex-1 text-base font-bold text-[oklch(0.26_0.02_60)]">
          {dish.name}
        </span>
        {opts.map((o) => (
          <button
            key={o.key}
            type="button"
            onClick={() => setSelectedKey(o.key)}
            className="rounded-full px-3 py-1 font-condensed text-[12px] font-bold uppercase tracking-[0.3px]"
            style={{
              color:
                effectiveKey === o.key
                  ? "oklch(0.30 0.02 60)"
                  : "oklch(0.55 0.03 60)",
              boxShadow: effectiveKey === o.key ? INSET_SM : RAISED_SM,
            }}
          >
            {o.key}
          </button>
        ))}
        <span className="font-condensed text-base font-bold whitespace-nowrap text-primary">
          {opts.length > 0 ? priceStr(effectivePrice) : dishPriceLabel(dish)}
        </span>
      </div>
      {/* Action row */}
      <div className="mt-3 flex gap-2">
        {onSave && (
          <button
            type="button"
            onClick={onSave}
            aria-label={isSaved ? "Remove from saved" : "Save dish"}
            className="flex size-[42px] shrink-0 items-center justify-center rounded-xl"
            style={{ boxShadow: INSET_SM }}
          >
            <Heart
              className="size-4"
              strokeWidth={2}
              style={{
                fill: isSaved ? "var(--nonveg)" : "transparent",
                color: isSaved ? "var(--nonveg)" : "var(--muted-foreground)",
              }}
            />
          </button>
        )}
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-xl py-2.5 text-center font-condensed text-[13px] font-bold tracking-[0.3px] text-accent-foreground transition-colors hover:text-primary"
          style={{ boxShadow: INSET_SM }}
        >
          {opts.length > 0 && effectiveKey
            ? `+ Add ${effectiveKey} · ${priceStr(effectivePrice)}`
            : "＋ Add to Order"}
        </button>
      </div>
    </div>
  );
}
