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
      // 192x192 standard PWA icon (PNG from icon1.tsx)
      {
        src: "/icon1",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      // 512x512 high-DPI / splash screen icon (PNG from icon2.tsx)
      {
        src: "/icon2",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      // Maskable variant with safe-zone padding (PNG from icon3.tsx)
      {
        src: "/icon3",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
