"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function NavigationProgress() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(true);
    setProgress(12);

    const tick1 = window.setTimeout(() => setProgress(45), 80);
    const tick2 = window.setTimeout(() => setProgress(72), 200);
    const tick3 = window.setTimeout(() => setProgress(92), 400);
    const complete = window.setTimeout(() => {
      setProgress(100);
      window.setTimeout(() => setVisible(false), 180);
    }, 520);

    return () => {
      window.clearTimeout(tick1);
      window.clearTimeout(tick2);
      window.clearTimeout(tick3);
      window.clearTimeout(complete);
    };
  }, [pathname, searchParams]);

  if (!visible) return null;

  return (
    <div
      className="route-progress-track"
      role="progressbar"
      aria-hidden
      aria-valuenow={progress}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="route-progress-bar" style={{ transform: `scaleX(${progress / 100})` }} />
    </div>
  );
}