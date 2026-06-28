"use client";

import { useReducedMotion } from "motion/react";
import type { CommunityTestimonial } from "@/lib/marketing/testimonials";
import { cn } from "@/lib/utils";
import { MaterialIcon } from "./MaterialIcon";

type TestimonialsMarqueeProps = {
  testimonials: CommunityTestimonial[];
};

function getInitials(name: string) {
  return name
    .replace(/^(Dr\.|Sister)\s+/i, "")
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function TestimonialCard({ testimonial }: { testimonial: CommunityTestimonial }) {
  return (
    <article
      className={cn(
        "group flex w-[min(88vw,22rem)] shrink-0 flex-col rounded-xl border",
        "border-primary/20 bg-white p-6 shadow-xl ring-1 ring-black/5",
        "transition-[transform,box-shadow,border-color] duration-300",
        "hover:border-primary/40 hover:shadow-2xl md:w-[26rem] md:p-8",
        "dark:border-mkt-border dark:bg-[#1a1218]/95 dark:ring-white/10"
      )}
    >
      <MaterialIcon
        name="format_quote"
        className="mb-4 text-3xl text-primary opacity-80 transition-all duration-300 group-hover:scale-110 group-hover:opacity-100 md:text-4xl"
      />
      <p className="mb-6 line-clamp-6 flex-grow font-sans text-sm font-semibold italic leading-relaxed text-mkt-text md:text-base">
        &ldquo;{testimonial.quote}&rdquo;
      </p>
      <div className="flex items-center gap-4 border-t border-mkt-border pt-4">
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-primary/25 bg-primary/10 font-button text-sm font-bold text-primary"
          aria-hidden
        >
          {getInitials(testimonial.name)}
        </div>
        <div className="min-w-0">
          <p className="truncate font-button text-sm font-bold text-mkt-text">{testimonial.name}</p>
          <p className="truncate font-sans text-xs font-semibold text-mkt-text-muted">{testimonial.role}</p>
          <p className="mt-0.5 flex items-center gap-1 font-sans text-xs font-semibold text-mkt-text-subtle">
            <MaterialIcon name="location_on" className="text-sm text-primary" />
            {testimonial.location}
          </p>
        </div>
      </div>
    </article>
  );
}

function MarqueeTrack({
  testimonials,
  direction = "left",
}: {
  testimonials: CommunityTestimonial[];
  direction?: "left" | "right";
}) {
  const duplicated = [...testimonials, ...testimonials];

  return (
    <div
      className={cn(
        "flex w-max gap-5 will-change-transform md:gap-6",
        "animate-testimonials-marquee motion-reduce:animate-none",
        direction === "right" && "animate-testimonials-marquee-reverse motion-reduce:animate-none",
        "hover:[animation-play-state:paused] motion-reduce:hover:[animation-play-state:running]"
      )}
      style={{ contain: "layout style paint" }}
    >
      {duplicated.map((testimonial, index) => (
        <TestimonialCard
          key={`${testimonial.name}-${testimonial.location}-${index}`}
          testimonial={testimonial}
        />
      ))}
    </div>
  );
}

export function TestimonialsMarquee({ testimonials }: TestimonialsMarqueeProps) {
  const reduceMotion = useReducedMotion();

  const midpoint = Math.ceil(testimonials.length / 2);
  const firstRow = testimonials.slice(0, midpoint);
  const secondRow = testimonials.slice(midpoint);

  if (reduceMotion) {
    return (
      <div className="grid grid-cols-1 gap-6 px-margin-mobile md:grid-cols-2 md:px-margin-desktop lg:grid-cols-3">
        {testimonials.slice(0, 6).map((testimonial) => (
          <TestimonialCard key={`${testimonial.name}-${testimonial.location}`} testimonial={testimonial} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative w-full space-y-5 md:space-y-6">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-gradient-to-r from-black/50 to-transparent md:w-24" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-gradient-to-l from-black/50 to-transparent md:w-24" />

      <div className="overflow-hidden">
        <MarqueeTrack testimonials={firstRow} direction="left" />
      </div>
      <div className="overflow-hidden">
        <MarqueeTrack testimonials={secondRow} direction="right" />
      </div>
    </div>
  );
}