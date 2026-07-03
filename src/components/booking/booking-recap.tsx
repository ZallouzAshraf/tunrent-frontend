"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Calendar, MapPin, Car as CarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatPrice, formatDate } from "@/lib/utils";
import type { Car } from "@/types";

interface CarSummary {
  brand: string;
  model: string;
  year: number;
  thumbnailUrl?: string;
  agency?: { name: string };
}

interface BookingRecapProps {
  car?: Car | CarSummary;
  startDate: string;
  endDate: string;
  pickupLocation: string;
  dropoffLocation?: string;
  totalDays: number;
  totalPrice: number;
  depositAmount?: number;
  clientInfo?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  showClient?: boolean;
}

export function BookingRecap({
  car,
  startDate,
  endDate,
  pickupLocation,
  dropoffLocation,
  totalDays,
  totalPrice,
  depositAmount,
  clientInfo,
  showClient = false,
}: BookingRecapProps) {
  const t = useTranslations("marketplace");
  const locale = useLocale();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {locale === "ar" ? "ملخص الحجز" : "Récapitulatif"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {car && (
          <div className="flex gap-4">
            <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-muted">
              {("thumbnailUrl" in car && car.thumbnailUrl) ||
              ("photos" in car && car.photos?.[0]) ? (
                <Image
                  src={
                    ("thumbnailUrl" in car && car.thumbnailUrl) ||
                    ("photos" in car && car.photos[0]) ||
                    ""
                  }
                  alt={`${car.brand} ${car.model}`}
                  fill
                  className="object-cover"
                />
              ) : null}
            </div>
            <div>
              <p className="flex items-center gap-2 font-semibold">
                <CarIcon className="h-4 w-4 text-primary" />
                {car.brand} {car.model} ({car.year})
              </p>
              {car.agency && (
                <p className="text-sm text-muted-foreground">{car.agency.name}</p>
              )}
            </div>
          </div>
        )}

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex items-start gap-2">
            <Calendar className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p>{formatDate(startDate, locale)} → {formatDate(endDate, locale)}</p>
              <p className="text-muted-foreground">
                {totalDays} {locale === "ar" ? "أيام" : "jours"}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p>{pickupLocation}</p>
              {dropoffLocation && dropoffLocation !== pickupLocation && (
                <p className="text-muted-foreground">→ {dropoffLocation}</p>
              )}
            </div>
          </div>
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>{t("totalPrice")}</span>
            <span className="font-bold text-primary">{formatPrice(totalPrice)}</span>
          </div>
          {depositAmount !== undefined && (
            <div className="flex justify-between text-muted-foreground">
              <span>{t("deposit")}</span>
              <span>{formatPrice(depositAmount)}</span>
            </div>
          )}
        </div>

        {showClient && clientInfo && (
          <>
            <Separator />
            <div className="text-sm">
              <p className="font-medium">
                {clientInfo.firstName} {clientInfo.lastName}
              </p>
              <p className="text-muted-foreground">{clientInfo.email}</p>
              <p className="text-muted-foreground">{clientInfo.phone}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
