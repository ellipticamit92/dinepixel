import { FileText } from "lucide-react";
import { RAISED_SM } from "@/lib/neu-shadows";
import { DETECTED_ORDER, SEED_DISHES, markColor, priceStr } from "@/lib/menu-seed";

const detected = DETECTED_ORDER.map((id, i) => {
  const dish = SEED_DISHES.find((d) => d.id === id)!;
  return {
    id,
    name: dish.name,
    priceStr: priceStr(dish.price),
    mark: markColor(dish.cat),
    tag: dish.cat === "veg" ? "Veg" : "Non-Veg",
    delay: i * 0.28,
  };
});

export function BuilderStepProcessing() {
  return (
    <div>
      <h1 className="font-display text-[32px] tracking-[0.3px] text-[oklch(0.24_0.02_60)] sm:text-[38px]">
        Reading your menu…
      </h1>
      <p className="mt-3 mb-6 text-[15px] text-muted-foreground">
        AI is extracting dishes, prices and tagging Veg / Non-Veg.
      </p>
      <div
        className="relative h-[300px] overflow-hidden rounded-3xl bg-background"
        style={{
          boxShadow:
            "inset 6px 6px 15px oklch(0.85 0.02 72), inset -6px -6px 15px oklch(0.99 0.008 88)",
        }}
      >
        <div className="flex h-full w-full items-center justify-center text-[oklch(0.68_0.03_74)]">
          <FileText className="size-10" strokeWidth={1.3} />
        </div>
        <div className="absolute inset-0 bg-[oklch(0.62_0.17_42_/_0.06)]" />
        <div
          className="animate-pl-scan absolute right-0 left-0 h-[3px] bg-primary"
          style={{ boxShadow: "0 0 22px 6px oklch(0.62 0.17 42 / 0.6)" }}
        />
      </div>
      <div className="mt-5 flex flex-col gap-[9px]">
        {detected.map((d) => (
          <div
            key={d.id}
            className="animate-pl-pop flex items-center gap-[11px] rounded-[13px] bg-background px-[15px] py-3"
            style={{ boxShadow: RAISED_SM, animationDelay: `${d.delay}s` }}
          >
            <span className="size-[9px] rounded-full" style={{ background: d.mark }} />
            <span className="font-condensed flex-1 text-[15px] font-bold text-[oklch(0.26_0.02_60)]">
              {d.name}
            </span>
            <span className="text-[13px] font-bold" style={{ color: d.mark }}>
              {d.tag}
            </span>
            <span className="text-sm font-semibold text-[oklch(0.5_0.02_60)]">
              {d.priceStr}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
