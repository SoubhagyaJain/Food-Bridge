import Link from "next/link";
import { Button } from "@/components/ui/button";

const STEPS = [
  {
    step: 1,
    title: "Donate Surplus Food",
    description:
      "Restaurants, events, and households can easily post their surplus food with details like quantity, type, and pickup location.",
    badge: "For Donors",
    badgeClass: "bg-card text-brand-coral",
    circleClass: "bg-brand-coral",
  },
  {
    step: 2,
    title: "NGOs Claim Donations",
    description:
      "Verified NGOs can browse available donations, filter by location and food type, and claim the food they need for their communities.",
    badge: "For NGOs",
    badgeClass: "bg-card text-brand-sage",
    circleClass: "bg-brand-sage",
  },
  {
    step: 3,
    title: "Volunteers Deliver",
    description:
      "Volunteers can view available pickups, accept assignments, and safely deliver the food to NGOs or directly to those in need.",
    badge: "For Volunteers",
    badgeClass: "bg-card text-foreground",
    circleClass: "bg-foreground",
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="scroll-mt-24 bg-card py-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-14 text-center">
          <h2 className="text-4xl font-semibold text-foreground">How FoodBridge Works</h2>
          <p className="mx-auto mt-3 max-w-xl text-lg text-muted">
            A simple 3-step process to reduce food waste and help those in need.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {STEPS.map((item) => (
            <div
              key={item.step}
              className="group rounded-2xl bg-card-muted p-8 transition-all duration-300 hover:shadow-md dark:hover:shadow-black/20"
            >
              <div
                className={`mb-6 flex h-14 w-14 items-center justify-center rounded-full text-2xl font-semibold text-white ${item.circleClass}`}
              >
                {item.step}
              </div>
              <h3 className="mb-3 text-2xl font-semibold text-foreground">{item.title}</h3>
              <p className="leading-relaxed text-muted">{item.description}</p>
              <div className="mt-6">
                <span className={`inline-block rounded-full px-4 py-1.5 text-sm font-medium ${item.badgeClass}`}>
                  {item.badge}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <p className="mb-4 text-muted">Ready to make an impact?</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/login">Start Donating</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/register">Join as Volunteer</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}