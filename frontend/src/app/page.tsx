import { AudienceSplit } from "@/components/landing/AudienceSplit";
import { CTASection } from "@/components/landing/CTASection";
import { Hero } from "@/components/landing/Hero";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { ProductInside } from "@/components/landing/ProductInside";
import { TrustStrip } from "@/components/landing/TrustStrip";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <LandingNavbar />
      <main className="flex-1">
        <Hero />
        <TrustStrip />
        <ProductInside />
        <AudienceSplit />
        <HowItWorks />
        <CTASection />
      </main>
      <LandingFooter />
    </div>
  );
}
