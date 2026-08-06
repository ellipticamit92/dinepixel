import { FeatureCard } from "@/components/molecules/feature-card";

const features = [
  { title: "Reads any format", body: "Photos, PDFs or screenshots — the AI handles messy real-world menus.", tint: "oklch(0.62 0.17 42 / 0.14)", mark: "oklch(0.62 0.17 42)", round: "3px" },
  { title: "Auto Veg / Non-Veg", body: "Every dish tagged and split into clean sections for your guests.", tint: "oklch(0.62 0.14 150 / 0.16)", mark: "oklch(0.5 0.14 150)", round: "50%" },
  { title: "Edit price & ingredients", body: "Change a price or add ingredients in seconds — guests see it live.", tint: "oklch(0.7 0.13 80 / 0.2)", mark: "oklch(0.6 0.13 80)", round: "4px" },
  { title: "QR + link instantly", body: "A branded page, a printable QR, and a WhatsApp-ready link.", tint: "oklch(0.28 0.02 60 / 0.1)", mark: "oklch(0.28 0.02 60)", round: "3px" },
];

export function LandingFeatures() {
  return (
    <section className="mx-auto max-w-[1120px] px-6 py-[50px] pb-5 sm:px-10">
      <div className="grid grid-cols-1 gap-[22px] sm:grid-cols-2">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}
