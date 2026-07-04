import type { Metadata } from "next";
import type { ReactNode } from "react";
import { serverFetch } from "@/lib/api/server";
import { JsonLd } from "@/components/seo/json-ld";
import type { Car } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3001";

type LayoutProps = {
  children: ReactNode;
  params: Promise<{ locale: string; id: string }>;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}): Promise<Metadata> {
  const { locale, id } = await params;
  const car = await serverFetch<Car>(`/marketplace/cars/${id}`, {
    next: { revalidate: 3600 },
  });

  if (!car) {
    return { title: "Voiture — TunRent" };
  }

  const title = `${car.brand} ${car.model} ${car.year} — TunRent`;
  const description =
    car.description?.slice(0, 160) ||
    `Louez ${car.brand} ${car.model} à partir de ${car.pricePerDay} TND/jour sur TunRent.`;

  const path = locale === "ar" ? `/ar/cars/${id}` : `/cars/${id}`;
  const image = car.thumbnailUrl || car.photos?.[0];

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}${path}`,
      type: "website",
      ...(image ? { images: [{ url: image, alt: title }] } : {}),
    },
    alternates: {
      canonical: `${BASE_URL}${path}`,
      languages: {
        fr: `${BASE_URL}/cars/${id}`,
        ar: `${BASE_URL}/ar/cars/${id}`,
      },
    },
  };
}

export default async function CarDetailLayout({ children, params }: LayoutProps) {
  const { locale, id } = await params;
  const car = await serverFetch<Car>(`/marketplace/cars/${id}`, {
    next: { revalidate: 3600 },
  });

  if (!car) {
    return children;
  }

  const path = locale === "ar" ? `/ar/cars/${id}` : `/cars/${id}`;
  const image = car.thumbnailUrl || car.photos?.[0];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${car.brand} ${car.model} ${car.year}`,
    description: car.description || `${car.brand} ${car.model} en location`,
    image: image ? [image] : undefined,
    offers: {
      "@type": "Offer",
      price: car.pricePerDay,
      priceCurrency: "TND",
      availability: "https://schema.org/InStock",
      url: `${BASE_URL}${path}`,
    },
    brand: {
      "@type": "Brand",
      name: car.brand,
    },
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      {children}
    </>
  );
}
