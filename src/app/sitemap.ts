import type { MetadataRoute } from "next";
import { serverFetch } from "@/lib/api/server";
import type { Agency, Car, PaginatedResult } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

const staticRoutes = [
  "",
  "/cars",
  "/agencies",
  "/comment-ca-marche",
  "/devenir-partenaire",
  "/a-propos",
  "/contact",
  "/conditions",
  "/confidentialite",
  "/cookies",
  "/login",
  "/register",
  "/booking/track",
];

async function fetchAllPages<T>(
  path: string,
  maxPages = 50,
): Promise<T[]> {
  const items: T[] = [];
  let page = 1;
  let hasNext = true;

  while (hasNext && page <= maxPages) {
    const result = await serverFetch<PaginatedResult<T>>(
      `${path}${path.includes("?") ? "&" : "?"}limit=100&page=${page}`,
      { next: { revalidate: 3600 } },
    );
    if (!result?.data?.length) break;
    items.push(...result.data);
    hasNext = result.meta?.hasNextPage ?? false;
    page += 1;
  }

  return items;
}

function localizedEntries(
  path: string,
  priority: number,
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"],
  lastModified = new Date(),
): MetadataRoute.Sitemap {
  return [
    {
      url: `${BASE_URL}${path}`,
      lastModified,
      changeFrequency,
      priority,
    },
    {
      url: `${BASE_URL}/ar${path}`,
      lastModified,
      changeFrequency,
      priority,
    },
  ];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries = staticRoutes.flatMap((route) =>
    localizedEntries(
      route,
      route === "" ? 1 : 0.8,
      route === "" ? "daily" : "weekly",
      now,
    ),
  );

  const [cars, agencies] = await Promise.all([
    fetchAllPages<Car>("/marketplace/cars"),
    fetchAllPages<Agency>("/marketplace/agencies"),
  ]);

  const carEntries = cars.flatMap((car) =>
    localizedEntries(`/cars/${car.id}`, 0.7, "weekly", now),
  );

  const agencyEntries = agencies.flatMap((agency) =>
    localizedEntries(`/agencies/${agency.slug}`, 0.7, "weekly", now),
  );

  return [...staticEntries, ...carEntries, ...agencyEntries];
}
