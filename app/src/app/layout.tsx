import type { Metadata, Viewport } from "next";
import { Outfit, DM_Serif_Display } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const dmSerifDisplay = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Phasewise — Focus on the design. We'll handle everything else.",
  description:
    "Phasewise is the operating system for landscape architecture firms. Project management, budgets, time tracking, and profitability — built for how landscape architects actually work.",
  applicationName: "Phasewise",
  appleWebApp: {
    capable: true,
    title: "Phasewise",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#1A2E22",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSerifDisplay.variable} h-full`}>
      <body className="min-h-full bg-white font-sans antialiased text-[#1A2E22]">
        {children}
      </body>
    </html>
  );
}
