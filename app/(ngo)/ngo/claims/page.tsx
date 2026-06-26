import { requireProfile } from "@/lib/auth/session";
import { getClaimsByNgo } from "@/server/queries/claim.queries";
import { ClaimsList } from "@/components/features/ngo/ClaimsList";

export default async function NgoClaimsPage() {
  const profile = await requireProfile();
  const claims = await getClaimsByNgo(profile.id);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">My Claims</h1>
      <ClaimsList claims={claims} />
    </div>
  );
}