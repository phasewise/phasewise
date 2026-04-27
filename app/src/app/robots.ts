import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/blog", "/blog/"],
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
    sitemap: `${(process.env.NEXT_PUBLIC_APP_URL ?? "https://phasewise.io").replace(/\/$/, "")}/sitemap.xml`,
  };
}
