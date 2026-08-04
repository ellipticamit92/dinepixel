import { CircleCheck, Smartphone } from "lucide-react";
import { SectionBadge } from "@/components/atoms/section-badge";
import { PlaceholderGraphic } from "@/components/atoms/placeholder-graphic";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 py-20 lg:grid-cols-2 lg:py-28">
      <div className="flex flex-col items-start gap-6">
        <SectionBadge>AI-Powered Digitization</SectionBadge>
        <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          Turn Your Paper Menu into a{" "}
          <span className="text-primary">Digital Experience</span> in Seconds
        </h1>
        <p className="max-w-md text-base text-muted-foreground">
          Stop manual data entry. Upload a photo or PDF of your physical menu,
          and our AI instantly extracts items, prices, and descriptions to
          create a stunning mobile-first menu.
        </p>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <Button size="lg">Get Started for Free</Button>
          <Button size="lg" variant="outline">
            View Demo
          </Button>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <CircleCheck className="size-4 text-primary" />
          No credit card required
        </div>
      </div>

      <PlaceholderGraphic className="flex aspect-[4/3] items-center justify-center border">
        <div className="flex h-40 w-24 flex-col gap-1.5 rounded-2xl border-4 border-foreground/10 bg-card p-2 shadow-lg">
          <Smartphone className="mx-auto size-4 text-primary" />
          <div className="h-2 w-full rounded-full bg-primary/70" />
          <div className="h-2 w-3/4 rounded-full bg-muted-foreground/30" />
          <div className="h-2 w-full rounded-full bg-muted-foreground/30" />
          <div className="mt-1 h-8 w-full rounded-md bg-secondary" />
        </div>
      </PlaceholderGraphic>
    </section>
  );
}
