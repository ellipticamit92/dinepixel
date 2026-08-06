import { PricingCard } from "@/components/molecules/pricing-card";

const plans = [
  { name: "Starter", price: "Free", per: "", popular: false, cta: "Start free", feats: ["1 menu", "QR + shareable link", "Veg / Non-Veg sorting"] },
  { name: "Pro", price: "₹299", per: "/mo", popular: true, cta: "Go Pro", feats: ["Unlimited menus", "Custom branding & banner", "Photo per dish", "Live price editing"] },
  { name: "Chain", price: "₹999", per: "/mo", popular: false, cta: "Contact us", feats: ["Multiple locations", "Team accounts", "Analytics dashboard", "Priority support"] },
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
