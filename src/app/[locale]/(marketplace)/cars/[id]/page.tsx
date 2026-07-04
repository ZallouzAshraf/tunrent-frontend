"use client";

import { Suspense, use, useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
  Snowflake,
  Navigation,
  Bluetooth,
  Baby,
  Users,
  Fuel,
  Settings2,
  Shield,
  ChevronLeft,
  ChevronRight,
  MapPin,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { marketplaceApi } from "@/lib/api";
import { StarRating } from "@/components/shared/star-rating";
import { BookingWidget } from "@/components/marketplace/booking-widget";
import { CarAvailabilityCalendar } from "@/components/marketplace/car-availability-calendar";
import { PublicReviewsSection } from "@/components/marketplace/public-reviews-section";
import { LocationMap } from "@/components/shared/location-map";
import type { MapMarker } from "@/components/shared/location-map";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatPrice, cn } from "@/lib/utils";
import { CAR_CATEGORY_LABELS } from "@/lib/constants/governorates";

interface CarDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function CarDetailPage({ params }: CarDetailPageProps) {
  return (
    <Suspense fallback={<Skeleton className="mx-auto mt-8 h-96 max-w-7xl rounded-xl" />}>
      <CarDetailContent params={params} />
    </Suspense>
  );
}

function CarDetailContent({ params }: CarDetailPageProps) {
  const { id: carId } = use(params);
  const [activePhoto, setActivePhoto] = useState(0);
  const t = useTranslations("marketplace");
  const locale = useLocale() as "fr" | "ar";
  const searchParams = useSearchParams();

  const { data: car, isLoading, isError } = useQuery({
    queryKey: ["marketplace-car", carId],
    queryFn: async () => {
      const res = await marketplaceApi.getCar(carId);
      return res.data;
    },
    retry: (failureCount, error) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 404) return false;
      return failureCount < 2;
    },
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Skeleton className="mb-6 h-8 w-64" />
        <div className="grid gap-8 lg:grid-cols-3">
          <Skeleton className="h-96 lg:col-span-2 rounded-xl" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !car) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold">
          {locale === "ar" ? "السيارة غير موجودة" : "Voiture introuvable"}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {locale === "ar"
            ? "قد تكون هذه السيارة غير متاحة أو تمت إزالتها."
            : "Ce véhicule n'est plus disponible ou n'existe pas."}
        </p>
        <Button className="mt-6" asChild>
          <Link href="/cars">
            {locale === "ar" ? "العودة إلى القائمة" : "Retour aux voitures"}
          </Link>
        </Button>
      </div>
    );
  }

  const photos = car.photos.length > 0 ? car.photos : [car.thumbnailUrl || "/placeholder-car.svg"];
  const categoryLabel = CAR_CATEGORY_LABELS[car.category]?.[locale] ?? car.category;

  const specs = [
    { icon: Users, label: locale === "ar" ? "المقاعد" : "Places", value: car.seats },
    { icon: Settings2, label: locale === "ar" ? "ناقل الحركة" : "Transmission", value: car.transmission },
    { icon: Fuel, label: locale === "ar" ? "الوقود" : "Carburant", value: car.fuelType },
    { icon: Shield, label: locale === "ar" ? "التأمين" : "Assurance", value: car.hasInsurance ? "Oui" : "Non" },
  ];

  const equipment = [
    car.hasAc && { icon: Snowflake, label: "Climatisation" },
    car.hasGps && { icon: Navigation, label: "GPS" },
    car.hasBluetooth && { icon: Bluetooth, label: "Bluetooth" },
    car.hasChildSeat && { icon: Baby, label: "Siège enfant" },
  ].filter(Boolean) as { icon: typeof Snowflake; label: string }[];

  const defaultStart = searchParams.get("start_date") ?? searchParams.get("start") ?? undefined;
  const defaultEnd = searchParams.get("end_date") ?? searchParams.get("end") ?? undefined;

  const mapMarkers: MapMarker[] = [];
  if (car.pickupLocations?.length) {
    car.pickupLocations.forEach((loc, index) => {
      const latitude = loc.latitude ?? loc.lat;
      const longitude = loc.longitude ?? loc.lng;
      if (latitude != null && longitude != null) {
        mapMarkers.push({
          id: `pickup-${index}`,
          latitude: Number(latitude),
          longitude: Number(longitude),
          label: loc.name ?? loc.address ?? loc.city ?? "",
        });
      }
    });
  } else if (car.agency?.latitude != null && car.agency?.longitude != null) {
    mapMarkers.push({
      id: "agency",
      latitude: Number(car.agency.latitude),
      longitude: Number(car.agency.longitude),
      label: car.agency.name,
    });
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 pb-28 sm:px-6 lg:px-8 lg:pb-8">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/cars">← {locale === "ar" ? "العودة" : "Retour aux voitures"}</Link>
        </Button>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <Badge className="mb-2">{categoryLabel}</Badge>
            <h1 className="text-2xl font-bold sm:text-3xl">
              {car.brand} {car.model} ({car.year})
            </h1>
            {car.agency && (
              <div className="mt-2 flex items-center gap-2">
                <StarRating
                  rating={car.agency.avgRating ?? 0}
                  showValue
                  reviewCount={car.agency.totalReviews}
                />
              </div>
            )}
          </div>
          <p className="text-2xl font-bold text-primary">
            {formatPrice(Number(car.pricePerDay))}
            <span className="text-sm font-normal text-muted-foreground">
              {locale === "ar" ? "/يوم" : "/jour"}
            </span>
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-2">
          <div className="overflow-hidden rounded-xl border bg-card">
            <div className="relative bg-muted/60 p-6 sm:p-8">
              <div className="relative mx-auto aspect-[16/10] max-h-[380px] w-full">
                <Image
                  src={photos[activePhoto]}
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-contain"
                  priority
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
              {photos.length > 1 && (
                <>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute left-3 top-1/2 -translate-y-1/2"
                    onClick={() => setActivePhoto((p) => (p === 0 ? photos.length - 1 : p - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setActivePhoto((p) => (p === photos.length - 1 ? 0 : p + 1))}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
            {photos.length > 1 && (
              <div className="flex gap-2 overflow-x-auto p-3">
                {photos.map((photo, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePhoto(i)}
                    className={cn(
                      "relative h-16 w-24 shrink-0 overflow-hidden rounded-md border-2",
                      activePhoto === i ? "border-primary" : "border-transparent",
                    )}
                  >
                    <Image src={photo} alt="" fill className="object-cover" sizes="96px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {car.description && (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Description</h2>
              <p className="text-muted-foreground">{car.description}</p>
            </section>
          )}

          <section>
            <h2 className="mb-4 text-lg font-semibold">{t("specs")}</h2>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {specs.map((spec) => (
                <Card key={spec.label}>
                  <CardContent className="flex flex-col items-center p-4 text-center">
                    <spec.icon className="mb-2 h-5 w-5 text-primary" />
                    <p className="text-xs text-muted-foreground">{spec.label}</p>
                    <p className="font-medium capitalize">{spec.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

          {equipment.length > 0 && (
            <section>
              <h2 className="mb-4 text-lg font-semibold">{t("equipment")}</h2>
              <div className="flex flex-wrap gap-3">
                {equipment.map((eq) => (
                  <span
                    key={eq.label}
                    className="inline-flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 text-sm"
                  >
                    <eq.icon className="h-4 w-4 text-primary" />
                    {eq.label}
                  </span>
                ))}
              </div>
            </section>
          )}

          {car.agency && (
            <section className="rounded-xl border bg-card p-6">
              <h2 className="mb-4 text-lg font-semibold">
                {locale === "ar" ? "الوكالة" : "Agence"}
              </h2>
              <div className="flex items-start gap-4">
                {car.agency.logoUrl && (
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-lg border">
                    <Image
                      src={car.agency.logoUrl}
                      alt={car.agency.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <Link
                    href={`/agencies/${car.agency.slug}`}
                    className="text-lg font-semibold text-primary hover:underline"
                  >
                    {car.agency.name}
                  </Link>
                  {car.agency.city && (
                    <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" />
                      {car.agency.city}
                    </p>
                  )}
                  <StarRating
                    className="mt-2"
                    rating={car.agency.avgRating ?? 0}
                    showValue
                    reviewCount={car.agency.totalReviews}
                  />
                </div>
              </div>
            </section>
          )}
        </div>

        <div className="hidden lg:col-span-1 lg:block">
          <div className="sticky top-24 space-y-6">
            <BookingWidget car={car} defaultStart={defaultStart} defaultEnd={defaultEnd} />
            <CarAvailabilityCalendar carId={carId} />
          </div>
        </div>
      </div>

      <div className="mt-10 space-y-10">
        <CarAvailabilityCalendar carId={carId} className="lg:hidden" />
        <PublicReviewsSection carId={carId} />
        {mapMarkers.length > 0 && (
          <section>
            <h2 className="mb-4 text-lg font-semibold">
              {locale === "ar" ? "موقع الاستلام" : "Lieux de prise en charge"}
            </h2>
            <LocationMap markers={mapMarkers} className="h-72 w-full rounded-xl border" />
          </section>
        )}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background p-4 lg:hidden">
        <BookingWidget car={car} defaultStart={defaultStart} defaultEnd={defaultEnd} compact />
      </div>
    </div>
  );
}
