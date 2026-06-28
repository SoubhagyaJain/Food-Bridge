"use client";

import { Suspense } from "react";
import { NavigationProgress } from "@/components/shared/NavigationProgress";
import { ScrollToTop } from "@/components/shared/ScrollToTop";

function NavigationProgressBoundary() {
  return (
    <Suspense fallback={null}>
      <NavigationProgress />
    </Suspense>
  );
}

export function NavigationShell() {
  return (
    <>
      <NavigationProgressBoundary />
      <ScrollToTop />
    </>
  );
}