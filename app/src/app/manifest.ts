import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Phasewise",
    short_name: "Phasewise",
    description:
      "Project management built for landscape architects. Track every phase, budget, and hour — the way your firm actually works.",
    start_url: "/",
    display: "standalone",
    background_color: "#1A2E22",
    theme_color: "#1A2E22",
    icons: [
      // 32x32 browser tab favicon (Next.js auto-generated from icon.tsx)
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      // 192x192 standard PWA icon — static SVG in /public for maximum
      // browser compatibility (Brave/Chrome on Android, iOS Safari)
      {
        src: "/icon-192.svg",
        sizes: "192x192",
        type: "image/svg+xml",
        purpose: "any",
      },
      // 512x512 high-DPI / splash screen icon
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "any",
      },
      // Maskable variant
      {
        src: "/icon-512.svg",
        sizes: "512x512",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
