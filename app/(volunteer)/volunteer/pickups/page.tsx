import { redirect } from "next/navigation";
import { PickupsView } from "@/components/features/volunteer/pickups/PickupsView";
import { filterAndSortPickups } from "@/lib/volunteer/filter-pickups";
import { getVolunteerOpenPickups } from "@/lib/volunteer/get-volunteer-open-pickups";
import { parsePickupSearchParams } from "@/lib/volunteer/pickup-search-params";
import { getCurrentProfile } from "@/lib/auth/session";
import { getVolunteerProfile } from "@/server/queries/volunteer.queries";

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function VolunteerPickupsPage({ searchParams }: PageProps) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const raw = await searchParams;
  const volunteerProfile = await getVolunteerProfile(profile.id);
  const parsed = parsePickupSearchParams(raw);
  const params = {
    ...parsed,
    radius:
      typeof raw.radius === "string" ? parsed.radius : volunteerProfile.serviceRadiusKm,
  };
  const allPickups = await getVolunteerOpenPickups(volunteerProfile);
  const pickups = filterAndSortPickups(
    allPickups,
    params,
    volunteerProfile.homeLat,
    volunteerProfile.homeLng
  );

  return (
    <PickupsView
      pickups={pickups}
      params={params}
      profileLat={volunteerProfile.homeLat}
      profileLng={volunteerProfile.homeLng}
    />
  );
}