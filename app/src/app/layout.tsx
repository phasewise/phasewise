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

const SITE_URL = "https://phasewise.io";
const SITE_TITLE = "Phasewise — Project management built for landscape architects";
const SITE_DESCRIPTION =
  "Phasewise is the operating system for landscape architecture firms. Project management, budgets, time tracking, submittals, MWELO, and profitability — built for how landscape architects actually work.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_TITLE,
    template: "%s — Phasewise",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Phasewise",
  keywords: [
    "landscape architecture software",
    "landscape architecture project management",
    "landscape architect billing software",
    "landscape architect time tracking",
    "MWELO water budget calculator",
    "landscape design firm software",
    "phases of landscape architecture",
    "submittal log software",
    "plant schedule software",
  ],
  authors: [{ name: "Phasewise" }],
  creator: "Phasewise",
  publisher: "Phasewise",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Phasewise",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@phasewise",
    creator: "@phasewise",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
