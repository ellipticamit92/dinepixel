import { X } from "lucide-react";
import { RAISED_SM } from "@/lib/neu-shadows";

export function IngredientChip({
  name,
  onRemove,
}: {
  name: string;
  onRemove: () => void;
}) {
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full bg-background py-1.5 pr-1.5 pl-3 text-[13px] font-semibold text-[oklch(0.32_0.02_60)]"
      style={{ boxShadow: RAISED_SM }}
    >
      {name}
      <button
        type="button"
        onClick={onRemove}
        title="Remove"
        className="flex size-[17px] items-center justify-center rounded-full text-accent-foreground"
        style={{ background: "oklch(0.62 0.17 42 / 0.14)" }}
      >
        <X className="size-2.5" strokeWidth={3} />
      </button>
    </span>
  );
}
