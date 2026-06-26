export type BadgeStatus = "locked" | "in_progress" | "unlocked";

export type VolunteerBadge = {
  id: string;
  title: string;
  description: string;
  status: BadgeStatus;
  progress?: number;
  icon: "package" | "award" | "moon" | "sun";
};

export function getVolunteerBadges(totalDeliveries: number): VolunteerBadge[] {
  const firstProgress = Math.min(totalDeliveries, 1);

  return [
    {
      id: "first_pickup",
      title: "First Pickup",
      description: "Complete your very first delivery",
      status: totalDeliveries >= 1 ? "unlocked" : "in_progress",
      progress: firstProgress,
      icon: "package",
    },
    {
      id: "rising_star",
      title: "Rising Star",
      description: "Complete 10 total food deliveries",
      status: totalDeliveries >= 10 ? "unlocked" : "locked",
      progress: Math.min(totalDeliveries / 10, 1),
      icon: "award",
    },
    {
      id: "night_owl",
      title: "Night Owl",
      description: "Complete 5 pickups after 8:00 PM",
      status: "locked",
      icon: "moon",
    },
    {
      id: "weekender",
      title: "Weekender",
      description: "Complete pickups on 3 weekends",
      status: "locked",
      icon: "sun",
    },
  ];
}

export function getMilestoneProgress(totalDeliveries: number) {
  const target = 1;
  const progress = Math.min(totalDeliveries / target, 1);
  return {
    title: totalDeliveries >= 1 ? "First Pickup Earned!" : "First Pickup Badge",
    description:
      totalDeliveries >= 1
        ? "You've completed your first delivery. Keep going!"
        : "You are just 1 delivery away from earning your first milestone!",
    progress: Math.max(progress * 100, totalDeliveries === 0 ? 10 : 100),
    current: totalDeliveries,
    target,
  };
}

export function getVolunteerTier(totalDeliveries: number): string {
  if (totalDeliveries >= 50) return "Community Champion";
  if (totalDeliveries >= 25) return "Dedicated Helper";
  if (totalDeliveries >= 10) return "Rising Star";
  if (totalDeliveries >= 1) return "First Delivery";
  return "Newcomer";
}