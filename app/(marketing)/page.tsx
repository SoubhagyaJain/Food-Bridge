import { Hero } from "@/components/features/marketing/Hero";
import { HeroCards } from "@/components/features/marketing/HeroCards";
import { BuildingBridgesTogether } from "@/components/features/marketing/BuildingBridgesTogether";
import { getPlatformStats } from "@/server/queries/stats.queries";

export default async function MarketingPage() {
  const stats = await getPlatformStats();

  return (
    <>
      <Hero />
      <HeroCards />
      <BuildingBridgesTogether stats={stats} />
    </>
  );
}