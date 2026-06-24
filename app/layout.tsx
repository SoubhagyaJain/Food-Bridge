import type { Metadata } from "next";
import { Karla, Playfair_Display } from "next/font/google";
import { ThemeProvider } from "@/components/shared/ThemeProvider";
import "./globals.css";

const karla = Karla({
  subsets: ["latin"],
  variable: "--font-karla",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: "foodbridge — Hope Starts With You",
  description: "Bridging the gap between surplus food and those who need it most.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${karla.variable} ${playfair.variable} font-sans`}>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}