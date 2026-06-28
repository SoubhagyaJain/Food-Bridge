import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { VolunteerPageShell } from "@/components/features/volunteer/portal/VolunteerPageShell";
import { MaterialIcon } from "@/components/features/marketing/MaterialIcon";
import type { ComputedHistoryStats } from "@/lib/volunteer/history-stats";
import type { VolunteerHistoryMission } from "@/server/queries/pickup.queries";

type VolunteerHistoryViewProps = {
  missions: VolunteerHistoryMission[];
  stats: ComputedHistoryStats;
};

function formatHistoryDate(date: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function formatUnitLabel(unit?: string) {
  return (unit ?? "meals").toUpperCase();
}

const STAT_CARDS = [
  { key: "totalMissions", label: "Total Missions", field: "totalMissions" as const },
  { key: "meals", label: "Meals Rescued", field: "mealsRescuedDisplay" as const },
  { key: "co2", label: "CO2 Offset", field: "co2OffsetDisplay" as const },
  { key: "days", label: "Active Days", field: "activeDays" as const },
];

export function VolunteerHistoryView({ missions, stats }: VolunteerHistoryViewProps) {
  return (
    <VolunteerPageShell
      variant="cinematic"
      cinematicBg="history"
      contentClassName="max-w-container-max px-margin-mobile py-12 md:px-margin-desktop md:py-16"
    >
        <header className="history-stagger-in mb-16 text-center md:mb-section-gap md:text-left">
          <h1 className="mb-4 font-display text-4xl font-bold tracking-tight text-white md:text-5xl lg:text-6xl">
            History of Impact
          </h1>
          <p className="mx-auto max-w-3xl font-display text-headline-md font-bold text-tertiary-fixed md:mx-0 md:text-headline-lg">
            Every pickup is a story of a community coming together.
          </p>
        </header>

        {missions.length === 0 ? (
          <div className="history-stagger-in history-glass-solid mx-auto flex max-w-2xl flex-col items-center rounded-3xl p-12 text-center md:p-16">
            <div className="mb-6 flex h-24 w-24 items-center justify-center rounded-full border border-[var(--dash-on-primary-container)]/20 bg-[var(--dash-on-primary-container)]/10">
              <MaterialIcon
                name="volunteer_activism"
                className="text-4xl text-[var(--dash-on-primary-container)]"
              />
            </div>
            <h2 className="mb-3 text-2xl font-bold text-white">Your journey starts here!</h2>
            <p className="mb-8 max-w-md leading-relaxed text-surface-dim">
              Every single delivery feeds someone in need and reduces carbon emissions. Complete your
              first pickup to start tracking your amazing impact.
            </p>
            <Link
              href="/volunteer/pickups"
              className="inline-flex items-center gap-2 rounded-full bg-[var(--dash-primary-container)] px-8 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:bg-[#360a0a]"
            >
              Find My First Pickup <ArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <>
            <section className="history-stagger-in mb-16 md:mb-section-gap">
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {STAT_CARDS.map(({ key, label, field }) => (
                  <div
                    key={key}
                    className="history-stat-card rounded-2xl p-6 text-center transition-all duration-300 hover:bg-white/20"
                  >
                    <p className="mb-2 font-display text-label-lg uppercase tracking-wider text-gray-300">
                      {label}
                    </p>
                    <p className="font-display text-display-lg-mobile text-[var(--dash-on-primary-container)] md:text-display-lg">
                      {stats[field]}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            <section className="history-stagger-in">
              <h2 className="mb-8 inline-block border-b border-outline-variant/30 pb-4 font-display text-headline-md text-white">
                Completed Missions
              </h2>
              <div className="space-y-4">
                {missions.map((mission) => (
                  <div
                    key={mission.id}
                    className="history-mission-card group flex flex-col items-start justify-between gap-4 rounded-xl p-6 transition-all duration-300 md:flex-row md:items-center"
                  >
                    <div className="flex-1">
                      {mission.deliveredAt && (
                        <p className="mb-1 font-display text-label-lg uppercase tracking-wider text-secondary-fixed-dim">
                          {formatHistoryDate(mission.deliveredAt)}
                        </p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 font-sans text-body-lg text-white">
                        <span>{mission.donorName}</span>
                        <MaterialIcon name="arrow_forward" className="text-outline" />
                        <span>{mission.ngoOrganizationName}</span>
                      </div>
                    </div>
                    <div className="flex w-full items-center justify-between gap-8 md:w-auto md:justify-end">
                      {mission.quantity != null && (
                        <div className="text-right">
                          <span className="font-display text-headline-md text-tertiary-fixed">
                            {mission.quantity}
                          </span>
                          <span className="ml-1 font-display text-label-lg uppercase tracking-wider text-gray-400">
                            {formatUnitLabel(mission.unit)}
                          </span>
                        </div>
                      )}
                      <Link
                        href={`/volunteer/pickups/${mission.id}`}
                        className="rounded-full bg-[var(--dash-primary-container)] px-6 py-2 text-sm font-semibold text-white shadow-md transition-all hover:bg-[#360a0a]"
                      >
                        Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}
    </VolunteerPageShell>
  );
}