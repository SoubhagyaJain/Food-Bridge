import { Building2, Heart, Truck } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    title: "Donate Surplus Food",
    description:
      "Restaurants, events, and households can easily post their surplus food with details like quantity, type, and pickup location.",
    linkLabel: "For Donors",
    linkHref: "/login",
    linkClass: "text-brand-coral hover:text-brand-coral-hover",
    borderClass: "border-brand-coral",
    iconClass: "text-brand-coral",
    Icon: Heart,
  },
  {
    title: "NGOs Claim Donations",
    description:
      "Verified NGOs can browse available donations, filter by location and food type, and claim the food they need for their communities.",
    linkLabel: "For NGOs",
    linkHref: "/login",
    linkClass: "text-brand-sage hover:opacity-80",
    borderClass: "border-brand-sage",
    iconClass: "text-brand-sage",
    Icon: Building2,
  },
  {
    title: "Volunteers Deliver",
    description:
      "Volunteers can view available pickups, accept assignments, and safely deliver the food to NGOs or directly to those in need.",
    linkLabel: "For Volunteers",
    linkHref: "/register",
    linkClass: "text-foreground hover:opacity-80",
    borderClass: "border-foreground",
    iconClass: "text-foreground",
    Icon: Truck,
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-card py-20">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-3xl font-semibold text-foreground md:text-4xl">How FoodBridge Works</h2>
          <p className="mt-3 text-muted">
            A simple 3-step process to reduce food waste and help those in need.
          </p>
        </div>

        <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:gap-4">
          <div
            className="absolute left-[12%] right-[12%] top-[42px] hidden border-t-2 border-dashed border-[#D1C9B8] dark:border-border md:block"
            aria-hidden="true"
          />

          {STEPS.map((step) => (
            <div key={step.title} className="flex-1 text-center md:text-left">
              <div
                className={`relative z-10 mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border-2 bg-card md:mx-0 ${step.borderClass}`}
              >
                <step.Icon className={`h-7 w-7 ${step.iconClass}`} strokeWidth={1.75} aria-hidden="true" />
              </div>
              <h3 className="mb-3 text-xl font-semibold text-foreground">{step.title}</h3>
              <p className="mb-4 text-sm leading-relaxed text-muted">{step.description}</p>
              <Link href={step.linkHref} className={`text-sm font-medium hover:underline ${step.linkClass}`}>
                {step.linkLabel} →
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="mb-4 text-muted">Ready to make an impact?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild>
              <Link href="/login">Start Donating</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/register">Join as Volunteer</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}