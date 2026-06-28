"use client";

import type { ReactNode } from "react";
import { PreloadMarketingImages } from "./PreloadMarketingImages";
import { ScrollBackgroundProvider } from "./ScrollBackgroundProvider";

/** Client shell for the marketing landing page — enables scroll-driven backgrounds. */
export function MarketingPageShell({ children }: { children: ReactNode }) {
  return (
    <ScrollBackgroundProvider>
      <PreloadMarketingImages />
      {children}
    </ScrollBackgroundProvider>
  );
}