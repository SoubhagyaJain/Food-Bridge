import { PageTransition } from "@/components/shared/PageTransition";
import { RouteLoader } from "@/components/shared/RouteLoader";

export function SubtlePageTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition variant="subtle">{children}</PageTransition>;
}

export function DashboardPageTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition variant="dashboard">{children}</PageTransition>;
}

export function MarketingRouteLoading() {
  return <RouteLoader variant="marketing" />;
}

export function DashboardRouteLoading() {
  return <RouteLoader variant="dashboard" />;
}

export function AuthRouteLoading() {
  return <RouteLoader variant="auth" label="Signing in" />;
}

export function DonorRouteLoading() {
  return <RouteLoader variant="compact" label="Loading donor portal" />;
}

export function NgoRouteLoading() {
  return <RouteLoader variant="compact" label="Loading NGO portal" />;
}