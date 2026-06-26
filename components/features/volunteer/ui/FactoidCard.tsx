"use client";

import { useEffect, useState } from "react";
import { Leaf, Quote } from "lucide-react";

const FACTOIDS = [
  "Globally, about one-third of all food produced for human consumption is lost or wasted.",
  "Every kilogram of food you rescue saves roughly 2.5 kg of CO2 emissions.",
  "Reducing food waste is one of the top ways to reverse climate change.",
  "The food you deliver today can provide a family's meals for an entire weekend.",
];

export function FactoidCard() {
  const [fact, setFact] = useState(FACTOIDS[0]);

  useEffect(() => {
    setFact(FACTOIDS[Math.floor(Math.random() * FACTOIDS.length)]);
  }, []);

  return (
    <div className="relative rounded-2xl border border-[#c4dbca] bg-[#EAF1EB] p-6 dark:border-brand-sage/40 dark:bg-brand-sage/15">
      <Quote size={24} className="absolute left-4 top-4 text-[#2C5E3B] opacity-20 dark:text-brand-sage" />
      <div className="relative z-10 ml-6">
        <h4 className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#2C5E3B] dark:text-brand-sage">
          <Leaf size={14} /> Impact Fact
        </h4>
        <p className="text-sm font-medium italic leading-relaxed text-stone-700 dark:text-foreground/80">
          &ldquo;{fact}&rdquo;
        </p>
      </div>
    </div>
  );
}