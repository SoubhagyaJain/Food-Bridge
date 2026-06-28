import { redirect } from "next/navigation";
import { VolunteerPortalImagePreload } from "@/components/features/volunteer/VolunteerPortalImagePreload";
import { VolunteerSidebar } from "@/components/features/volunteer/VolunteerSidebar";
import { VolunteerTopBar } from "@/components/features/volunteer/VolunteerTopBar";
import { getCurrentProfile } from "@/lib/auth/session";

/** Auth-gated routes — skip static prerender (no CI/user session at build time) */
export const dynamic = "force-dynamic";

export default async function VolunteerLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile();
  if (!profile) redirect("/login");

  const userInitial = profile.fullName.charAt(0).toUpperCase();
  const firstName = profile.fullName.split(" ")[0];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <a
        href="#volunteer-main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-card focus:px-4 focus:py-2 focus:shadow-md"
      >
        Skip to main content
      </a>
      <VolunteerPortalImagePreload />
      <VolunteerSidebar userInitial={userInitial} />
      <VolunteerTopBar userName={firstName} />
      <main
        id="volunteer-main"
        className="relative ml-0 bg-transparent pb-24 transition-all duration-300 md:ml-64 md:pb-10"
      >
        {children}
      </main>
    </div>
  );
}