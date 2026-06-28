import { AuthScreenShell } from "@/components/features/auth/AuthScreenShell";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthScreenShell>{children}</AuthScreenShell>;
}