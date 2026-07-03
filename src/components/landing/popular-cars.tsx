"use client";

import { useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import { ChevronLeft, ChevronRight, Car, Users, Wind, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { marketplaceApi } from "@/lib/api";
import { CAR_CATEGORY_LABELS } from "@/lib/constants/governorates";
import { formatPrice, cn } from "@/lib/utils";
import { StarRating } from "@/components/shared/star-rating";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Car as CarType } from "@/types";

function CarCard({ car, locale }: { car: CarType; locale: "fr" | "ar" }) {
  const tCommon = useTranslations("common");
  const imageUrl = car.thumbnailUrl || car.photos?.[0];
  const categoryLabel =
    CAR_CATEGORY_LABELS[car.category]?.[locale] ?? car.category;

  return (
    <Link
      href={`/cars/${car.id}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={`${car.brand} ${car.model}`}
            className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-secondary">
            <Car className="size-12 text-primary/40" />
          </div>
        )}
        <Badge className="absolute start-3 top-3" variant="secondary">
          {categoryLabel}
        </Badge>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold text-foreground group-hover:text-primary">
          {car.brand} {car.model}
        </h3>
        <p className="text-sm text-muted-foreground">{car.year}</p>

        <div className="mt-2 flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Users className="size-3.5" />
            {car.seats}
          </span>
          {car.hasAc && (
            <span className="flex items-center gap-1">
              <Wind className="size-3.5" />
              AC
            </span>
          )}
        </div>

        {car.agency && (
          <div className="mt-2">
            <StarRating
              rating={car.agency.avgRating ?? 4.5}
              size="sm"
              showValue
            />
          </div>
        )}

        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <span className="text-xs text-muted-foreground">
              {tCommon("from")}
            </span>
            <p className="text-lg font-bold text-primary">
              {formatPrice(car.pricePerDay)}
              <span className="text-sm font-normal text-muted-foreground">
                {tCommon("perDay")}
              </span>
            </p>
          </div>
          <span className="text-sm font-medium text-accent opacity-0 transition-opacity group-hover:opacity-100">
            {tCommon("viewDetails")} →
          </span>
        </div>
      </div>
    </Link>
  );
}

function CarCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Skeleton className="aspect-[16/10] w-full" />
      <div className="space-y-2 p-4">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="mt-4 h-6 w-1/3" />
      </div>
    </div>
  );
}

export function PopularCars() {
  const t = useTranslations("landing.popularCars");
  const locale = useLocale() as "fr" | "ar";
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    direction: locale === "ar" ? "rtl" : "ltr",
  });

  const { data, isLoading, isError } = useQuery({
    queryKey: ["popular-cars"],
    queryFn: async () => {
      const res = await marketplaceApi.getCars({
        sort: "rating_desc",
        limit: 10,
        page: 1,
      });
      return res.data;
    },
  });

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  const cars = data?.data ?? [];

  return (
    <section className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
          </div>
          <div className="hidden gap-2 sm:flex">
            <Button variant="outline" asChild>
              <Link href="/cars" className="gap-2">
                {t("viewAll")}
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollPrev}
              aria-label={t("prev")}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={scrollNext}
              aria-label={t("next")}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <div className="mt-8">
          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <CarCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!isLoading && (isError || cars.length === 0) && (
            <EmptyState icon={Car} title={t("empty")} />
          )}

          {!isLoading && cars.length > 0 && (
            <div className="overflow-hidden" ref={emblaRef}>
              <div className="flex gap-4">
                {cars.map((car) => (
                  <div
                    key={car.id}
                    className={cn(
                      "min-w-0 shrink-0 grow-0 basis-full sm:basis-[calc(50%-0.5rem)] lg:basis-[calc(25%-0.75rem)]",
                    )}
                  >
                    <CarCard car={car} locale={locale} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="mt-8 flex justify-center sm:hidden">
          <Button variant="outline" asChild>
            <Link href="/cars" className="gap-2">
              {t("viewAll")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
