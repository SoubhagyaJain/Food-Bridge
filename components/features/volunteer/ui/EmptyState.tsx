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
    bg: "bg-green-50 dark:bg-green-950/40",
    btn: "bg-brand-sage hover:bg-brand-sage/90",
  },
  stone: {
    color: "text-muted",
    bg: "bg-accent-hover",
    btn: "bg-foreground hover:bg-foreground/90 dark:bg-foreground dark:text-background",
  },
} as const;

export function EmptyState({
  icon,
  title,
  description,
  buttonText,
  buttonHref,
  colorTheme = "orange",
}: EmptyStateProps) {
  const Icon = ICONS[icon];
  const theme = THEMES[colorTheme];

  return (
    <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card/90 p-10 text-center backdrop-blur-md sm:p-12">
      <div
        className={`mb-6 flex h-20 w-20 items-center justify-center rounded-full ${theme.bg}`}
      >
        <Icon size={36} className={theme.color} aria-hidden />
      </div>
      <h2 className="mb-2 text-xl font-bold text-foreground">{title}</h2>
      <p className="mb-8 max-w-md text-sm text-muted sm:text-base">{description}</p>
      {buttonText && buttonHref && (
        <Link
          href={buttonHref}
          className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-colors ${theme.btn}`}
        >
          {buttonText} <ArrowRight size={16} aria-hidden />
        </Link>
      )}
    </div>
  );
}