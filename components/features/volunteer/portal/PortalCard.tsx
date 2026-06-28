import { portalTokens } from "@/lib/volunteer/portal-tokens";
import { cn } from "@/lib/utils";

type PortalCardProps = {
  variant?: keyof typeof portalTokens.card;
  className?: string;
  children: React.ReactNode;
};

export function PortalCard({ variant = "glass", className, children }: PortalCardProps) {
  return <div className={cn(portalTokens.card[variant], className)}>{children}</div>;
}