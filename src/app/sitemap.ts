import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const BASE_URL = "https://www.avenixpharma.in";

  const routes = [
    { url: "/", priority: 1.0, changeFrequency: "daily" },
    { url: "/delivery", priority: 0.9, changeFrequency: "daily" },
    { url: "/offers", priority: 0.85, changeFrequency: "daily" },
    { url: "/diagnostics", priority: 0.9, changeFrequency: "weekly" },
    { url: "/doctors", priority: 0.8, changeFrequency: "weekly" },
    { url: "/prescription-ai", priority: 0.8, changeFrequency: "monthly" },
    { url: "/assistant", priority: 0.7, changeFrequency: "monthly" },
    { url: "/emergency", priority: 0.7, changeFrequency: "monthly" },
    { url: "/verify", priority: 0.6, changeFrequency: "monthly" },
    { url: "/about", priority: 0.6, changeFrequency: "monthly" },
    { url: "/careers", priority: 0.6, changeFrequency: "monthly" },
    { url: "/privacy", priority: 0.5, changeFrequency: "monthly" },
    { url: "/terms", priority: 0.5, changeFrequency: "monthly" },
    { url: "/login", priority: 0.4, changeFrequency: "yearly" },
  ] as const;

  return routes.map(({ url, priority, changeFrequency }) => ({
    url: `${BASE_URL}${url}`,
    lastModified: new Date(),
    changeFrequency,
    priority,
  }));
}
