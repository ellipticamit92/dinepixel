import { PlateNavbar } from "@/components/organisms/plate-navbar";
import { LandingHero } from "@/components/organisms/landing-hero";
import { LandingHowItWorks } from "@/components/organisms/landing-how-it-works";
import { LandingFeatures } from "@/components/organisms/landing-features";
import { LandingPricing } from "@/components/organisms/landing-pricing";
import { LandingFinalCta } from "@/components/organisms/landing-final-cta";
import { LandingFooter } from "@/components/organisms/landing-footer";

export function LandingPage() {
  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-[oklch(0.28_0.02_60)]">
      <PlateNavbar />
      <main className="flex-1">
        <LandingHero />
        <LandingHowItWorks />
        <LandingFeatures />
        <LandingPricing />
        <LandingFinalCta />
      </main>
      <LandingFooter />
    </div>
  );
}
