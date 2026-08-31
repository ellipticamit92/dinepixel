import { ImageIcon, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { IngredientChip } from "@/components/molecules/ingredient-chip";
import { DishImageUpload } from "@/components/molecules/dish-image-upload";
import { DishImageEnhancer } from "@/components/molecules/dish-image-enhancer";
import { RAISED_SM, INSET, INSET_SM, ACCENT_GLOW_SM, SUCCESS_GLOW } from "@/lib/neu-shadows";
import { dishPriceLabel, ingredientSummary, markColor, pricingModeOf, type Dish, type PricingMode } from "@/lib/menu-seed";

const PRICING_MODES: { mode: PricingMode; label: string }[] = [
  { mode: "single", label: "Single" },
  { mode: "halfFull", label: "Half / Full" },
  { mode: "sizes", label: "S / M / L" },
];

interface DishRowProps {
  dish: Dish;
  editing: boolean;
  draft: string;
  uploadingImage?: boolean;
  onFlip: () => void;
  onToggleEdit: () => void;
  onToggleAvailable?: () => void;
  isFeatured?: boolean;
  onSetFeatured?: () => void;
  onSetName?: (name: string) => void;
  onSetDescription?: (description: string | null) => void;
  onSetPrice: (price: number) => void;
  onSetHalfPrice: (price: number) => void;
  onSetFullPrice: (price: number) => void;
  onSetSmallPrice: (price: number) => void;
  onSetMediumPrice: (price: number) => void;
  onSetLargePrice: (price: number) => void;
  onSetPricingMode: (mode: PricingMode) => void;
  onDraftChange: (value: string) => void;
  onAddIngredient: () => void;
  onRemoveIngredient: (index: number) => void;
  onImageSelect?: (file: File) => void;
  onImageRemove?: () => void;
  onEnhanceGenerate?: (count: number) => Promise<string[]>;
  onEnhanceApply?: (url: string) => Promise<void>;
  onSave: () => void;
  onDelete?: () => void;
}

export function DishRow({
  dish,
  editing,
  draft,
  uploadingImage = false,
  onFlip,
  onToggleEdit,
  onToggleAvailable,
  isFeatured = false,
  onSetFeatured,
  onSetName,
  onSetDescription,
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
  onImageSelect,
  onImageRemove,
  onEnhanceGenerate,
  onEnhanceApply,
  onSave,
  onDelete,
}: DishRowProps) {
  const mode = pricingModeOf(dish);
  const isAvailable = dish.available !== false;
  return (
    <div
      className="rounded-2xl bg-background"
      style={{ boxShadow: editing ? INSET : RAISED_SM, opacity: isAvailable ? 1 : 0.55 }}
    >
      {/* Card header — matches public menu card design */}
      <div className="flex gap-3.5 p-3.5">
        {/* Square image — no overlay, plain tap to flip */}
        <button
          type="button"
          onClick={onFlip}
          title="Tap to flip Veg / Non-Veg"
          className="size-[84px] shrink-0 overflow-hidden rounded-[16px]"
          style={{ boxShadow: RAISED_SM }}
        >
          {dish.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={dish.imageUrl} alt="" className="size-full object-cover" />
          ) : (
            <div className="flex size-full items-center justify-center bg-[oklch(0.87_0.02_74)] text-[oklch(0.68_0.03_74)]">
              <ImageIcon className="size-6" strokeWidth={1.3} />
            </div>
          )}
        </button>

        {/* Content */}
        <div className="flex min-w-0 flex-1 flex-col justify-between py-0.5">
          {/* Top: name + price */}
          <div>
            <div className="flex items-start justify-between gap-2">
              <span className="font-condensed text-[16px] font-bold leading-tight text-[oklch(0.26_0.02_60)]">
                {dish.name}
              </span>
              <span className="font-condensed text-[15px] font-bold whitespace-nowrap text-primary">
                {dishPriceLabel(dish)}
              </span>
            </div>
            <div className="mt-1 text-[12px] font-semibold leading-snug text-[oklch(0.6_0.03_60)]">
              {dish.description ? dish.description : ingredientSummary(dish)}
            </div>
          </div>

          {/* Bottom row: veg/non-veg left, action buttons right */}
          <div className="mt-2 flex items-center justify-between gap-1.5">
            <button
              type="button"
              onClick={onFlip}
              title="Flip Veg / Non-Veg"
              className="inline-flex items-center gap-1.5"
            >
              <span
                className="inline-flex size-[16px] items-center justify-center rounded-[3px] border-[1.5px]"
                style={{ borderColor: markColor(dish.cat) }}
              >
                <span className="size-[7px] rounded-full" style={{ background: markColor(dish.cat) }} />
              </span>
              <span className="font-condensed text-[11px] font-bold tracking-[0.3px]" style={{ color: markColor(dish.cat) }}>
                {dish.cat === "veg" ? "Veg" : "Non-Veg"}
              </span>
            </button>
            <div className="flex items-center gap-1.5">
            {onToggleAvailable ? (
              <button
                type="button"
                onClick={onToggleAvailable}
                title={isAvailable ? "Mark as sold out" : "Mark as available"}
                className="rounded-full px-[11px] py-[5px] font-condensed text-[11px] font-bold tracking-[0.2px]"
                style={{
                  color: isAvailable ? "oklch(0.46 0.12 150)" : "oklch(0.52 0.17 25)",
                  boxShadow: isAvailable ? RAISED_SM : INSET_SM,
                }}
              >
                {isAvailable ? "Available" : "Sold out"}
              </button>
            ) : null}
            {onSetFeatured ? (
              <button
                type="button"
                onClick={onSetFeatured}
                title={isFeatured ? "Remove Popular this week" : "Mark as Popular this week"}
                className="flex size-[32px] shrink-0 items-center justify-center rounded-[9px]"
                style={{ boxShadow: isFeatured ? INSET_SM : RAISED_SM }}
              >
                <Star
                  className="size-4"
                  strokeWidth={2}
                  style={{
                    fill: isFeatured ? "oklch(0.75 0.15 75)" : "transparent",
                    color: isFeatured ? "oklch(0.65 0.15 75)" : "oklch(0.6 0.03 60)",
                  }}
                />
              </button>
            ) : null}
            <button
              type="button"
              onClick={onToggleEdit}
              title={editing ? "Close edit" : "Edit dish"}
              className="flex size-[32px] shrink-0 items-center justify-center rounded-[9px]"
              style={{
                boxShadow: editing ? INSET_SM : RAISED_SM,
                color: editing ? "oklch(0.52 0.15 42)" : "oklch(0.46 0.02 60)",
              }}
            >
              <Pencil className="size-4" strokeWidth={2} />
            </button>
            {onDelete ? (
              <button
                type="button"
                onClick={onDelete}
                title="Remove dish"
                className="flex size-[32px] shrink-0 items-center justify-center rounded-[9px]"
                style={{ color: "var(--nonveg)", boxShadow: RAISED_SM }}
              >
                <Trash2 className="size-4" strokeWidth={2} />
              </button>
            ) : null}
            </div>
          </div>
        </div>
      </div>

      {editing ? (
        <div className="px-4 pt-0.5 pb-[18px]">
          {/* Name & description */}
          <div className="mt-3 flex flex-col gap-2.5">
            {onSetName ? (
              <div>
                <label className="mb-[7px] block text-[11px] font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
                  Dish name
                </label>
                <input
                  value={dish.name}
                  onChange={(e) => onSetName(e.target.value)}
                  placeholder="Dish name"
                  maxLength={200}
                  className="w-full rounded-[11px] px-3.5 py-[9px] font-condensed text-[15px] font-bold text-[oklch(0.26_0.02_60)] outline-none"
                  style={{ boxShadow: INSET_SM }}
                />
              </div>
            ) : null}
            {onSetDescription !== undefined ? (
              <div>
                <label className="mb-[7px] block text-[11px] font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
                  Description <span className="normal-case font-normal opacity-60">(optional)</span>
                </label>
                <input
                  value={dish.description ?? ""}
                  onChange={(e) => onSetDescription(e.target.value || null)}
                  placeholder="e.g. Slow-roasted with house spices"
                  maxLength={500}
                  className="w-full rounded-[11px] px-3.5 py-[9px] text-[13.5px] font-semibold text-[oklch(0.38_0.02_60)] outline-none"
                  style={{ boxShadow: INSET_SM }}
                />
              </div>
            ) : null}
          </div>

          {onImageSelect && onImageRemove ? (
            <div className="mt-1.5">
              <label className="mb-[7px] block text-[11px] font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
                Dish photo
              </label>
              <DishImageUpload
                value={dish.imageUrl ?? null}
                onSelect={onImageSelect}
                onRemove={onImageRemove}
                uploading={uploadingImage}
              />
              {dish.imageUrl && onEnhanceGenerate && onEnhanceApply ? (
                <DishImageEnhancer onGenerate={onEnhanceGenerate} onApply={onEnhanceApply} />
              ) : null}
            </div>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-[18px]">
            <div>
              <div className="mb-[7px] flex flex-wrap items-center gap-2">
                <label className="text-[11px] font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
                  Price (₹)
                </label>
                <div className="flex gap-1">
                  {PRICING_MODES.map((m) => (
                    <button
                      key={m.mode}
                      type="button"
                      onClick={() => onSetPricingMode(m.mode)}
                      className="rounded-full px-2.5 py-[3px] font-condensed text-[10.5px] font-bold tracking-[0.2px]"
                      style={{
                        color: mode === m.mode ? "oklch(0.35 0.02 60)" : "oklch(0.6 0.03 60)",
                        boxShadow: mode === m.mode ? INSET_SM : RAISED_SM,
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
              {mode === "sizes" ? (
                <div className="flex gap-2">
                  <div
                    className="flex items-center gap-2 rounded-[11px] px-[11px] py-[9px]"
                    style={{ boxShadow: INSET_SM }}
                  >
                    <span className="text-[11px] font-bold tracking-[0.3px] text-[oklch(0.55_0.03_60)] uppercase">
                      S
                    </span>
                    <input
                      type="number"
                      value={dish.smallPrice ?? ""}
                      placeholder="—"
                      onChange={(e) => onSetSmallPrice(parseInt(e.target.value, 10) || 0)}
                      className="w-14 border-none bg-transparent font-condensed text-base font-bold text-[oklch(0.24_0.02_60)] outline-none"
                    />
                  </div>
                  <div
                    className="flex items-center gap-2 rounded-[11px] px-[11px] py-[9px]"
                    style={{ boxShadow: INSET_SM }}
                  >
                    <span className="text-[11px] font-bold tracking-[0.3px] text-[oklch(0.55_0.03_60)] uppercase">
                      M
                    </span>
                    <input
                      type="number"
                      value={dish.mediumPrice ?? ""}
                      placeholder="—"
                      onChange={(e) => onSetMediumPrice(parseInt(e.target.value, 10) || 0)}
                      className="w-14 border-none bg-transparent font-condensed text-base font-bold text-[oklch(0.24_0.02_60)] outline-none"
                    />
                  </div>
                  <div
                    className="flex items-center gap-2 rounded-[11px] px-[11px] py-[9px]"
                    style={{ boxShadow: INSET_SM }}
                  >
                    <span className="text-[11px] font-bold tracking-[0.3px] text-[oklch(0.55_0.03_60)] uppercase">
                      L
                    </span>
                    <input
                      type="number"
                      value={dish.largePrice ?? ""}
                      placeholder="—"
                      onChange={(e) => onSetLargePrice(parseInt(e.target.value, 10) || 0)}
                      className="w-14 border-none bg-transparent font-condensed text-base font-bold text-[oklch(0.24_0.02_60)] outline-none"
                    />
                  </div>
                </div>
              ) : mode === "halfFull" ? (
                <div className="flex gap-2">
                  <div
                    className="flex items-center gap-2 rounded-[11px] px-[13px] py-[9px]"
                    style={{ boxShadow: INSET_SM }}
                  >
                    <span className="text-[11px] font-bold tracking-[0.3px] text-[oklch(0.55_0.03_60)] uppercase">
                      Half
                    </span>
                    <input
                      type="number"
                      value={dish.halfPrice ?? ""}
                      placeholder="Optional"
                      onChange={(e) => onSetHalfPrice(parseInt(e.target.value, 10) || 0)}
                      className="w-16 border-none bg-transparent font-condensed text-base font-bold text-[oklch(0.24_0.02_60)] outline-none placeholder:text-[11px] placeholder:font-semibold"
                    />
                  </div>
                  <div
                    className="flex items-center gap-2 rounded-[11px] px-[13px] py-[9px]"
                    style={{ boxShadow: INSET_SM }}
                  >
                    <span className="text-[11px] font-bold tracking-[0.3px] text-[oklch(0.55_0.03_60)] uppercase">
                      Full
                    </span>
                    <input
                      type="number"
                      value={dish.fullPrice ?? 0}
                      onChange={(e) => onSetFullPrice(parseInt(e.target.value, 10) || 0)}
                      className="w-16 border-none bg-transparent font-condensed text-base font-bold text-[oklch(0.24_0.02_60)] outline-none"
                    />
                  </div>
                </div>
              ) : (
                <div
                  className="flex items-center gap-2 rounded-[11px] px-[13px] py-[9px]"
                  style={{ boxShadow: INSET_SM }}
                >
                  <span className="text-[15px] font-bold text-[oklch(0.55_0.03_60)]">₹</span>
                  <input
                    type="number"
                    value={dish.price}
                    onChange={(e) => onSetPrice(parseInt(e.target.value, 10) || 0)}
                    className="w-20 border-none bg-transparent font-condensed text-base font-bold text-[oklch(0.24_0.02_60)] outline-none"
                  />
                </div>
              )}
            </div>
            <div className="min-w-[200px] flex-1">
              <label className="mb-[7px] block text-[11px] font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
                Ingredients
              </label>
              <div className="flex flex-wrap items-center gap-[7px]">
                {dish.ingredients.map((ing, idx) => (
                  <IngredientChip
                    key={`${ing}-${idx}`}
                    name={ing}
                    onRemove={() => onRemoveIngredient(idx)}
                  />
                ))}
                <div className="flex items-center gap-[7px]">
                  <input
                    value={draft}
                    onChange={(e) => onDraftChange(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") onAddIngredient();
                    }}
                    placeholder="Add ingredient"
                    className="w-[130px] rounded-full px-3 py-2 text-[13px] font-semibold text-[oklch(0.32_0.02_60)] outline-none"
                    style={{ boxShadow: INSET_SM }}
                  />
                  <button
                    type="button"
                    onClick={onAddIngredient}
                    className="flex size-8 items-center justify-center rounded-full bg-primary leading-none text-primary-foreground"
                    style={{ boxShadow: ACCENT_GLOW_SM }}
                  >
                    <Plus className="size-4" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onSave}
            className="mt-4 rounded-[11px] px-5 py-2.5 font-condensed text-[13.5px] font-bold tracking-[0.3px] text-primary-foreground"
            style={{ background: "var(--success)", boxShadow: SUCCESS_GLOW }}
          >
            Done
          </button>
        </div>
      ) : null}
    </div>
  );
}
