type GettingStartedChecklistProps = {
  profileComplete: boolean;
  hasDelivery: boolean;
};

export function GettingStartedChecklist({ profileComplete, hasDelivery }: GettingStartedChecklistProps) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
      <h3 className="mb-4 font-bold text-foreground">New to FoodBridge?</h3>
      <ul className="relative space-y-4 before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-border">
        <li className="relative pl-8">
          <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-green-100 dark:bg-green-950/50">
            <div className={`h-2 w-2 rounded-full ${profileComplete ? "bg-green-500" : "bg-muted-soft"}`} />
          </div>
          <p className="text-sm font-semibold text-foreground">Create profile</p>
          <p className="mt-1 text-xs text-muted">
            {profileComplete ? "You're all set up!" : "Set your home address on Profile."}
          </p>
        </li>
        <li className="relative pl-8">
          <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-card bg-orange-100 dark:bg-orange-950/50">
            <div className={`h-2 w-2 rounded-full ${hasDelivery ? "bg-green-500" : "bg-brand-coral"}`} />
          </div>
          <p className="text-sm font-semibold text-foreground">Complete a pickup</p>
          <p className="mt-1 text-xs text-muted">
            {hasDelivery ? "Great work — keep it up!" : "Claim a task nearby to get started."}
          </p>
        </li>
        <li className="relative pl-8">
          <div className="absolute left-0 top-1 h-6 w-6 rounded-full border-2 border-card bg-accent-hover" />
          <p className={`text-sm font-semibold ${hasDelivery ? "text-foreground" : "text-muted"}`}>
            Earn your first badge
          </p>
        </li>
      </ul>
    </div>
  );
}