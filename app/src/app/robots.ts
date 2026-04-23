import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard",
          "/projects",
          "/clients",
          "/submittals",
          "/plants",
          "/compliance",
          "/time",
          "/reports",
          "/settings",
          "/admin",
          "/tools",
          "/invite",
          "/login",
          "/signup",
          "/forgot-password",
          "/reset-password",
        ],
      },
    ],
    sitemap: "https://phasewise.io/sitemap.xml",
  };
}
