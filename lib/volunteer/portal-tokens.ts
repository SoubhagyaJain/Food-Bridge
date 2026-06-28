export const portalTokens = {
  card: {
    glass:
      "rounded-2xl border border-white/40 bg-card/90 shadow-md backdrop-blur-md dark:border-white/10 dark:bg-card/85",
    solid: "rounded-2xl border border-border bg-card shadow-sm",
    sage:
      "rounded-2xl border border-[#b8d4be] bg-[#EAF1EB]/95 shadow-md backdrop-blur-md dark:border-[#4a7c5c]/50 dark:bg-[#1a2e22]/92",
  },
  page: {
    solid: "min-h-screen bg-[#F9F7F3] dark:bg-background",
    cinematic: "relative min-h-screen w-full",
    content: "relative z-10 mx-auto max-w-6xl px-4 pb-12 md:px-8",
  },
  textOnPhoto: {
    heading:
      "text-foreground drop-shadow-sm dark:text-white dark:drop-shadow-md",
    body: "text-on-surface-variant drop-shadow-sm dark:text-white/95 dark:drop-shadow-md",
  },
} as const;