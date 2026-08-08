import { PlateNavbar } from "@/components/organisms/plate-navbar";
import { LandingHero } from "@/components/organisms/landing-hero";
import { LandingHowItWorks } from "@/components/organisms/landing-how-it-works";
import { LandingFeatures } from "@/components/organisms/landing-features";
import { LandingPricing } from "@/components/organisms/landing-pricing";
import { LandingFinalCta } from "@/components/organisms/landing-final-cta";
import { LandingFooter } from "@/components/organisms/landing-footer";
import { getSession } from "@/lib/auth";

export async function LandingPage() {
  const session = await getSession();

  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-[oklch(0.28_0.02_60)]">
      <PlateNavbar session={session} />
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
