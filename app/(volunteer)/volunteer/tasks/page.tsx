import { TaskCard } from "@/components/features/volunteer/TaskCard";
import { EmptyState } from "@/components/features/volunteer/ui/EmptyState";
import { requireProfile } from "@/lib/auth/session";
import { getVolunteerActiveTasks } from "@/server/queries/pickup.queries";

export default async function VolunteerTasksPage() {
  const profile = await requireProfile();
  const tasks = await getVolunteerActiveTasks(profile.id);

  return (
    <div className="mx-auto max-w-6xl px-4 pb-12 pt-4 md:px-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold tracking-tight text-foreground">My Tasks</h1>
        <p className="font-medium text-muted">Track and update your active deliveries.</p>
      </div>

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
    </div>
  );
}