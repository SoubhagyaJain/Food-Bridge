"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ROLE_CARD_STATIC_SURFACE } from "@/lib/marketing/design-lock";
import {
  mktCommunityCardBody,
  mktCommunityCardMeta,
  mktCommunityCardTitle,
  mktCommunityTitleOnPhoto,
  mktSectionSubtitleOnPhoto,
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

const roles = [
  {
    id: "donor",
    icon: "storefront",
    title: "Restaurants & Homes",
    description:
      "Have surplus food? Easily share it with people who need it instead of wasting it.",
    features: [
      "List surplus food in under 2 minutes",
      "Track where your food goes",
      "Reduce waste and make an impact",
    ],
    cta: "List Surplus Food",
    href: "/register?role=donor",
  },
  {
    id: "volunteer",
    icon: "local_shipping",
    title: "People Who Want to Help",
    description: "Want to contribute your time meaningfully? Become a volunteer with us.",
    features: [
      "Flexible timings that suit you",
      "See the real impact of your time",
      "Simple and safe process",
    ],
    cta: "Join as a Volunteer",
    href: "/register?role=volunteer",
    highlight: true,
  },
  {
    id: "ngo",
    icon: "handshake",
    title: "NGOs & Social Organizations",
    description: "Need a steady supply of food and reliable volunteers? Partner with us.",
    features: [
      "Get consistent food donations",
      "Access verified volunteers",
      "Simple coordination tools",
    ],
    cta: "Become a Partner",
    href: "/register?role=ngo",
  },
] as const;

export function RoleCardsSection() {
  const { ref, shouldAnimate, cycle } = useSectionReveal("-10% 0px -15% 0px", 0.3);

  return (
    <section
      ref={ref}
      id="community"
      className="relative z-20 flex min-h-[100dvh] min-h-screen w-full items-center justify-center overflow-hidden bg-transparent px-margin-mobile py-16 md:px-margin-desktop md:py-20"
    >
      <div className="relative z-[1] mx-auto w-full max-w-7xl">
        <motion.div
          key={`roles-header-${cycle}`}
          className="mb-12 text-center md:mb-16"
          variants={revealStagger}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
        >
          <motion.h2
            variants={revealItem}
            className={cn("mb-4", mktCommunityTitleOnPhoto)}
          >
            Built for Donors,
            <br />
            Volunteers &amp; NGOs
          </motion.h2>
          <motion.p
            variants={revealItem}
            className={cn("mx-auto max-w-3xl", mktSectionSubtitleOnPhoto)}
          >
            Whether you have food to give, time to share, or mouths to feed — there&apos;s a place
            for you in this movement.
          </motion.p>
          <motion.div
            variants={revealItem}
            className="mx-auto mt-4 h-1 w-24 origin-center rounded-full bg-white shadow-sm"
          />
        </motion.div>

        <motion.div
          key={`roles-grid-${cycle}`}
          className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-gutter"
          variants={gridStagger}
          initial="hidden"
          animate={shouldAnimate ? "visible" : "hidden"}
        >
          {roles.map((role) => (
            <motion.div
              key={role.id}
              variants={cardReveal}
              className={cn(
                "group flex h-full flex-col items-start rounded-2xl border p-8 shadow-xl backdrop-blur-md",
                ROLE_CARD_STATIC_SURFACE,
                "highlight" in role &&
                  role.highlight &&
                  "md:-mt-2 md:mb-2 md:scale-[1.02] ring-2 ring-primary/35 dark:ring-[#c5a26f]/55"
              )}
            >
              <div className="mb-6 flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-primary-container/90 text-on-primary-container transition-transform duration-300 group-hover:scale-110 dark:bg-[#5c4038] dark:text-[#f5e6d8]">
                <MaterialIcon name={role.icon} className="text-4xl" />
              </div>

              <h3 className={cn("mb-3", mktCommunityCardTitle)}>{role.title}</h3>
              <p className={cn("mb-6", mktCommunityCardBody)}>{role.description}</p>

              <ul className="mb-8 flex-1 space-y-3">
                {role.features.map((feat) => (
                  <li key={feat} className={cn("flex items-start gap-2", mktCommunityCardMeta)}>
                    <MaterialIcon
                      name="check_circle"
                      className="mt-0.5 shrink-0 text-base text-primary dark:text-[#e8c4a8]"
                    />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>

              <Link
                href={role.href}
                className={cn(
                  "hover-shimmer mt-auto w-full rounded-full px-8 py-3 text-center font-button text-sm font-bold uppercase tracking-wider shadow-lg transition-all duration-300 hover:scale-[1.02]",
                  "highlight" in role && role.highlight
                    ? "bg-primary text-on-primary hover:opacity-95 dark:bg-[#6b4a3a] dark:text-[#fff8f7] dark:hover:bg-[#7d5845]"
                    : "border border-primary/30 bg-white/90 text-primary hover:bg-white dark:border-[#8b6f63] dark:bg-[#5c4038] dark:text-[#fff8f7] dark:hover:bg-[#6b4f45]"
                )}
              >
                {role.cta}
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}