import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          muted: "var(--card-muted)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          soft: "var(--muted-soft)",
        },
        border: {
          DEFAULT: "var(--border)",
          soft: "var(--border-soft)",
        },
        accent: {
          hover: "var(--accent-hover)",
        },
        brand: {
          dark: "#3c2f2f",
          panel: "#2a211c",
          gold: "#c5a26f",
          "gold-hover": "#b08d55",
          cream: "#f5f0e8",
          coral: "#D97757",
          "coral-hover": "#C45E3E",
          sage: "#4a9c6e",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-karla)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;