import { ForceDarkMode } from "@/components/shared/ForceDarkMode";

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <ForceDarkMode>{children}</ForceDarkMode>;
}