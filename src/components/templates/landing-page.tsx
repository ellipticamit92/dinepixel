import { Navbar } from "@/components/organisms/navbar";
import { Hero } from "@/components/organisms/hero";
import { FeaturesSection } from "@/components/organisms/features-section";
import { TestimonialsSection } from "@/components/organisms/testimonials-section";
import { CtaSection } from "@/components/organisms/cta-section";
import { Footer } from "@/components/organisms/footer";

export function LandingPage() {
  return (
    <div className="flex flex-1 flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <FeaturesSection />
        <TestimonialsSection />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
