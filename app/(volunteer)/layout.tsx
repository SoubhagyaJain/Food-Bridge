import { VolunteerSidebar } from "@/components/features/volunteer/VolunteerSidebar";
import { VolunteerTopBar } from "@/components/features/volunteer/VolunteerTopBar";
import { requireProfile } from "@/lib/auth/session";

export default async function VolunteerLayout({ children }: { children: React.ReactNode }) {
  const profile = await requireProfile();
  const userInitial = profile.fullName.charAt(0).toUpperCase();
  const firstName = profile.fullName.split(" ")[0];

  return (
    <div className="min-h-screen bg-[#F9F7F3] font-sans text-foreground dark:bg-background">
      <VolunteerSidebar userInitial={userInitial} />
      <VolunteerTopBar userName={firstName} />
      <main className="ml-0 pb-24 transition-all duration-300 md:ml-64 md:pb-10">
        {children}
      </main>
    </div>
  );
}