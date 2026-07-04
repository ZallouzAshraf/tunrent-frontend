"use client";

import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isBefore,
  isSameDay,
  isWithinInterval,
  parseISO,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { fr, ar } from "date-fns/locale";
import { marketplaceApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface CarAvailabilityCalendarProps {
  carId: string;
  className?: string;
}

export function CarAvailabilityCalendar({
  carId,
  className,
}: CarAvailabilityCalendarProps) {
  const locale = useLocale() as "fr" | "ar";
  const today = startOfDay(new Date());
  const rangeEnd = addMonths(today, 2);

  const { data, isLoading } = useQuery({
    queryKey: ["car-availability", carId],
    queryFn: async () => {
      const res = await marketplaceApi.getCarAvailability(carId, {
        from: format(today, "yyyy-MM-dd"),
        to: format(rangeEnd, "yyyy-MM-dd"),
      });
      return res.data;
    },
  });

  const unavailableDates = useMemo(() => {
    if (!data?.unavailableRanges) return new Set<string>();

    const dates = new Set<string>();
    for (const range of data.unavailableRanges) {
      const days = eachDayOfInterval({
        start: parseISO(range.start),
        end: parseISO(range.end),
      });
      days.forEach((d) => dates.add(format(d, "yyyy-MM-dd")));
    }
    return dates;
  }, [data]);

  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(addMonths(today, 1));
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  if (isLoading) {
    return <Skeleton className="h-48 w-full rounded-xl" />;
  }

  const title = locale === "ar" ? "التوفر" : "Disponibilité";
  const legendBooked = locale === "ar" ? "محجوز" : "Indisponible";
  const legendFree = locale === "ar" ? "متاح" : "Disponible";

  return (
    <div className={cn("rounded-xl border bg-card p-4", className)}>
      <h3 className="font-semibold">{title}</h3>
      <div className="mt-4 grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((day) => {
          const key = format(day, "yyyy-MM-dd");
          const isPast = isBefore(day, today) && !isSameDay(day, today);
          const unavailable = unavailableDates.has(key);
          const inCurrentMonth = isWithinInterval(day, {
            start: monthStart,
            end: endOfMonth(today),
          });

          return (
            <div
              key={key}
              className={cn(
                "flex aspect-square items-center justify-center rounded-md text-[11px]",
                !inCurrentMonth && "opacity-30",
                isPast && "text-muted-foreground/50",
                unavailable && !isPast && "bg-destructive/15 font-medium text-destructive",
                !unavailable && !isPast && "bg-emerald-50 text-emerald-700",
              )}
              title={format(day, "d MMM yyyy", {
                locale: locale === "ar" ? ar : fr,
              })}
            >
              {format(day, "d")}
            </div>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-2">
          <span className="size-3 rounded bg-emerald-50 ring-1 ring-emerald-200" />
          {legendFree}
        </span>
        <span className="inline-flex items-center gap-2">
          <span className="size-3 rounded bg-destructive/15 ring-1 ring-destructive/30" />
          {legendBooked}
        </span>
      </div>
    </div>
  );
}
