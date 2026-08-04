import { BarChart3, QrCode, ScanLine, Tags } from "lucide-react";
import { SectionHeading } from "@/components/molecules/section-heading";
import { FeatureCard } from "@/components/molecules/feature-card";
import { PlaceholderGraphic } from "@/components/atoms/placeholder-graphic";

function ScanPreview() {
  return (
    <PlaceholderGraphic className="flex h-24 items-center justify-center border">
      <div className="flex w-2/3 flex-col gap-1.5">
        <div className="h-2 w-full rounded-full bg-card/80" />
        <div className="h-2 w-5/6 rounded-full bg-card/60" />
        <div className="h-2 w-full rounded-full bg-card/60" />
      </div>
    </PlaceholderGraphic>
  );
}

function InsightsPreview() {
  const bars = [40, 70, 55, 90, 65, 45];
  return (
    <PlaceholderGraphic className="flex h-24 items-end gap-2 border p-3">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 rounded-t-sm bg-primary/70"
          style={{ height: `${h}%` }}
        />
      ))}
    </PlaceholderGraphic>
  );
}

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <SectionHeading
        title="Modern Tools for Modern Kitchens"
        subtitle="Everything you need to bridge the gap between paper and digital."
        className="mb-10"
      />
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <FeatureCard
          icon={ScanLine}
          title="AI Scanning"
          description="Snap a photo of your handwritten, printed menu, or handwritten notes. Our neural networks recognize layouts and text with 99% accuracy, even in dim restaurant lighting."
          media={<ScanPreview />}
          className="lg:col-span-7"
        />
        <FeatureCard
          icon={QrCode}
          title="Instant QR Generation"
          description="Generate branded QR codes that link directly to your live menu. Update once, and every code updates instantly."
          variant="accent"
          ctaLabel="Try QR Creator"
          className="lg:col-span-5"
        />
        <FeatureCard
          icon={Tags}
          title="Smart Sorting"
          description="AI automatically sorts items into Appetizers, Mains, Desserts, and Drinks. It even identifies allergens and dietary tags."
          className="lg:col-span-5"
        />
        <FeatureCard
          icon={BarChart3}
          title="Guest Insights"
          description="See which items are being viewed the most. Track peak hours and menu engagement to optimize your offerings for maximum profit."
          media={<InsightsPreview />}
          className="lg:col-span-7"
        />
      </div>
    </section>
  );
}
