"use client";

import { DishRow } from "@/components/molecules/dish-row";
import { ACCENT_GLOW, RAISED_SM } from "@/lib/neu-shadows";
import type { Dish, PricingMode } from "@/lib/menu-seed";

interface BuilderStepReviewProps {
  items: Dish[];
  editingId: string | null;
  drafts: Record<string, string>;
  onFlip: (id: string) => void;
  onToggleEdit: (id: string) => void;
  onSetPrice: (id: string, price: number) => void;
  onSetHalfPrice: (id: string, price: number) => void;
  onSetFullPrice: (id: string, price: number) => void;
  onSetSmallPrice: (id: string, price: number) => void;
  onSetMediumPrice: (id: string, price: number) => void;
  onSetLargePrice: (id: string, price: number) => void;
  onSetPricingMode: (id: string, mode: PricingMode) => void;
  onDraftChange: (id: string, value: string) => void;
  onAddIngredient: (id: string) => void;
  onRemoveIngredient: (id: string, index: number) => void;
  onSave: (id: string) => void;
  onPublish: () => void;
  onReset: () => void;
}

export function BuilderStepReview({
  items,
  editingId,
  drafts,
  onFlip,
  onToggleEdit,
  onSetPrice,
  onSetHalfPrice,
  onSetFullPrice,
  onSetSmallPrice,
  onSetMediumPrice,
  onSetLargePrice,
  onSetPricingMode,
  onDraftChange,
  onAddIngredient,
  onRemoveIngredient,
  onSave,
  onPublish,
  onReset,
}: BuilderStepReviewProps) {
  const vegCount = items.filter((d) => d.cat === "veg").length;
  const nonvegCount = items.length - vegCount;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-[28px] tracking-[0.3px] text-[oklch(0.24_0.02_60)] sm:text-[34px]">
            Review &amp; tweak
          </h1>
          <p className="mt-2 text-[14.5px] text-muted-foreground">
            AI found <strong>{items.length} dishes</strong>. Tap the mark to
            flip Veg / Non-Veg, or <strong>Edit</strong> to change price
            &amp; ingredients.
          </p>
        </div>
        <div className="flex gap-2.5">
          <span className="flex items-center gap-[7px] text-[13px] font-bold text-[var(--veg)]">
            <span className="flex size-3.5 items-center justify-center rounded-[3px] border-[1.5px] border-current">
              <span className="size-1.5 rounded-full bg-current" />
            </span>
            {vegCount} Veg
          </span>
          <span className="flex items-center gap-[7px] text-[13px] font-bold text-[var(--nonveg)]">
            <span className="flex size-3.5 items-center justify-center rounded-[3px] border-[1.5px] border-current">
              <span className="size-1.5 rounded-full bg-current" />
            </span>
            {nonvegCount} Non-Veg
          </span>
        </div>
      </div>

      <div className="mt-5 flex max-h-[460px] flex-col gap-2.5 overflow-y-auto p-1">
        {items.map((dish) => (
          <DishRow
            key={dish.id}
            dish={dish}
            editing={editingId === dish.id}
            draft={drafts[dish.id] ?? ""}
            onFlip={() => onFlip(dish.id)}
            onToggleEdit={() => onToggleEdit(dish.id)}
            onSetPrice={(price) => onSetPrice(dish.id, price)}
            onSetHalfPrice={(price) => onSetHalfPrice(dish.id, price)}
            onSetFullPrice={(price) => onSetFullPrice(dish.id, price)}
            onSetSmallPrice={(price) => onSetSmallPrice(dish.id, price)}
            onSetMediumPrice={(price) => onSetMediumPrice(dish.id, price)}
            onSetLargePrice={(price) => onSetLargePrice(dish.id, price)}
            onSetPricingMode={(mode) => onSetPricingMode(dish.id, mode)}
            onDraftChange={(value) => onDraftChange(dish.id, value)}
            onAddIngredient={() => onAddIngredient(dish.id)}
            onRemoveIngredient={(index) => onRemoveIngredient(dish.id, index)}
            onSave={() => onSave(dish.id)}
          />
        ))}
      </div>

      <div className="mt-[22px] flex items-center gap-3.5">
        <button
          type="button"
          onClick={onPublish}
          className="rounded-2xl bg-primary px-[26px] py-[15px] font-condensed text-[17px] font-bold tracking-[0.4px] text-primary-foreground"
          style={{ boxShadow: ACCENT_GLOW }}
        >
          Publish my menu
        </button>
        <button
          type="button"
          onClick={onReset}
          className="rounded-2xl px-5 py-[15px] font-condensed text-[15px] font-bold text-[oklch(0.46_0.02_60)]"
          style={{ boxShadow: RAISED_SM }}
        >
          Start over
        </button>
      </div>
    </div>
  );
}
