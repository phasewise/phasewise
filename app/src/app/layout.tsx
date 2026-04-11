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
  icons: {
    // Browser tab icon
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    // iOS home screen icon — points to the Next.js-generated apple-icon route.
    // We include explicit sizes so iOS picks the right one and doesn't fall
    // back to a screenshot of the page. Cache-busted via the Next.js icon
    // file convention which fingerprints the URL on each deploy.
    apple: [
      { url: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
    // Microsoft tile icon (helpful for Windows pinned sites too)
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
      <body className="min-h-full bg-white font-sans antialiased text-[#1A2E22]">
        {children}
      </body>
    </html>
  );
}
