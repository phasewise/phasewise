import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Phasewise",
    short_name: "Phasewise",
    description:
      "Project management built for landscape architects. Track every phase, budget, and hour — the way your firm actually works.",
    start_url: "/",
    display: "standalone",
    background_color: "#F7F9F7",
    theme_color: "#1A2E22",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  };
}
