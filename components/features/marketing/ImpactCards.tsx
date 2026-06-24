import { Handshake, Heart, Truck, Users } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type ImpactCard = {
  title: string;
  subheading: string;
  body: string;
  borderClass: string;
  buttonClass: string;
  href: string;
  icon: ReactNode;
};

function DonorIcon() {
  return (
    <div className="relative flex h-12 w-12 items-end justify-center text-[#C45E3E]">
      <Heart className="absolute top-0 left-1/2 h-4 w-4 -translate-x-1/2 fill-[#FDF0E9]" strokeWidth={2} aria-hidden="true" />
      <Handshake className="h-9 w-9" strokeWidth={1.75} aria-hidden="true" />
    </div>
  );
}

function NgoIcons() {
  return (
    <div className="flex items-center gap-4 text-[#D97757]">
      <Truck className="h-9 w-9" strokeWidth={1.75} aria-hidden="true" />
      <Users className="h-9 w-9" strokeWidth={1.75} aria-hidden="true" />
    </div>
  );
}

function VolunteerIcon() {
  return <Users className="h-10 w-10 text-brand-sage" strokeWidth={1.75} aria-hidden="true" />;
}

export const IMPACT_CARDS: ImpactCard[] = [
  {
    title: "Donors",
    subheading: "Maximize your impact.",
    body: "Donate surplus food easily and see exactly where your contributions go.",
    borderClass: "border-[#E8C9BE] dark:border-brand-coral/35",
    buttonClass: "bg-brand-coral text-white hover:bg-brand-coral-hover",
    href: "/login",
    icon: <DonorIcon />,
  },
  {
    title: "NGO Partners",
    subheading: "Consistent resource access.",
    body: "Secure reliable food donations and support to serve your community effectively.",
    borderClass: "border-[#E8C9BE] dark:border-brand-coral/35",
    buttonClass: "bg-brand-coral text-white hover:bg-brand-coral-hover",
    href: "/login",
    icon: <NgoIcons />,
  },
  {
    title: "Volunteers",
    subheading: "Grow and Connect.",
    body: "Develop new skills, build community ties, and make a direct difference.",
    borderClass: "border-[#C5DDD0] dark:border-brand-sage/40",
    buttonClass: "bg-brand-sage text-white hover:opacity-90",
    href: "/register",
    icon: <VolunteerIcon />,
  },
];

export function ImpactCardsGrid() {
  return (
    <div className="grid gap-6 md:grid-cols-3">
      {IMPACT_CARDS.map((card) => (
        <div
          key={card.title}
          className={`flex flex-col rounded-2xl border bg-white p-7 transition-shadow hover:shadow-md dark:bg-card ${card.borderClass}`}
        >
          <div className="mb-5 flex min-h-[48px] items-center">{card.icon}</div>
          <h3 className="mb-3 text-xl font-semibold text-[#3D2B1F] dark:text-foreground">{card.title}</h3>
          <p className="mb-1 text-sm font-medium leading-relaxed text-[#3D2B1F] dark:text-foreground">
            {card.subheading}
          </p>
          <p className="flex-1 text-sm leading-relaxed text-[#5C5146] dark:text-muted">{card.body}</p>
          <Link
            href={card.href}
            className={`mt-6 inline-block w-fit rounded-full px-5 py-2 text-sm font-medium transition-colors ${card.buttonClass}`}
          >
            Donate
          </Link>
        </div>
      ))}
    </div>
  );
}