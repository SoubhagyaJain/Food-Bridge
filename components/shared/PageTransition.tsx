"use client";

import { motion, useReducedMotion } from "motion/react";
import { usePathname } from "next/navigation";

type PageTransitionProps = {
  children: React.ReactNode;
  variant?: "subtle" | "dashboard";
};

const cinematicEase = [0.22, 1, 0.36, 1] as const;

export function PageTransition({ children, variant = "subtle" }: PageTransitionProps) {
  const pathname = usePathname();
  const reduceMotion = useReducedMotion();

  const yOffset = variant === "dashboard" ? 6 : 10;

  if (reduceMotion) {
    return <div key={pathname}>{children}</div>;
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, ease: cinematicEase }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}