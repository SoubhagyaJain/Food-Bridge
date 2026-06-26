import { getCurrentProfile } from "@/lib/auth/session";
import { MarketingHeaderNav } from "@/components/features/marketing/MarketingHeaderNav";

export async function MarketingHeader() {
  const profile = await getCurrentProfile();

  return (
    <MarketingHeaderNav
      user={
        profile
          ? {
              fullName: profile.fullName,
              role: profile.role,
            }
          : null
      }
    />
  );
}