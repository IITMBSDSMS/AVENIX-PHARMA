import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/delivery", "/diagnostics", "/doctors", "/prescription-ai", "/assistant", "/emergency", "/verify", "/offers", "/about", "/careers", "/privacy", "/terms"],
        disallow: ["/dashboard/", "/api/"],
      },
    ],
    sitemap: "https://www.avenixpharma.in/sitemap.xml",
    host: "https://www.avenixpharma.in",
  };
}
