import { CinematicBackground } from "@/components/shared/CinematicBackground";
import type { CinematicBackgroundVariant } from "@/components/shared/CinematicBackground";
import { portalTokens } from "@/lib/volunteer/portal-tokens";
import { cn } from "@/lib/utils";

type VolunteerPageShellProps = {
  variant?: "solid" | "cinematic";
  cinematicBg?: CinematicBackgroundVariant;
  className?: string;
  contentClassName?: string;
  children: React.ReactNode;
};

export function VolunteerPageShell({
  variant = "solid",
  cinematicBg,
  className,
  contentClassName,
  children,
}: VolunteerPageShellProps) {
  if (variant === "cinematic" && cinematicBg) {
    return (
      <div className={cn(portalTokens.page.cinematic, className)}>
        <CinematicBackground variant={cinematicBg} />
        <div className={cn(portalTokens.page.content, "min-h-screen", contentClassName)}>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(portalTokens.page.solid, className)}>
      <div className={cn(portalTokens.page.content, "pt-4", contentClassName)}>{children}</div>
    </div>
  );
}