import { HowItWorksCard } from "@/components/molecules/how-it-works-card";

const steps = [
  { n: "1", title: "Upload your menu", body: "Photo, screenshot or PDF — whatever you already have." },
  { n: "2", title: "AI reads & sorts", body: "Dishes, prices and Veg / Non-Veg tags, done automatically." },
  { n: "3", title: "Share the QR & link", body: "Print for tables, drop the link in WhatsApp. Edit anytime." },
];

export function LandingHowItWorks() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 py-[50px] pb-5 sm:px-10">
      <div className="text-center">
        <div className="text-[13px] font-bold tracking-[1.4px] text-primary uppercase">
          How it works
        </div>
        <h2 className="mt-2 font-display text-[32px] tracking-[0.3px] text-[oklch(0.24_0.02_60)] sm:text-[38px]">
          Three steps. No tech skills.
        </h2>
      </div>
      <div className="mt-9 grid grid-cols-1 gap-[22px] sm:grid-cols-3">
        {steps.map((s) => (
          <HowItWorksCard key={s.n} {...s} />
        ))}
      </div>
    </section>
  );
}
