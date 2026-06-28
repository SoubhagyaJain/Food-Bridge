import { CtaBannerSection } from "@/components/features/marketing/CtaBannerSection";
import { HeroSection } from "@/components/features/marketing/HeroSection";
import { HowItWorksSection } from "@/components/features/marketing/HowItWorksSection";
import { ImpactStatsSection } from "@/components/features/marketing/ImpactStatsSection";
import { MarketingFooter } from "@/components/features/marketing/MarketingFooter";
import { MarketingPageShell } from "@/components/features/marketing/MarketingPageShell";
import { RoleCardsSection } from "@/components/features/marketing/RoleCardsSection";
import { TestimonialsSection } from "@/components/features/marketing/TestimonialsSection";

export default function MarketingPage() {
  return (
    <MarketingPageShell>
      <main className="flex-grow">
        <HeroSection />
        <ImpactStatsSection />
        <HowItWorksSection />
        <RoleCardsSection />
        <TestimonialsSection />
        <CtaBannerSection />
        <MarketingFooter />
      </main>
    </MarketingPageShell>
  );
}