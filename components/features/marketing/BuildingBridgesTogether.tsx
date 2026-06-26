import Image from "next/image";
import { Heart, HandHeart, Users } from "lucide-react";
import type { PlatformStats } from "@/server/queries/stats.queries";

type BuildingBridgesTogetherProps = {
  stats?: PlatformStats;
};

const STAT_ICONS = [Heart, Users, HandHeart] as const;

export function BuildingBridgesTogether({ stats }: BuildingBridgesTogetherProps) {
  const displayStats = [
    { value: `${stats?.donations ?? 2354}+`, label: "Donations" },
    { value: `${stats?.helpedPeople ?? 3500}+`, label: "Helped People" },
    { value: `${stats?.volunteers ?? 500}+`, label: "Volunteers" },
  ];

  return (
    <section id="about" className="mx-auto max-w-7xl scroll-mt-24 bg-card px-6 py-16 md:px-12 md:py-20">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl shadow-lg shadow-black/10 dark:shadow-black/30">
          <Image
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070"
            alt="Woman embracing a young child"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        <div>
          <div className="mb-8">
            <h2 className="text-4xl font-bold tracking-tight text-foreground md:text-5xl">
              Building Bridges Together
            </h2>
            <p className="mt-3 text-lg font-medium text-brand-sage">We Listen. We Empower. We Nourish.</p>
          </div>

          <div className="space-y-6 text-[15px] leading-relaxed text-muted">
            <p>
              At foodbridge, we believe the most powerful change happens when we connect with those who are already
              transforming their communities. Rather than reinventing the wheel, we partner with local heroes to amplify
              their impact and bridge the gap between resources and those who need them most.
            </p>
            <p>
              Our heart lies in protecting and nurturing children. Thanks to the deep generosity of our sponsors, we
              are able to provide more than just financial aid—we deliver hope. From bringing essential humanitarian
              relief to offering legal advocacy and emotional support, we wrap our arms around vulnerable families
              worldwide.
            </p>
          </div>

          <div id="impact" className="mt-10 grid grid-cols-3 gap-4 sm:gap-6">
            {displayStats.map((stat, index) => {
              const Icon = STAT_ICONS[index];
              return (
                <div key={stat.label} className="text-center">
                  <div className="mb-3 flex justify-center">
                    <div className="rounded-full bg-accent-hover p-3">
                      <Icon className="h-6 w-6 text-brand-sage" strokeWidth={1.75} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="text-2xl font-semibold text-foreground sm:text-3xl">{stat.value}</div>
                  <div className="mt-1 text-xs text-muted sm:text-sm">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}