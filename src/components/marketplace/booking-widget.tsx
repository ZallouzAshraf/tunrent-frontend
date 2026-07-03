"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { useBookingStore } from "@/stores/booking-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DateRangePickerField } from "@/components/ui/date-range-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  pickupLocationDisplay,
  pickupLocationValue,
} from "@/lib/pickup-location";
import { formatPrice, daysBetween, cn } from "@/lib/utils";
import type { Car } from "@/types";

interface BookingWidgetProps {
  car: Car;
  defaultStart?: string;
  defaultEnd?: string;
  compact?: boolean;
}

export function BookingWidget({
  car,
  defaultStart,
  defaultEnd,
  compact = false,
}: BookingWidgetProps) {
  const t = useTranslations("marketplace");
  const locale = useLocale() as "fr" | "ar";
  const router = useRouter();
  const setDraft = useBookingStore((s) => s.setDraft);

  const [startDate, setStartDate] = useState(defaultStart ?? "");
  const [endDate, setEndDate] = useState(defaultEnd ?? "");
  const [pickupLocation, setPickupLocation] = useState(() =>
    car.pickupLocations[0]
      ? pickupLocationValue(car.pickupLocations[0], 0)
      : "",
  );

  const totalDays =
    startDate && endDate ? daysBetween(startDate, endDate) : 0;
  const pricePerDay = Number(car.pricePerDay);
  const totalPrice = totalDays * pricePerDay;
  const deposit = car.depositAmount ? Number(car.depositAmount) : undefined;

  const canBook =
    startDate &&
    endDate &&
    pickupLocation &&
    totalDays >= (car.minRentalDays ?? 1);

  const handleBook = () => {
    if (!canBook) return;
    const selected = car.pickupLocations.find(
      (loc, index) => pickupLocationValue(loc, index) === pickupLocation,
    );
    const locationLabel = selected
      ? pickupLocationDisplay(selected)
      : pickupLocation;
    setDraft({
      carId: car.id,
      car,
      startDate,
      endDate,
      pickupLocation: locationLabel,
      dropoffLocation: locationLabel,
      totalDays,
      totalPrice,
      depositAmount: deposit,
      guestMode: true,
    });
    router.push(`/booking/${car.id}?start=${startDate}&end=${endDate}`);
  };

  const content = (
    <>
      <div className={cn(!compact && "space-y-4")}>
        <DateRangePickerField
          label={t("availability")}
          startDate={startDate}
          endDate={endDate}
          onChange={(start, end) => {
            setStartDate(start);
            setEndDate(end);
          }}
        />

        {car.pickupLocations.length > 0 && (
          <div>
            <Label className="mb-2 block text-sm">{t("pickupLocation")}</Label>
            <Select value={pickupLocation} onValueChange={setPickupLocation}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {car.pickupLocations.map((loc, index) => (
                  <SelectItem
                    key={pickupLocationValue(loc, index)}
                    value={pickupLocationValue(loc, index)}
                  >
                    {pickupLocationDisplay(loc)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {totalDays > 0 && (
          <div className="space-y-2 rounded-lg bg-muted/50 p-4 text-sm">
            <div className="flex justify-between">
              <span>
                {formatPrice(pricePerDay)} × {totalDays}{" "}
                {locale === "ar" ? "أيام" : "jours"}
              </span>
              <span className="font-medium">{formatPrice(totalPrice)}</span>
            </div>
            {deposit !== undefined && (
              <div className="flex justify-between text-muted-foreground">
                <span>{t("deposit")}</span>
                <span>{formatPrice(deposit)}</span>
              </div>
            )}
            <div className="flex justify-between border-t pt-2 text-base font-bold">
              <span>{t("totalPrice")}</span>
              <span className="text-primary">{formatPrice(totalPrice)}</span>
            </div>
          </div>
        )}

        {car.minRentalDays && car.minRentalDays > 1 && totalDays > 0 && totalDays < car.minRentalDays && (
          <p className="text-xs text-accent">
            {locale === "ar"
              ? `الحد الأدنى ${car.minRentalDays} أيام`
              : `Minimum ${car.minRentalDays} jours`}
          </p>
        )}
      </div>

      <Button className="mt-4 w-full" size="lg" disabled={!canBook} onClick={handleBook}>
        {locale === "ar" ? "احجز الآن" : "Réserver"}
      </Button>
    </>
  );

  if (compact) {
    return (
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="font-bold text-primary">{formatPrice(pricePerDay)}</p>
          <p className="text-xs text-muted-foreground">{locale === "ar" ? "/يوم" : "/jour"}</p>
        </div>
        <Button disabled={!canBook} onClick={handleBook}>
          {locale === "ar" ? "احجز" : "Réserver"}
        </Button>
      </div>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="text-lg">
          {locale === "ar" ? "احجز هذه السيارة" : "Réserver cette voiture"}
        </CardTitle>
      </CardHeader>
      <CardContent>{content}</CardContent>
    </Card>
  );
}
