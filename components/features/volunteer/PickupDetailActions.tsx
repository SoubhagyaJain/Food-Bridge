"use client";

import { useActionState } from "react";
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

type ActionState = { error?: string } | null;

export function PickupDetailActions({
  pickupId,
  status,
  volunteerId,
  currentUserId,
}: PickupDetailActionsProps) {
  const isOwner = volunteerId === currentUserId;

  if (status === "open") {
    return (
      <PickupActionButton pickupId={pickupId} action={acceptPickupAction} label="Accept pickup" />
    );
  }

  if (!isOwner) return null;

  if (status === "assigned") {
    return (
      <PickupActionButton pickupId={pickupId} action={markPickedUpAction} label="Mark picked up" />
    );
  }

  if (status === "in_transit") {
    return (
      <PickupActionButton pickupId={pickupId} action={completePickupAction} label="Mark delivered" />
    );
  }

  return null;
}

function PickupActionButton({
  pickupId,
  action,
  label,
}: {
  pickupId: string;
  action: (id: string) => Promise<{ error?: string; success?: boolean }>;
  label: string;
}) {
  const [state, formAction, pending] = useActionState(
    async (_prev: ActionState, _formData: FormData): Promise<ActionState> => {
      const result = await action(pickupId);
      return result.error ? { error: result.error } : null;
    },
    null
  );

  return (
    <div>
      <form action={formAction}>
        <Button type="submit" disabled={pending} aria-busy={pending}>
          {pending ? "Updating…" : label}
        </Button>
      </form>
      {state?.error && (
        <p role="alert" className="mt-2 text-sm text-error">
          {state.error}
        </p>
      )}
    </div>
  );
}