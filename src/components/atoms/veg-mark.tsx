import { cn } from "@/lib/utils";
import type { DishCategory } from "@/lib/menu-seed";

export function VegMark({
  cat,
  size = 12,
  className,
}: {
  cat: DishCategory;
  size?: number;
  className?: string;
}) {
  const color = cat === "veg" ? "var(--veg)" : "var(--nonveg)";
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center rounded-[3px] border-[1.5px]",
        className
      )}
      style={{ width: size, height: size, borderColor: color }}
    >
      <span
        className="rounded-full"
        style={{ width: size * 0.42, height: size * 0.42, background: color }}
      />
    </span>
  );
}
