"use client";

import { useActionState } from "react";
import { createDonationAction } from "@/server/actions/donation.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type FieldErrors = {
  title?: string[];
  foodType?: string[];
  quantity?: string[];
  unit?: string[];
  pickupAddress?: string[];
  expiresAt?: string[];
  form?: string[];
};

export function NewDonationForm() {
  const [state, formAction, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => createDonationAction(formData),
    null
  );

  const fieldErrors = (state && "error" in state ? state.error : undefined) as FieldErrors | undefined;

  return (
    <form action={formAction} encType="multipart/form-data" className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input id="title" name="title" placeholder="e.g. Fresh vegetables surplus" required />
        {fieldErrors?.title && <p className="text-sm text-red-600">{fieldErrors.title[0]}</p>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="foodType">Food type</Label>
          <Input id="foodType" name="foodType" required />
          {fieldErrors?.foodType && <p className="text-sm text-red-600">{fieldErrors.foodType[0]}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="quantity">Quantity</Label>
          <Input id="quantity" name="quantity" type="number" min="1" required />
          {fieldErrors?.quantity && <p className="text-sm text-red-600">{fieldErrors.quantity[0]}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit">Unit</Label>
        <Input id="unit" name="unit" placeholder="kg, lbs, meals, boxes, liters, items" required />
        {fieldErrors?.unit && <p className="text-sm text-red-600">{fieldErrors.unit[0]}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="pickupAddress">Pickup address</Label>
        <Input id="pickupAddress" name="pickupAddress" required />
        {fieldErrors?.pickupAddress && (
          <p className="text-sm text-red-600">{fieldErrors.pickupAddress[0]}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="photo">Photo (optional)</Label>
        <Input
          id="photo"
          name="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="cursor-pointer file:mr-3 file:rounded-md file:border-0 file:bg-accent-hover file:px-3 file:py-1 file:text-sm"
        />
        <p className="text-xs text-muted">JPEG, PNG, or WebP — max 5 MB</p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="expiresAt">Expires at</Label>
        <Input id="expiresAt" name="expiresAt" type="datetime-local" required />
        {fieldErrors?.expiresAt && <p className="text-sm text-red-600">{fieldErrors.expiresAt[0]}</p>}
      </div>

      {fieldErrors?.form && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-400">
          {fieldErrors.form[0]}
        </p>
      )}

      <Button type="submit" disabled={pending}>
        {pending ? "Publishing…" : "Publish donation"}
      </Button>
    </form>
  );
}