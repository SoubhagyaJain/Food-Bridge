"use client";

import { motion } from "motion/react";
import {
  mktCardBody,
  mktCardQuote,
  mktCardTitle,
  mktSectionSubtitleLg,
  mktSectionTitleLg,
} from "@/lib/marketing/typography";
import { MaterialIcon } from "./MaterialIcon";
import { cn } from "@/lib/utils";
import {
  cardReveal,
  gridStagger,
  revealItem,
  revealStagger,
  useSectionReveal,
} from "./section-motion";

const steps = [
  {
    num: "01",
    icon: "restaurant",
    title: "Donors Share Surplus",
    description:
      "Restaurants, homes, and kitchens list their extra food on Foodbridge instead of letting it go to waste.",
    quote: "One small action can create real impact.",
  },
  {
    num: "02",
    icon: "directions_car",
    title: "Volunteers Pick It Up",
    description:
      "Verified volunteers receive alerts and safely collect the food, becoming the bridge between generosity and need.",
    quote: "They turn good intentions into real help.",
  },
  {
    num: "03",
    icon: "handshake",
    title: "NGOs Deliver with Care",
    description:
      "Partner NGOs receive the food and distribute it to children and families with dignity and respect.",
    quote: "Every meal reaches someone who needs it.",
  },
  {
    num: "04",
    icon: "favorite",
    title: "Everyone Sees the Result",
    description:
      "Donors, volunteers, and NGOs receive updates showing the real difference their contribution made.",
    quote: "Connection creates lasting change.",
  },
] as const;

export function HowItWorksSection() {
  const { ref, shouldAnimate, cycle } = useSectionReveal();

  return (
    <section
      ref={ref}
      id="how-it-works"
      className="relative z-20 w-full overflow-hidden px-margin-mobile py-24 md:px-margin-desktop"
    >
      <div className="relative mx-auto max-w-7xl">
        <motion.div
          key={`how-header-${cycle}`}
          className="mb-16 text-center"
          variants={revealStagger}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
        >
          <motion.h2
            variants={revealItem}
            className={cn("mb-4 !text-white text-shadow-dark", mktSectionTitleLg)}
          >
            Four Simple Steps.
            <br />
            One Shared Mission.
          </motion.h2>
          <motion.p
            variants={revealItem}
            className={cn("mx-auto max-w-3xl !text-white text-shadow-dark", mktSectionSubtitleLg)}
          >
            From surplus in the kitchen to meals on the table — here&apos;s how FoodBridge closes
            the loop.
          </motion.p>
        </motion.div>

        <div className="relative">
          <div className="absolute left-[12%] right-[12%] top-[4.5rem] z-0 hidden h-0.5 bg-primary/20 md:block" />

          <motion.div
            key={`how-grid-${cycle}`}
            className="relative z-10 grid grid-cols-1 gap-8 pt-4 md:grid-cols-4 md:pt-[4.5rem]"
            variants={gridStagger}
            initial="hidden"
            animate={shouldAnimate ? "visible" : "hidden"}
          >
            {steps.map((step) => (
              <motion.div
                key={step.num}
                variants={cardReveal}
                className="group relative flex flex-col items-center rounded-2xl border border-primary/20 bg-white/80 p-8 text-center shadow-md backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl dark:border-mkt-border dark:bg-mkt-card"
              >
                <div className="absolute -top-[3px] left-1/2 z-10 hidden h-3 w-3 -translate-x-1/2 rounded-full bg-primary transition-transform duration-300 group-hover:scale-150 md:block" />
                <div className="mb-6 flex items-center justify-center gap-2">
                  <MaterialIcon
                    name={step.icon}
                    className="text-4xl text-primary transition-transform duration-300 group-hover:scale-110"
                  />
                  <span className="font-display text-5xl font-bold text-primary/10 transition-colors duration-300 group-hover:text-primary/20">
                    {step.num}
                  </span>
                </div>
                <h3 className={cn("mb-3", mktCardTitle)}>{step.title}</h3>
                <p className={cn("mb-4", mktCardBody)}>{step.description}</p>
                <p className={cn("mt-auto", mktCardQuote)}>
                  &ldquo;{step.quote}&rdquo;
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}