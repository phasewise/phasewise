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
      // 32x32 browser tab favicon (PNG from icon.tsx)
      {
        src: "/icon",
        sizes: "32x32",
        type: "image/png",
      },
      // 192x192 standard PWA icon (PNG from icon-192.tsx)
      {
        src: "/icon-192",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      // 512x512 high-DPI / splash screen icon (PNG from icon-512.tsx)
      {
        src: "/icon-512",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // Maskable variant with safe-zone padding (PNG from icon-maskable.tsx)
      {
        src: "/icon-maskable",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
