import { portalTokens } from "@/lib/volunteer/portal-tokens";
import { cn } from "@/lib/utils";

type VolunteerPageHeaderProps = {
  title: string;
  description?: string;
  onPhoto?: boolean;
  actions?: React.ReactNode;
  className?: string;
};

export function VolunteerPageHeader({
  title,
  description,
  onPhoto = false,
  actions,
  className,
}: VolunteerPageHeaderProps) {
  return (
    <div
      className={cn(
        "mb-8 flex flex-col justify-between gap-4 pt-4 md:flex-row md:items-center md:pt-6",
        className
      )}
    >
      <div>
        <h1
          className={cn(
            "mb-2 text-2xl font-bold tracking-tight sm:text-3xl",
            onPhoto ? portalTokens.textOnPhoto.heading : "text-foreground"
          )}
        >
          {title}
        </h1>
        {description && (
          <p
            className={cn(
              "font-sans text-body-md font-semibold",
              onPhoto ? portalTokens.textOnPhoto.body : "text-on-surface-variant dark:text-white"
            )}
          >
            {description}
          </p>
        )}
      </div>
      {actions}
    </div>
  );
}