import { Plus, Trash2 } from "lucide-react";
import { IngredientChip } from "@/components/molecules/ingredient-chip";
import { DishImageUpload } from "@/components/molecules/dish-image-upload";
import { RAISED_SM, INSET, INSET_SM, ACCENT_GLOW_SM, SUCCESS_GLOW } from "@/lib/neu-shadows";
import { dishPriceLabel, hasHalfFullPricing, ingredientSummary, type Dish } from "@/lib/menu-seed";

interface DishRowProps {
  dish: Dish;
  editing: boolean;
  draft: string;
  uploadingImage?: boolean;
  onFlip: () => void;
  onToggleEdit: () => void;
  onSetPrice: (price: number) => void;
  onSetHalfPrice: (price: number) => void;
  onSetFullPrice: (price: number) => void;
  onToggleHalfFull: (enabled: boolean) => void;
  onDraftChange: (value: string) => void;
  onAddIngredient: () => void;
  onRemoveIngredient: (index: number) => void;
  onImageSelect?: (file: File) => void;
  onImageRemove?: () => void;
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
  onSetPrice,
  onSetHalfPrice,
  onSetFullPrice,
  onToggleHalfFull,
  onDraftChange,
  onAddIngredient,
  onRemoveIngredient,
  onImageSelect,
  onImageRemove,
  onSave,
  onDelete,
}: DishRowProps) {
  const halfFull = hasHalfFullPricing(dish);
  return (
    <div
      className="rounded-2xl bg-background"
      style={{ boxShadow: editing ? INSET : RAISED_SM }}
    >
      <div className="flex items-center gap-[13px] px-4 py-[14px]">
        <button
          type="button"
          onClick={onFlip}
          title="Flip Veg / Non-Veg"
          className="flex size-7 shrink-0 items-center justify-center rounded-[7px] border-2"
          style={{
            borderColor: dish.cat === "veg" ? "var(--veg)" : "var(--nonveg)",
            background: "var(--background)",
            boxShadow: RAISED_SM,
          }}
        >
          <span
            className="size-[11px] rounded-full"
            style={{ background: dish.cat === "veg" ? "var(--veg)" : "var(--nonveg)" }}
          />
        </button>
        {dish.imageUrl ? (
          <div
            className="size-10 shrink-0 overflow-hidden rounded-[10px]"
            style={{ boxShadow: RAISED_SM }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={dish.imageUrl} alt="" className="size-full object-cover" />
          </div>
        ) : null}
        <div className="min-w-0 flex-1">
          <div className="font-condensed text-base font-bold text-[oklch(0.26_0.02_60)]">
            {dish.name}
          </div>
          {dish.description ? (
            <p className="mt-[3px] line-clamp-2 text-[13px] leading-[1.45] text-[oklch(0.48_0.02_60)]">
              {dish.description}
            </p>
          ) : null}
          <div className="mt-[3px] text-xs font-semibold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
            {ingredientSummary(dish)}
          </div>
        </div>
        <div className="font-condensed text-base font-bold whitespace-nowrap text-[oklch(0.42_0.02_60)]">
          {dishPriceLabel(dish)}
        </div>
        <button
          type="button"
          onClick={onToggleEdit}
          className="shrink-0 rounded-[10px] px-[15px] py-2 font-condensed text-[13px] font-bold"
          style={{
            background: "var(--background)",
            color: editing ? "oklch(0.52 0.15 42)" : "oklch(0.46 0.02 60)",
            boxShadow: editing ? INSET : RAISED_SM,
          }}
        >
          {editing ? "Close" : "Edit"}
        </button>
        {onDelete ? (
          <button
            type="button"
            onClick={onDelete}
            title="Remove dish"
            className="flex size-9 shrink-0 items-center justify-center rounded-[10px]"
            style={{ background: "var(--background)", color: "var(--nonveg)", boxShadow: RAISED_SM }}
          >
            <Trash2 className="size-4" strokeWidth={2} />
          </button>
        ) : null}
      </div>

      {editing ? (
        <div className="px-4 pt-0.5 pb-[18px]">
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
            </div>
          ) : null}
          <div className="mt-4 flex flex-wrap gap-[18px]">
            <div>
              <div className="mb-[7px] flex items-center gap-2">
                <label className="text-[11px] font-bold tracking-[0.6px] text-[oklch(0.56_0.03_60)] uppercase">
                  Price (₹)
                </label>
                <button
                  type="button"
                  onClick={() => onToggleHalfFull(!halfFull)}
                  className="text-[10.5px] font-bold tracking-[0.2px] text-primary underline-offset-2 hover:underline"
                >
                  {halfFull ? "Use single price" : "Half / Full pricing"}
                </button>
              </div>
              {halfFull ? (
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
                      value={dish.halfPrice ?? 0}
                      onChange={(e) => onSetHalfPrice(parseInt(e.target.value, 10) || 0)}
                      className="w-16 border-none bg-transparent font-condensed text-base font-bold text-[oklch(0.24_0.02_60)] outline-none"
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
