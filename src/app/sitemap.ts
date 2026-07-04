import type { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

const staticRoutes = [
  "",
  "/cars",
  "/agencies",
  "/comment-ca-marche",
  "/devenir-partenaire",
  "/a-propos",
  "/contact",
  "/cgu",
  "/cgv",
  "/confidentialite",
  "/login",
  "/register",
  "/booking/track",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return staticRoutes.flatMap((route) => [
    {
      url: `${BASE_URL}${route}`,
      lastModified: now,
      changeFrequency: route === "" ? "daily" : "weekly",
      priority: route === "" ? 1 : 0.8,
    } as MetadataRoute.Sitemap[number],
    {
      url: `${BASE_URL}/ar${route}`,
      lastModified: now,
      changeFrequency: route === "" ? "daily" : "weekly",
      priority: route === "" ? 1 : 0.8,
    } as MetadataRoute.Sitemap[number],
  ]);
}
