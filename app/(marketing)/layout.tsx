import { MarketingHeader } from "@/components/features/marketing/MarketingHeader";
import { MarketingFooter } from "@/components/features/marketing/MarketingFooter";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <MarketingHeader />
      <main id="home">{children}</main>
      <MarketingFooter />
    </>
  );
}