import { Building2, HandHeart, Heart } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type ImpactCard = {
  title: string;
  lines: [string, string];
  iconBg: string;
  iconClass: string;
  Icon: LucideIcon;
};

const CARDS: ImpactCard[] = [
  {
    title: "Donors",
    lines: ["Maximize your impact.", "Donate surplus food easily and see exactly where your contributions go."],
    iconBg: "bg-[#FDF0E9] dark:bg-brand-coral/15",
    iconClass: "text-brand-coral",
    Icon: Heart,
  },
  {
    title: "NGO Partners",
    lines: ["Consistent resource access.", "Secure reliable food donations and support to serve your community effectively."],
    iconBg: "bg-[#E8F5E9] dark:bg-brand-sage/15",
    iconClass: "text-brand-sage",
    Icon: Building2,
  },
  {
    title: "Volunteers",
    lines: ["Grow and Connect.", "Develop new skills, build community ties, and make a direct difference."],
    iconBg: "bg-[#E8F0F5] dark:bg-sky-500/15",
    iconClass: "text-sky-700 dark:text-sky-400",
    Icon: HandHeart,
  },
];

export function CommunityImpact() {
  return (
    <section className="bg-card-muted py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-semibold text-foreground md:text-4xl">
            Unlocking Community-Driven Impact
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {CARDS.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-[#E8DFD3] bg-card p-7 transition-shadow hover:shadow-md dark:border-border"
            >
              <div
                className={`mb-5 flex h-12 w-12 items-center justify-center rounded-full ${card.iconBg}`}
              >
                <card.Icon className={`h-6 w-6 ${card.iconClass}`} strokeWidth={1.75} aria-hidden="true" />
              </div>
              <h3 className="mb-2 text-xl font-semibold text-foreground">{card.title}</h3>
              <p className="text-sm leading-relaxed text-muted">
                {card.lines[0]}
                <br />
                {card.lines[1]}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}