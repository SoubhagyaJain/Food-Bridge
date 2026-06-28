import { getCurrentProfile } from "@/lib/auth/session";
import { MarketingNavbar } from "@/components/features/marketing/MarketingNavbar";

export async function MarketingHeader() {
  const profile = await getCurrentProfile();

  return (
    <MarketingNavbar
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