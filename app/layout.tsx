import type { Metadata } from "next";
import { Caveat, Inter, Montserrat, Playfair_Display } from "next/font/google";
import { NavigationShell } from "@/components/shared/NavigationShell";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
});

const caveat = Caveat({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-caveat",
});

export const metadata: Metadata = {
  title: "FoodBridge — Turn Surplus Food Into Real Impact",
  description:
    "FoodBridge connects donors, volunteers, and NGOs — moving good food from kitchens to communities who need it, fast.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${inter.variable} ${montserrat.variable} ${playfair.variable} ${caveat.variable} font-sans antialiased`}
      >
        <ThemeProvider>
          <NavigationShell />
          <div className="relative z-10">{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
}