import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="bg-card-muted">
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-16">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <div>
            <h1 className="text-5xl font-semibold leading-tight tracking-tight text-foreground md:text-6xl">
              When We Come Together,
              <br />
              <span className="text-brand-coral">No One Goes Hungry</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg text-muted">
              FoodBridge connects people who have extra food with those who need it — through compassion
              and community.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Button size="lg" className="px-8 py-3.5" asChild>
                <Link href="/login">Donate Now</Link>
              </Button>
              <Button size="lg" variant="outline" className="px-8 py-3.5" asChild>
                <Link href="/register">Become a Volunteer</Link>
              </Button>
            </div>

            <p className="mt-5 text-sm text-muted-soft">Join 500+ volunteers making a real difference every week.</p>
          </div>

          <div className="relative mt-10 md:mt-0">
            <div className="relative h-[420px] w-full overflow-hidden rounded-3xl shadow-xl shadow-black/10 dark:shadow-black/30">
              <Image
                src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070"
                alt="Community coming together to help with food donations"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div className="absolute bottom-6 left-6 flex items-center gap-2 rounded-full bg-card/90 px-4 py-2 shadow-md backdrop-blur">
              <div className="h-2.5 w-2.5 animate-pulse rounded-full bg-brand-sage" aria-hidden="true" />
              <span className="text-sm font-medium text-foreground">Join 2,300+ Donors</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}