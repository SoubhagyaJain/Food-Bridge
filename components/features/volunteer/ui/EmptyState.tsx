"use client";

import Link from "next/link";
import { ArrowRight, HeartHandshake, MapPin, Package } from "lucide-react";

export type EmptyStateIcon = "package" | "heartHandshake" | "mapPin";

type EmptyStateProps = {
  icon: EmptyStateIcon;
  title: string;
  description: string;
  buttonText?: string;
  buttonHref?: string;
  colorTheme?: "orange" | "green" | "stone";
};

const ICONS = {
  package: Package,
  heartHandshake: HeartHandshake,
  mapPin: MapPin,
} as const;

const THEMES = {
  orange: {
    color: "text-brand-coral",
    bg: "bg-orange-50 dark:bg-orange-950/40",
    btn: "bg-brand-coral hover:bg-brand-coral-hover",
  },
  green: {
    color: "text-brand-sage",
    bg: "bg-brand-sage/10 dark:bg-brand-sage/20",
    btn: "bg-brand-sage hover:bg-brand-sage/90",
  },
  stone: {
    color: "text-muted",
    bg: "bg-accent-hover",
    btn: "bg-foreground hover:bg-foreground/90",
  },
};

export function EmptyState({
  icon,
  title,
  description,
  buttonText,
  buttonHref,
  colorTheme = "orange",
}: EmptyStateProps) {
  const theme = THEMES[colorTheme];
  const Icon = ICONS[icon];

  return (
    <div className="relative mx-auto mt-8 max-w-2xl overflow-hidden rounded-[2rem] border border-border bg-card p-12 text-center shadow-sm">
      <div className="relative mb-8 flex justify-center">
        <div
          className={`relative z-10 flex h-32 w-32 items-center justify-center rounded-full border border-border shadow-sm ${theme.bg}`}
        >
          <Icon size={48} className={theme.color} strokeWidth={1.5} />
        </div>
      </div>
      <h3 className="mb-4 text-2xl font-bold text-foreground">{title}</h3>
      <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-muted md:text-base">
        {description}
      </p>
      {buttonText && buttonHref && (
        <Link
          href={buttonHref}
          className={`mx-auto inline-flex items-center gap-2 rounded-xl px-8 py-3.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 ${theme.btn}`}
        >
          {buttonText} <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}