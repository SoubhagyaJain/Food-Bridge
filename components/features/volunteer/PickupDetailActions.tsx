"use client";

import { useTransition } from "react";
import {
  acceptPickupAction,
  completePickupAction,
  markPickedUpAction,
} from "@/server/actions/volunteer.actions";
import { Button } from "@/components/ui/button";

type PickupDetailActionsProps = {
  pickupId: string;
  status: string;
  volunteerId?: string;
  currentUserId: string;
};

export function PickupDetailActions({
  pickupId,
  status,
  volunteerId,
  currentUserId,
}: PickupDetailActionsProps) {
  const [pending, startTransition] = useTransition();
  const isOwner = volunteerId === currentUserId;

  const run = (action: (id: string) => Promise<{ error?: string; success?: boolean }>) => {
    startTransition(async () => {
      await action(pickupId);
    });
  };

  if (status === "open") {
    return (
      <Button onClick={() => run(acceptPickupAction)} disabled={pending}>
        Accept pickup
      </Button>
    );
  }

  if (!isOwner) return null;

  if (status === "assigned") {
    return (
      <Button onClick={() => run(markPickedUpAction)} disabled={pending}>
        Mark picked up
      </Button>
    );
  }

  if (status === "in_transit") {
    return (
      <Button onClick={() => run(completePickupAction)} disabled={pending}>
        Mark delivered
      </Button>
    );
  }

  return null;
}