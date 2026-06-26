import Link from "next/link";
import { ArrowRight, Award } from "lucide-react";
import { getMilestoneProgress } from "@/lib/volunteer/badges";

type MilestoneTrackerProps = {
  totalDeliveries: number;
};

export function MilestoneTracker({ totalDeliveries }: MilestoneTrackerProps) {
  const milestone = getMilestoneProgress(totalDeliveries);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-coral to-[#E25C43] p-6 text-white shadow-md">
      <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 transform opacity-10">
        <Award size={120} />
      </div>
      <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-2">
            <Award size={20} className="text-orange-200" />
            <h3 className="text-lg font-semibold">{milestone.title}</h3>
          </div>
          <p className="mb-4 text-sm text-orange-100">{milestone.description}</p>
          <div className="mb-2 h-2.5 w-full rounded-full bg-black/20 backdrop-blur-sm">
            <div
              className="h-2.5 rounded-full bg-white transition-all"
              style={{ width: `${milestone.progress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs font-medium text-orange-200">
            <span>{milestone.current} deliveries</span>
            <span>{milestone.target} delivery</span>
          </div>
        </div>
        <Link
          href="/volunteer/pickups"
          className="flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-white px-6 py-3 text-sm font-semibold text-brand-coral shadow-sm transition-colors hover:bg-stone-50 dark:bg-card dark:hover:bg-accent-hover"
        >
          Find a pickup <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}