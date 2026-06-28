"use client";

import { motion } from "motion/react";
import { COMMUNITY_TESTIMONIALS } from "@/lib/marketing/testimonials";
import { mktTestimonialsSubtitle, mktTestimonialsTitle } from "@/lib/marketing/typography";
import { TestimonialsMarquee } from "./TestimonialsMarquee";
import { cn } from "@/lib/utils";
import { revealItem, revealStagger, useSectionReveal } from "./section-motion";

export function TestimonialsSection() {
  const { ref, shouldAnimate, cycle } = useSectionReveal();

  return (
    <section
      ref={ref}
      id="stories"
      className="relative z-20 w-full overflow-hidden py-24"
    >
      <motion.div
        key={`testimonials-header-${cycle}`}
        className="mx-auto mb-16 max-w-7xl px-margin-mobile text-center md:px-margin-desktop"
        variants={revealStagger}
        initial="hidden"
        animate={shouldAnimate ? "visible" : "hidden"}
      >
        <motion.h2
          variants={revealItem}
          className={cn("mb-4", mktTestimonialsTitle)}
        >
          Stories That Move Us Forward
        </motion.h2>
        <motion.p
          variants={revealItem}
          className={cn("mx-auto max-w-3xl", mktTestimonialsSubtitle)}
        >
          Donors, volunteers, NGOs, and families share what FoodBridge means in their daily lives —
          and why it matters.
        </motion.p>
      </motion.div>

      <TestimonialsMarquee testimonials={COMMUNITY_TESTIMONIALS} />
    </section>
  );
}