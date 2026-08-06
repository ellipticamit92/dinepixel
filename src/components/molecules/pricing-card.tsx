import Link from "next/link";
import { Check } from "lucide-react";
import { RAISED, INSET, RAISED_SM, ACCENT_GLOW_SM } from "@/lib/neu-shadows";

export function PricingCard({
  name,
  price,
  per,
  popular,
  feats,
  cta,
}: {
  name: string;
  price: string;
  per: string;
  popular: boolean;
  feats: string[];
  cta: string;
}) {
  return (
    <div
      className="rounded-3xl bg-background p-[30px]"
      style={{ boxShadow: popular ? INSET : RAISED }}
    >
      {popular ? (
        <div className="mb-3.5 inline-block rounded-full bg-primary px-3 py-[5px] text-[11px] font-bold tracking-[0.6px] text-primary-foreground uppercase">
          Most popular
        </div>
      ) : null}
      <div className="font-condensed text-lg font-bold tracking-[0.3px] text-[oklch(0.5_0.03_60)]">
        {name}
      </div>
      <div className="mt-1.5 flex items-baseline gap-1">
        <span className="font-display text-[44px] text-[oklch(0.24_0.02_60)]">{price}</span>
        <span className="text-sm font-semibold text-[oklch(0.55_0.03_60)]">{per}</span>
      </div>
      <div className="mt-[18px] flex flex-col gap-[11px]">
        {feats.map((ft) => (
          <div key={ft} className="flex items-center gap-2.5 text-sm font-medium text-[oklch(0.4_0.02_60)]">
            <span className="flex size-[18px] items-center justify-center rounded-full bg-[oklch(0.62_0.14_150_/_0.16)] text-[oklch(0.45_0.13_150)]">
              <Check className="size-2.5" strokeWidth={3} />
            </span>
            {ft}
          </div>
        ))}
      </div>
      <Link
        href="/builder"
        className="mt-6 block w-full rounded-2xl py-3.5 text-center font-condensed text-[15px] font-bold tracking-[0.3px]"
        style={{
          background: popular ? "var(--primary)" : "var(--background)",
          color: popular ? "var(--primary-foreground)" : "oklch(0.3 0.02 60)",
          boxShadow: popular ? ACCENT_GLOW_SM : RAISED_SM,
        }}
      >
        {cta}
      </Link>
    </div>
  );
}
