import { redirect } from "next/navigation";
import { TaskCard } from "@/components/features/volunteer/TaskCard";
import { VolunteerPageHeader } from "@/components/features/volunteer/portal/VolunteerPageHeader";
import { VolunteerPageShell } from "@/components/features/volunteer/portal/VolunteerPageShell";
import { EmptyState } from "@/components/features/volunteer/ui/EmptyState";
import { getCurrentProfile } from "@/lib/auth/session";
import { getVolunteerActiveTasks } from "@/server/queries/pickup.queries";

export default async function VolunteerTasksPage() {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const tasks = await getVolunteerActiveTasks(profile.id);

  return (
    <VolunteerPageShell variant="solid">
      <VolunteerPageHeader
        title="My Tasks"
        description="Track and update your active deliveries."
      />

      {tasks.length === 0 ? (
        <EmptyState
          icon="package"
          title="Ready to hit the road?"
          description="You have no active tasks right now. Browse available donations nearby, claim a pickup, and help bridge the gap to those in need today."
          buttonText="Find available pickups"
          buttonHref="/volunteer/pickups"
          colorTheme="green"
        />
      ) : (
        <div className="space-y-4">
          {tasks.map((pickup) => (
            <TaskCard key={pickup.id} pickup={pickup} />
          ))}
        </div>
      )}
    </VolunteerPageShell>
  );
}