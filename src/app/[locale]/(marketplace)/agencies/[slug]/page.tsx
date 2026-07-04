"use client";

import { use } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { MapPin, Phone, Mail } from "lucide-react";
import { Link } from "@/i18n/routing";
import { marketplaceApi } from "@/lib/api";
import { CarCard } from "@/components/marketplace/car-card";
import { PublicReviewsSection } from "@/components/marketplace/public-reviews-section";
import { StarRating } from "@/components/shared/star-rating";
import { LocationMap } from "@/components/shared/location-map";
import type { MapMarker } from "@/components/shared/location-map";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { GOVERNORATE_LABELS } from "@/lib/constants/governorates";
import type { Governorate } from "@/types";

interface AgencyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function AgencyDetailPage({ params }: AgencyDetailPageProps) {
  const { slug } = use(params);
  const t = useTranslations("marketplace");
  const locale = useLocale() as "fr" | "ar";

  const { data, isLoading } = useQuery({
    queryKey: ["marketplace-agency", slug],
    queryFn: async () => {
      const res = await marketplaceApi.getAgency(slug);
      return res.data;
    },
  });

  if (isLoading || !data) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <Skeleton className="mb-6 h-48 rounded-xl" />
        <Skeleton className="h-8 w-64" />
      </div>
    );
  }

  const { agency, cars } = data;
  const governorateLabel = agency.governorate
    ? GOVERNORATE_LABELS[agency.governorate as Governorate]?.[locale]
    : null;

  const mapMarkers: MapMarker[] = [];
  if (agency.latitude != null && agency.longitude != null) {
    mapMarkers.push({
      id: agency.id,
      latitude: Number(agency.latitude),
      longitude: Number(agency.longitude),
      label: agency.name,
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Button variant="ghost" size="sm" asChild className="mb-4">
        <Link href="/agencies">← {locale === "ar" ? "الوكالات" : "Agences"}</Link>
      </Button>

      <div className="overflow-hidden rounded-xl border bg-card">
        <div className="relative h-40 bg-gradient-to-r from-primary/20 to-accent/20 sm:h-56">
          {agency.coverUrl && (
            <Image src={agency.coverUrl} alt="" fill className="object-cover" />
          )}
        </div>
        <div className="relative px-6 pb-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
            {agency.logoUrl && (
              <div className="relative -mt-10 h-20 w-20 shrink-0 overflow-hidden rounded-xl border-4 border-background bg-background shadow-md">
                <Image src={agency.logoUrl} alt={agency.name} fill className="object-cover" />
              </div>
            )}
            <div className="flex-1 pt-2 sm:pt-0">
              <h1 className="text-2xl font-bold">{agency.name}</h1>
              <StarRating
                className="mt-2"
                rating={agency.avgRating ?? 0}
                showValue
                reviewCount={agency.totalReviews}
              />
            </div>
          </div>

          {agency.description && (
            <p className="mt-6 text-muted-foreground">{agency.description}</p>
          )}

          <div className="mt-6 flex flex-wrap gap-4 text-sm">
            {(agency.city || governorateLabel) && (
              <span className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4 text-primary" />
                {[agency.address, agency.city, governorateLabel].filter(Boolean).join(", ")}
              </span>
            )}
            {agency.phone && (
              <a href={`tel:${agency.phone}`} className="flex items-center gap-2 hover:text-primary">
                <Phone className="h-4 w-4" />
                {agency.phone}
              </a>
            )}
            {agency.email && (
              <a href={`mailto:${agency.email}`} className="flex items-center gap-2 hover:text-primary">
                <Mail className="h-4 w-4" />
                {agency.email}
              </a>
            )}
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="mb-6 text-xl font-semibold">
          {t("agencyCars")} ({cars.length})
        </h2>
        {cars.length === 0 ? (
          <p className="text-muted-foreground">
            {locale === "ar" ? "لا توجد سيارات متاحة حالياً." : "Aucune voiture disponible actuellement."}
          </p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cars.map((car) => (
              <CarCard key={car.id} car={car} />
            ))}
          </div>
        )}
      </section>

      {mapMarkers.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">
            {locale === "ar" ? "الموقع" : "Localisation"}
          </h2>
          <LocationMap markers={mapMarkers} className="h-72 w-full rounded-xl border" />
        </section>
      )}

      <PublicReviewsSection agencyId={agency.id} />
    </div>
  );
}
