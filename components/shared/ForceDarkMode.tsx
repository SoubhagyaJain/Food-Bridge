"use client";

import { useTheme } from "next-themes";
import { useLayoutEffect, useRef } from "react";

type ForceDarkModeProps = {
  children: React.ReactNode;
};

/** Locks the app to dark theme while mounted; restores the prior theme on leave. */
export function ForceDarkMode({ children }: ForceDarkModeProps) {
  const { setTheme, theme, resolvedTheme } = useTheme();
  const savedTheme = useRef<string | null>(null);

  useLayoutEffect(() => {
    savedTheme.current = theme ?? resolvedTheme ?? "light";
    setTheme("dark");

    return () => {
      setTheme(savedTheme.current ?? "light");
    };
    // Lock once per blog visit; restore only on unmount.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <>{children}</>;
}