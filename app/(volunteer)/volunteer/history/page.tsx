import { redirect } from "next/navigation";
import { VolunteerHistoryView } from "@/components/features/volunteer/VolunteerHistoryView";
import { getCurrentProfile } from "@/lib/auth/session";
import { computeHistoryStats } from "@/lib/volunteer/history-stats";
import { getVolunteerHistoryMissions } from "@/server/queries/pickup.queries";

export default async function VolunteerHistoryPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const missions = await getVolunteerHistoryMissions(profile.id);
  const stats = computeHistoryStats(missions);

  return <VolunteerHistoryView missions={missions} stats={stats} />;
}