"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { mktSectionSubtitleOnPhoto, mktSectionTitleLg } from "@/lib/marketing/typography";
import { cn } from "@/lib/utils";
import { revealItem, revealStagger, useSectionReveal } from "./section-motion";

export function CtaBannerSection() {
  const { ref, shouldAnimate, cycle } = useSectionReveal("-8% 0px -12% 0px", 0.4);

  return (
    <section
      ref={ref}
      id="cta"
      className="relative z-20 w-full overflow-hidden px-margin-mobile py-32 md:px-margin-desktop"
    >
      <div className="relative mx-auto max-w-4xl text-center">
        <motion.div
          key={`cta-panel-${cycle}`}
          className="rounded-2xl border border-white/30 bg-primary/80 p-12 shadow-2xl backdrop-blur-md md:p-20"
          variants={revealStagger}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
        >
          <motion.h2
            variants={revealItem}
            className={cn("mb-6 font-display-serif italic leading-tight", mktSectionTitleLg, "text-white dark:text-white")}
          >
            Start Turning Surplus
            <br />
            Into Impact Today
          </motion.h2>
          <motion.p
            variants={revealItem}
            className={cn("mx-auto mb-10 max-w-3xl leading-relaxed", mktSectionSubtitleOnPhoto)}
          >
            Join a growing network of people who believe good food should never go to waste. Sign up
            in minutes — no commitment required.
          </motion.p>
          <motion.div
            variants={revealItem}
            className="flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Link
              href="/register"
              className="hero-cta-primary rounded-full bg-white px-10 py-4 font-button text-sm font-bold uppercase tracking-wider text-primary shadow-xl transition-all duration-300 hover:scale-105 hover:bg-white active:bg-white"
            >
              Get Started
            </Link>
            <Link
              href="/#how-it-works"
              className="rounded-full border-2 border-white/80 px-10 py-4 font-button text-sm font-bold uppercase tracking-wider text-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-white/20"
            >
              Learn More
            </Link>
          </motion.div>
          <motion.p
            variants={revealItem}
            className="mt-8 font-button text-xs font-bold uppercase tracking-widest text-white text-shadow-dark"
          >
            No commitment required • Free for everyone
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}