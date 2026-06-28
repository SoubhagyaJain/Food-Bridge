"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

type LogoutButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  label?: string;
  pendingLabel?: string;
};

export function LogoutButton({
  label = "Logout",
  pendingLabel = "Signing out…",
  className,
  children,
  onClick,
  disabled,
  ...props
}: LogoutButtonProps) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  const handleLogout = async (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(event);
    if (event.defaultPrevented) return;

    setPending(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut({ scope: "global" });
      if (error) throw error;

      router.push("/login");
      router.refresh();
    } catch {
      setPending(false);
    }
  };

  return (
    <button
      type="button"
      disabled={disabled || pending}
      className={cn(className)}
      onClick={handleLogout}
      {...props}
    >
      {pending ? pendingLabel : (children ?? label)}
    </button>
  );
}