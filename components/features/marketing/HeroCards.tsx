import { ImpactCardsGrid } from "@/components/features/marketing/ImpactCards";

export function HeroCards() {
  return (
    <section className="relative z-20 -mt-10 bg-[#FDF8F3] py-16 dark:bg-card-muted">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold text-[#3D2B1F] dark:text-foreground md:text-4xl">
            Unlocking Community-Driven Impact
          </h2>
        </div>
        <ImpactCardsGrid />
      </div>
    </section>
  );
}