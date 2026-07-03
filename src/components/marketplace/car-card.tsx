"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Users, Calendar, MapPin, Info } from "lucide-react";
import { Link } from "@/i18n/routing";
import { formatPrice, cn } from "@/lib/utils";
import { CAR_CATEGORY_LABELS, GOVERNORATE_LABELS } from "@/lib/constants/governorates";
import type { Car, Governorate } from "@/types";

interface CarCardProps {
  car: Car;
  className?: string;
}

export function CarCard({ car, className }: CarCardProps) {
  const locale = useLocale() as "fr" | "ar";
  const t = useTranslations("marketplace.cars");
  const imageUrl = car.thumbnailUrl || car.photos[0] || "/placeholder-car.svg";
  const categoryLabel = CAR_CATEGORY_LABELS[car.category]?.[locale] ?? car.category;
  const price = Number(car.pricePerDay);

  const transmissionLabel =
    car.transmission === "automatic" ? t("transmissionAuto") : t("transmissionManual");

  const locationLabel = [car.agency?.city, car.agency?.governorate
    ? GOVERNORATE_LABELS[car.agency.governorate as Governorate]?.[locale]
    : null].filter(Boolean).join(", ");

  const isNew = car.year >= new Date().getFullYear() - 1;

  return (
    <Link href={`/cars/${car.id}`} className="group block h-full">
      <article
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:border-primary/30 hover:shadow-md",
          className,
        )}
      >
        <div className="relative mx-3 mt-3 overflow-hidden rounded-xl bg-muted/60 p-4">
          <div className="relative mx-auto aspect-[16/10] max-h-[140px] w-full">
            <Image
              src={imageUrl}
              alt={`${car.brand} ${car.model}`}
              fill
              className="object-contain transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 25vw"
            />
          </div>
          {isNew && (
            <span className="absolute start-2 top-2 rounded-md bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
              {t("newBadge")}
            </span>
          )}
          <span className="absolute end-2 top-2 flex size-6 items-center justify-center rounded-full bg-background/80 text-muted-foreground shadow-sm">
            <Info className="size-3.5" />
          </span>
        </div>

        <div className="flex flex-1 flex-col p-4 pt-3">
          <h3 className="truncate text-sm font-bold uppercase tracking-wide text-foreground">
            {car.brand} {car.model}
          </h3>
          <p className="mt-1 truncate text-xs text-muted-foreground">
            {categoryLabel} · {transmissionLabel} · <span className="capitalize">{car.fuelType}</span>
          </p>

          <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Users className="size-3.5 text-primary/70" />
              {car.seats}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="size-3.5 text-primary/70" />
              {car.year}
            </span>
            {car.doors && (
              <span className="text-muted-foreground/80">{car.doors} {t("doors")}</span>
            )}
          </div>

          <div className="mt-auto flex items-end justify-between gap-2 pt-4">
            {locationLabel ? (
              <span className="inline-flex min-w-0 items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="size-3 shrink-0" />
                <span className="truncate">{locationLabel}</span>
              </span>
            ) : (
              <span />
            )}
            <div className="text-end">
              <p className="text-lg font-bold text-foreground underline decoration-primary/40 decoration-2 underline-offset-4">
                {formatPrice(price)}
              </p>
              <p className="text-[10px] text-muted-foreground">{t("perDayShort")}</p>
            </div>
          </div>
        </div>
      </article>
    </Link>
  );
}
