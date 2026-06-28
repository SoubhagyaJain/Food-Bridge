import { MarketingHeader } from "@/components/features/marketing/MarketingHeader";
import { SCROLL_BACKGROUND_SECTIONS } from "@/lib/marketing/scroll-backgrounds";
import { STITCH_IMAGES } from "@/lib/marketing/stitch-images";

export const dynamic = "force-dynamic";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {SCROLL_BACKGROUND_SECTIONS.map((section, index) => (
        <link
          key={section.id}
          rel="preload"
          as="image"
          href={section.src}
          fetchPriority={index === 0 ? "high" : "auto"}
        />
      ))}
      <link
        rel="preload"
        as="image"
        href={STITCH_IMAGES.heroSlides[0].src}
        fetchPriority="high"
      />
      <MarketingHeader />
      <main className="relative bg-transparent font-sans text-on-surface antialiased transition-colors duration-300">
        {children}
      </main>
    </>
  );
}