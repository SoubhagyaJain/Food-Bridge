"use client";

import Link from "next/link";
import { StitchImage } from "./StitchImage";
import { motion, useReducedMotion, useScroll, useTransform, type Variants } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { STITCH_IMAGES } from "@/lib/marketing/stitch-images";
import {
  mktHeroCtaPrimary,
  mktHeroCtaSecondary,
  mktHeroLabel,
  mktHeroSubtitle,
  mktHeroTitle,
} from "@/lib/marketing/typography";
import { cn } from "@/lib/utils";

const SLIDES = STITCH_IMAGES.heroSlides;
const SLIDE_INTERVAL_MS = 5800;
const CROSSFADE_DURATION_S = 2.2;

const crossfadeEase = [0.4, 0, 0.2, 1] as const;

/** Stitch light hero photo — bright, warm, punchy */
const HERO_IMAGE_FILTERS_LIGHT =
  "saturate-150 contrast-125 brightness-110";

/** Stitch dark hero photo — dimmed for overlay stack */
const HERO_IMAGE_FILTERS_DARK =
  "dark:saturate-150 dark:contrast-[1.1] dark:brightness-[0.8]";

const hopefulSpring = {
  type: "spring" as const,
  stiffness: 34,
  damping: 22,
  mass: 1.25,
};

const humanSpring = {
  type: "spring" as const,
  stiffness: 48,
  damping: 26,
  mass: 0.95,
};

const textReveal: Variants = {
  hidden: { opacity: 0, y: 28, filter: "blur(6px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: humanSpring,
  },
};

const contentStagger: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
      delayChildren: 0.35,
    },
  },
};

type HeroSlideLayerProps = {
  index: number;
  isKenBurns: boolean;
  reduceMotion: boolean | null;
};

