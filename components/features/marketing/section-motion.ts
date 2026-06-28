"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, type Variants } from "motion/react";

/** GPU-friendly tween — opacity + transform only */
export const smoothEase = [0.22, 1, 0.36, 1] as const;
export const revealTween = { duration: 0.65, ease: smoothEase };

export const revealItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: revealTween },
};

export const revealStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.04 } },
};

export const cardReveal: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: revealTween },
};

export const gridStagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

export function useSectionReveal(
  margin: `${number}% ${number}px ${number}% ${number}px` = "-12% 0px -18% 0px",
  amount = 0.3
) {
  const ref = useRef<HTMLElement>(null);
  const wasInView = useRef(false);
  const [cycle, setCycle] = useState(0);

  const inView = useInView(ref, { margin, amount });

  useEffect(() => {
    if (inView && !wasInView.current) {
      setCycle((c) => c + 1);
    }
    wasInView.current = inView;
  }, [inView]);

  return { ref, shouldAnimate: cycle > 0, cycle, inView };
}