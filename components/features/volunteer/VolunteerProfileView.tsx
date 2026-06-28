"use client";

import { useState, useTransition } from "react";
import {
  Award,
  HeartHandshake,
  Lock,
  Moon,
  Package,
  Star,
  Sun,
} from "lucide-react";
import { VolunteerPageHeader } from "@/components/features/volunteer/portal/VolunteerPageHeader";
import { VolunteerPageShell } from "@/components/features/volunteer/portal/VolunteerPageShell";
import { updateVolunteerProfileAction } from "@/server/actions/volunteer.actions";
import type { VolunteerProfile } from "@/server/queries/volunteer.queries";
import type { VolunteerImpactStats } from "@/server/queries/pickup.queries";
import { getVolunteerBadges, getVolunteerTier } from "@/lib/volunteer/badges";

type VolunteerProfileViewProps = {
  fullName: string;
  profile: VolunteerProfile;
  stats: VolunteerImpactStats;
};

const BADGE_ICONS = {
  package: Package,
  award: Award,
  moon: Moon,
  sun: Sun,
};

export function VolunteerProfileView({ fullName, profile, stats }: VolunteerProfileViewProps) {
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);
  const badges = getVolunteerBadges(stats.totalDeliveries);
  const tier = getVolunteerTier(stats.totalDeliveries);
  const unlockedCount = badges.filter((b) => b.status === "unlocked").length;

  const statItems = [
    { label: "Total deliveries", value: String(stats.totalDeliveries) },
    { label: "This month", value: String(stats.deliveriesThisMonth) },
    { label: "Food delivered (kg)", value: stats.totalKg.toFixed(1) },
    { label: "Open near you", value: String(stats.openNearby) },
  ];

  const handleSubmit = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateVolunteerProfileAction(formData);
      setMessage(result.error ?? "Profile saved.");
    });
  };

  return (
    <VolunteerPageShell variant="solid">
      <VolunteerPageHeader
        title="Profile"
        description="Manage your account and availability settings."
      />

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-1">
          <div className="relative flex flex-col items-center overflow-hidden rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <div className="absolute left-0 top-0 h-24 w-full bg-gradient-to-br from-brand-sage/20 to-brand-sage/30 opacity-50 dark:from-brand-sage/10 dark:to-brand-sage/20" />
            <div className="relative mb-4 mt-8 flex h-24 w-24 items-center justify-center rounded-full border-4 border-card bg-brand-sage text-4xl font-bold text-white shadow-md">
              {fullName.charAt(0).toUpperCase()}
            </div>
            <h2 className="text-xl font-bold text-foreground">{fullName}</h2>
            <p className="mb-4 text-sm font-medium text-muted">Food Rescue Volunteer</p>
            <div className="flex w-full items-center justify-center gap-2 rounded-xl border border-orange-100 bg-orange-50 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-coral dark:border-orange-900/50 dark:bg-orange-950/40">
              <Star size={14} fill="currentColor" /> {tier}
            </div>
          </div>

          <form action={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="font-bold text-foreground">Settings</h3>
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted">
                Phone Number
              </label>
              <input
                name="phone"
                type="tel"
                defaultValue={profile.phone ?? ""}
                className="w-full rounded-xl border border-border bg-card-muted px-4 py-2.5 text-sm font-medium text-foreground transition-all focus:border-brand-coral focus:bg-card focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/50"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-muted">
                Home Address
              </label>
              <input
                name="homeAddress"
                required
                defaultValue={profile.homeAddress ?? ""}
                placeholder="Street, city, postal code"
                className="w-full rounded-xl border border-border bg-card-muted px-4 py-2.5 text-sm font-medium text-foreground transition-all focus:border-brand-coral focus:bg-card focus:outline-none focus:ring-2 focus:ring-orange-100 dark:focus:ring-orange-900/50"
              />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  Service Radius
                </label>
                <span className="rounded-md bg-orange-50 px-2 py-0.5 text-sm font-bold text-brand-coral dark:bg-orange-950/40">
                  {profile.serviceRadiusKm} km
                </span>
              </div>
              <input
                name="serviceRadiusKm"
                type="range"
                min={5}
                max={50}
                step={5}
                defaultValue={profile.serviceRadiusKm}
                className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-border accent-brand-sage"
              />
            </div>
            <div className="flex items-start gap-3">
              <input
                id="isAvailable"
                name="isAvailable"
                type="checkbox"
                defaultChecked={profile.isAvailable}
                value="true"
                className="mt-1 h-5 w-5 cursor-pointer rounded border-border text-brand-sage focus:ring-brand-sage"
              />
              <div>
                <label htmlFor="isAvailable" className="cursor-pointer text-sm font-semibold text-foreground">
                  Available for pickups
                </label>
                <p className="mt-0.5 text-xs text-muted">You will appear on the active volunteer map.</p>
              </div>
            </div>
            {message && (
              <p className={`text-sm ${message.includes("saved") ? "text-brand-sage" : "text-brand-coral"}`}>
                {message}
              </p>
            )}
            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-foreground py-3.5 font-bold text-background shadow-sm transition-all hover:-translate-y-0.5 hover:bg-brand-coral disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save Changes"}
            </button>
          </form>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-5 flex items-center gap-2 font-bold text-foreground">
              <HeartHandshake size={18} className="text-brand-coral" /> Lifetime Impact
            </h3>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {statItems.map((stat) => (
                <div
                  key={stat.label}
                  className="flex flex-col justify-center rounded-xl border border-border bg-card-muted p-4 transition-colors hover:border-border-soft"
                >
                  <span className="mb-1 text-[11px] font-bold uppercase tracking-wider text-muted">
                    {stat.label}
                  </span>
                  <span className="text-2xl font-black text-foreground">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-bl-full bg-orange-50 opacity-50 dark:bg-orange-950/30" />
            <div className="relative z-10 mb-6 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <Award className="text-brand-coral" size={22} /> My Achievements
              </h3>
              <span className="rounded-full border border-border bg-accent-hover px-3 py-1.5 text-xs font-bold text-muted">
                {unlockedCount} / {badges.length} Unlocked
              </span>
            </div>
            <div className="relative z-10 grid grid-cols-2 gap-4 md:grid-cols-4">
              {badges.map((badge) => {
                const Icon = BADGE_ICONS[badge.icon];
                const isLocked = badge.status === "locked";
                return (
                  <div
                    key={badge.id}
                    className={`relative flex flex-col items-center rounded-2xl p-5 text-center transition-all ${
                      isLocked
                        ? "border border-border bg-card-muted opacity-70 grayscale hover:opacity-100 hover:grayscale-0"
                        : "border-2 border-orange-100 bg-card shadow-sm dark:border-orange-900/50"
                    }`}
                  >
                    {isLocked && (
                      <div className="absolute right-3 top-3 rounded-full bg-card p-1 text-muted-soft shadow-sm">
                        <Lock size={10} />
                      </div>
                    )}
                    <div
                      className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full ${isLocked ? "bg-border text-muted" : "bg-orange-50 text-brand-coral dark:bg-orange-950/40"}`}
                    >
                      <Icon size={26} strokeWidth={1.5} />
                    </div>
                    <h4 className="mb-1 text-sm font-bold text-foreground">{badge.title}</h4>
                    <p className="text-[10px] font-medium leading-tight text-muted">{badge.description}</p>
                    {badge.status === "in_progress" && badge.progress != null && (
                      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-accent-hover">
                        <div
                          className="h-1.5 rounded-full bg-brand-coral"
                          style={{ width: `${badge.progress * 100}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </VolunteerPageShell>
  );
}