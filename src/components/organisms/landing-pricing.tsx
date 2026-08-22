import { PricingCard } from "@/components/molecules/pricing-card";

const plans = [
  { name: "Starter", price: "Free", per: "", popular: false, cta: "Start free", feats: ["1 menu", "QR + shareable link", "Veg / Non-Veg sorting", "Up to 5 table QR codes"] },
  { name: "Pro", price: "₹499", per: "/yr", popular: true, cta: "Go Pro", feats: ["12 menus", "100+ AI-generated dish photos", "20 table QR codes"] },
  { name: "Premium", price: "₹999", per: "/yr", popular: false, cta: "Go Premium", feats: ["24 menus", "100+ AI-generated dish photos", "10 dish videos for special dishes", "Unlimited table QR codes"] },
];

export function LandingPricing() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 py-[50px] pb-5 sm:px-10">
      <div className="text-center">
        <div className="text-[13px] font-bold tracking-[1.4px] text-primary uppercase">
          Pricing
        </div>
        <h2 className="mt-2 font-display text-[32px] tracking-[0.3px] text-[oklch(0.24_0.02_60)] sm:text-[38px]">
          Simple, honest plans.
        </h2>
      </div>
      <div className="mt-9 grid grid-cols-1 items-start gap-[22px] sm:grid-cols-3">
        {plans.map((p) => (
          <PricingCard key={p.name} {...p} />
        ))}
      </div>
    </section>
  );
}
