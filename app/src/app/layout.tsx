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
  metadataBase: new URL("https://phasewise.io"),
  title: "Phasewise — Focus on the design. We'll handle everything else.",
  description:
    "Phasewise is the operating system for landscape architecture firms. Project management, budgets, time tracking, and profitability — built for how landscape architects actually work.",
  applicationName: "Phasewise",
  appleWebApp: {
    capable: true,
    title: "Phasewise",
    statusBarStyle: "black-translucent",
  },
  // Note: Most icon registration happens automatically via Next.js's
  // file-based icon convention (app/icon.tsx, app/icon-192.tsx,
  // app/icon-512.tsx, app/apple-icon.tsx). The manifest.ts also lists
  // them so PWA installers (Brave, Chrome on Android) find them. We
  // only need explicit `apple-touch-icon-precomposed` here as a fallback
  // for older iOS versions that don't honor the auto-generated link.
  icons: {
    other: [
      { rel: "apple-touch-icon-precomposed", url: "/apple-icon" },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#1A2E22",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} ${dmSerifDisplay.variable} h-full`}>
      <body className="min-h-full bg-white font-sans antialiased text-[#1A2E22] overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