function HeroSlideLayer({ index, isKenBurns, reduceMotion }: HeroSlideLayerProps) {
  const slide = SLIDES[index];
  return (
    <StitchImage
      src={slide.src}
      alt={slide.alt}
      fill
      priority={index === 0}
      fetchPriority={index === 0 ? "high" : "low"}
      loading={index === 0 ? "eager" : "lazy"}
      sizes="100vw"
      className={cn(
        "object-cover object-center",
        HERO_IMAGE_FILTERS_LIGHT,
        HERO_IMAGE_FILTERS_DARK,
        !reduceMotion && isKenBurns && "animate-ken-burns"
      )}
    />
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const baseSlideRef = useRef(0);

  const [baseSlide, setBaseSlide] = useState(0);
  const [incomingSlide, setIncomingSlide] = useState<number | null>(null);
  const isTransitioning = incomingSlide !== null;

  useEffect(() => {
    baseSlideRef.current = baseSlide;
  }, [baseSlide]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const bgParallaxY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "18%"]);
  const contentParallaxY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "-4%"]);

  const advanceSlide = useCallback(() => {
    if (SLIDES.length <= 1) return;
    setIncomingSlide((current) => {
      if (current !== null) return current;
      return (baseSlideRef.current + 1) % SLIDES.length;
    });
  }, []);

  const handleIncomingComplete = useCallback(() => {
    setIncomingSlide((current) => {
      if (current !== null) setBaseSlide(current);
      return null;
    });
  }, []);

  useEffect(() => {
    if (reduceMotion || SLIDES.length <= 1) return;
    const timer = setInterval(advanceSlide, SLIDE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, [reduceMotion, advanceSlide]);

  useEffect(() => {
    if (incomingSlide === null || reduceMotion) return;
    const fallback = window.setTimeout(
      handleIncomingComplete,
      CROSSFADE_DURATION_S * 1000 + 250
    );
    return () => window.clearTimeout(fallback);
  }, [incomingSlide, reduceMotion, handleIncomingComplete]);

  useEffect(() => {
    const preload = (src: string) => {
      const img = new window.Image();
      img.src = src;
    };
    preload(SLIDES[1].src);
    const deferRest = () => SLIDES.slice(2).forEach((slide) => preload(slide.src));
    let idleId: number | undefined;
    let timerId: ReturnType<typeof setTimeout> | undefined;
    if (typeof window.requestIdleCallback === "function") {
      idleId = window.requestIdleCallback(deferRest, { timeout: 4000 });
    } else {
      timerId = setTimeout(deferRest, 2500);
    }
    return () => {
      if (idleId !== undefined) window.cancelIdleCallback(idleId);
      if (timerId !== undefined) clearTimeout(timerId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="home"
      className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-black pb-32 pt-24"
    >
      {/* Cinematic slideshow + Stitch overlay stack */}
      <motion.div
        className="absolute inset-0 z-0 h-full w-full will-change-transform"
        style={{ y: reduceMotion ? undefined : bgParallaxY }}
      >
        <motion.div
          className="absolute inset-0 overflow-hidden"
          initial={reduceMotion ? false : { y: "6%", scale: 1.06 }}
          animate={reduceMotion ? undefined : { y: "0%", scale: 1 }}
          transition={hopefulSpring}
        >
          <div className="absolute inset-0 z-[1]">
            <HeroSlideLayer
              index={baseSlide}
              isKenBurns={!isTransitioning}
              reduceMotion={reduceMotion}
            />
          </div>

          {incomingSlide !== null && (
            <motion.div
              key={incomingSlide}
              className="absolute inset-0 z-[2]"
              initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: CROSSFADE_DURATION_S, ease: crossfadeEase }}
              onAnimationComplete={handleIncomingComplete}
            >
              <HeroSlideLayer index={incomingSlide} isKenBurns reduceMotion={reduceMotion} />
            </motion.div>
          )}
        </motion.div>

        {/* Stitch light — warm multiply + radial vignette */}
        <div
          className="pointer-events-none absolute inset-0 z-[3] bg-gradient-to-b from-primary/30 via-primary/10 to-primary/40 mix-blend-multiply dark:hidden"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[3] bg-[radial-gradient(circle_at_center,transparent_20%,rgba(60,0,10,0.6)_100%)] dark:hidden"
          aria-hidden
        />

        {/* Stitch dark — black wash + multiply + radial */}
        <div
          className="pointer-events-none absolute inset-0 z-[3] hidden bg-black/50 dark:block"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[3] hidden bg-gradient-to-b from-primary/30 via-primary/10 to-primary/40 mix-blend-multiply dark:block"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[3] hidden bg-[radial-gradient(circle_at_center,transparent_20%,rgba(60,0,10,0.6)_100%)] dark:block"
          aria-hidden
        />
      </motion.div>

      {/* Hero text overlay — photo, nav, and overlays unchanged */}
      <motion.div
        className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center px-margin-mobile text-center md:px-margin-desktop"
        style={{ y: reduceMotion ? undefined : contentParallaxY }}
        variants={reduceMotion ? undefined : contentStagger}
        initial={reduceMotion ? false : "hidden"}
        animate={reduceMotion ? undefined : "visible"}
      >
        <div className="mb-12 max-w-4xl space-y-8 md:mb-14 md:space-y-10">
          <motion.h1 variants={reduceMotion ? undefined : textReveal} className={mktHeroTitle}>
            Turn Surplus Food
            <br />
            Into Real Impact
          </motion.h1>

          <motion.p variants={reduceMotion ? undefined : textReveal} className={mktHeroSubtitle}>
            FoodBridge connects restaurants, volunteers, and NGOs so good food reaches people who
            need it — simply and efficiently.
          </motion.p>
        </div>

        <motion.div
          variants={reduceMotion ? undefined : textReveal}
          className="flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/register" className={mktHeroCtaPrimary}>
            Get Started
          </Link>
          <Link href="/#how-it-works" className={mktHeroCtaSecondary}>
            See How It Works
          </Link>
        </motion.div>

        <motion.p variants={reduceMotion ? undefined : textReveal} className={mktHeroLabel}>
          Trusted by 120+ volunteers &amp; 40+ local NGOs
        </motion.p>
      </motion.div>

      {/* Curvy bottom transition */}
      <div className="absolute bottom-0 left-0 z-20 w-full translate-y-px overflow-hidden leading-none">
        <svg
          className="relative block h-[60px] w-full md:h-[100px]"
          preserveAspectRatio="none"
          viewBox="0 0 1200 120"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden
        >
          <path
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V120H0V0C73.8,19.38,154.2,33.56,228.27,45.86,259.43,51.05,290.45,54.26,321.39,56.44Z"
            className="fill-surface transition-[fill] duration-300"
          />
        </svg>
      </div>
    </section>
  );
}