import { Hero } from "@/components/features/marketing/Hero";
import { HeroCards } from "@/components/features/marketing/HeroCards";
import { HowItWorks } from "@/components/features/marketing/HowItWorks";
import { CommunityImpact } from "@/components/features/marketing/CommunityImpact";
import { BuildingBridgesTogether } from "@/components/features/marketing/BuildingBridgesTogether";

export default function MarketingPage() {
  return (
    <>
      <Hero />
      <HeroCards />
      <HowItWorks />
      <CommunityImpact />
      <BuildingBridgesTogether />
    </>
  );
}