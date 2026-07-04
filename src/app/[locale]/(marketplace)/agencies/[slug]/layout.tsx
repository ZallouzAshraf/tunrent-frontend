import type { Metadata } from "next";
import type { ReactNode } from "react";
import { serverFetch } from "@/lib/api/server";
import { JsonLd } from "@/components/seo/json-ld";
import type { Agency, Car } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

type AgencyDetail = { agency: Agency; cars: Car[] };

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  const data = await serverFetch<AgencyDetail>(
    `/marketplace/agencies/${slug}`,
    { next: { revalidate: 3600 } },
  );

  if (!data?.agency) {
    return { title: "Agence — TunRent" };
  }

  const { agency } = data;
  const title = `${agency.name} — Location de voitures — TunRent`;
  const description =
    agency.description?.slice(0, 160) ||
    `Découvrez les voitures de ${agency.name} sur TunRent.`;

  const path =
    locale === "ar" ? `/ar/agencies/${slug}` : `/agencies/${slug}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${path}`,
      type: "website",
      ...(agency.logoUrl
        ? { images: [{ url: agency.logoUrl, alt: agency.name }] }
        : {}),
    },
    alternates: {
      canonical: `${BASE_URL}${path}`,
      languages: {
        fr: `${BASE_URL}/agencies/${slug}`,
        ar: `${BASE_URL}/ar/agencies/${slug}`,
      },
    },
  };
}

export default async function AgencyDetailLayout({
  children,
  params,
}: LayoutProps) {
  const { locale, slug } = await params;
  const data = await serverFetch<AgencyDetail>(
    `/marketplace/agencies/${slug}`,
    { next: { revalidate: 3600 } },
  );

  if (!data?.agency) {
    return children;
  }

  const { agency } = data;
  const path =
    locale === "ar" ? `/ar/agencies/${slug}` : `/agencies/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AutoRental",
    name: agency.name,
    description: agency.description || `Agence de location ${agency.name}`,
    url: `${BASE_URL}${path}`,
    image: agency.logoUrl || agency.coverUrl,
    telephone: agency.phone,
    address: agency.address
      ? {
          "@type": "PostalAddress",
          streetAddress: agency.address,
          addressLocality: agency.city,
          addressRegion: agency.governorate,
          addressCountry: "TN",
        }
      : undefined,
    ...(agency.avgRating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: agency.avgRating,
            reviewCount: agency.totalReviews ?? 0,
          },
        }
      : {}),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
