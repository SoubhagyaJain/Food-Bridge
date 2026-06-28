"use client";

import { motion } from "motion/react";
import { CountUp } from "./CountUp";
import { MaterialIcon } from "./MaterialIcon";
import { cn } from "@/lib/utils";
import {
  mktSectionCaptionOnPhoto,
  mktSectionSubtitleOnPhoto,
  mktSectionTitleImpact,
  mktStatLabel,
  mktStatSub,
  mktStatValue,
} from "@/lib/marketing/typography";
import {
  cardReveal,
  gridStagger,
  revealItem,
  revealStagger,
  useSectionReveal,
} from "./section-motion";

const stats = [
  {
    icon: "restaurant",
    label: "Food Donors",
    target: 85,
    suffix: "+",
    sub: "Local restaurants & cafes.",
  },
  {
    icon: "groups",
    label: "Volunteers",
    target: 275,
    suffix: "+",
    sub: "The heartbeat of our community.",
  },
  {
    icon: "handshake",
    label: "NGO Partners",
    target: 40,
    suffix: "+",
    sub: "Expanding our reach together.",
  },
  {
    icon: "favorite",
    label: "Meals Shared",
    target: 50,
    suffix: "k+",
    sub: "Sustaining local families daily.",
  },
] as const;

const COUNT_BASE_DELAY = 0.28;
const COUNT_STAGGER = 0.1;

export function ImpactStatsSection() {
  const { ref, shouldAnimate, cycle, inView } = useSectionReveal("-12% 0px -18% 0px", 0.35);

  return (
    <section
      ref={ref}
      id="impact"
      className="relative z-20 flex min-h-[100dvh] min-h-screen w-full items-center justify-center overflow-hidden bg-transparent px-margin-mobile py-16 md:px-margin-desktop md:py-20"
    >
      <div className="relative z-[1] mx-auto w-full max-w-7xl">
        <motion.div
          key={`impact-header-${cycle}`}
          className="mb-8 text-center md:mb-12"
          variants={revealStagger}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
        >
          <motion.h2
            variants={revealItem}
            className={mktSectionTitleImpact}
          >
            The Impact We&apos;re Building Together
          </motion.h2>
          <motion.p
            variants={revealItem}
            className={cn("mt-4", mktSectionSubtitleOnPhoto)}
          >
            120+ volunteers and 40+ NGO partners turning surplus into shared meals — every single
            day.
          </motion.p>
          <motion.p
            variants={revealItem}
            className={cn("mt-1", mktSectionCaptionOnPhoto)}
          >
            Updated today
          </motion.p>
          <motion.div
            variants={revealItem}
            className="mx-auto mt-4 h-1 w-24 origin-center rounded-full bg-white shadow-sm"
          />
        </motion.div>

        <motion.div
          key={`impact-grid-${cycle}`}
          className="grid grid-cols-2 gap-6 text-center md:grid-cols-4 md:gap-gutter"
          variants={gridStagger}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              variants={cardReveal}
              className="group flex transform-gpu flex-col gap-4 rounded-xl border border-primary/20 bg-white/70 p-6 shadow-lg backdrop-blur-md transition-[transform,box-shadow,border-color] duration-300 hover:-translate-y-2 hover:border-primary/40 hover:shadow-xl dark:border-mkt-border dark:bg-mkt-card dark:hover:bg-mkt-card-hover md:p-8"
              style={{ willChange: inView ? "transform, opacity" : "auto" }}
            >
              <MaterialIcon
                name={stat.icon}
                className="mb-1 text-4xl text-primary transition-transform duration-300 group-hover:scale-110"
              />
              <span className={mktStatLabel}>
                {stat.label}
              </span>
              <span className={mktStatValue}>
                <CountUp
                  key={`${stat.label}-${cycle}`}
                  target={stat.target}
                  suffix={stat.suffix}
                  start={inView}
                  delay={COUNT_BASE_DELAY + index * COUNT_STAGGER}
                  duration={1.8}
                />
              </span>
              <p className={mktStatSub}>{stat.sub}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}