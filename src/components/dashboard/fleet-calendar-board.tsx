"use client";

import { useQuery } from "@tanstack/react-query";
import {
  addDays,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import {
  CalendarDays,
  Car,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import {
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardPanel,
} from "@/components/dashboard/dashboard-ui";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Booking, Car as CarType } from "@/types";
import { BookingStatus } from "@/types";

const STATUS_CONFIG: Record<
  BookingStatus,
  { cell: string; dot: string; label: string }
> = {
  [BookingStatus.PENDING]: {
    cell: "bg-amber-400/90 text-amber-950",
    dot: "bg-amber-500",
    label: "En attente",
  },
  [BookingStatus.CONFIRMED]: {
    cell: "bg-emerald-500/90 text-white",
    dot: "bg-emerald-500",
    label: "Confirmée",
  },
  [BookingStatus.IN_PROGRESS]: {
    cell: "bg-primary/90 text-primary-foreground",
    dot: "bg-primary",
    label: "En cours",
  },
  [BookingStatus.COMPLETED]: {
    cell: "bg-slate-400/90 text-white",
    dot: "bg-slate-400",
    label: "Terminée",
  },
  [BookingStatus.REJECTED]: {
    cell: "bg-red-300/90 text-red-950",
    dot: "bg-red-500",
    label: "Rejetée",
  },
  [BookingStatus.CANCELLED]: {
    cell: "bg-slate-300/90 text-slate-800",
    dot: "bg-slate-400",
    label: "Annulée",
  },
};

function normalizeDay(date: Date | string) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getBookingForCell(
  bookings: Booking[],
  carId: string,
  day: Date,
): Booking | undefined {
  const dayTime = normalizeDay(day).getTime();

  return bookings.find((booking) => {
    if (booking.carId !== carId) return false;
    const start = normalizeDay(booking.startDate).getTime();
    const end = normalizeDay(booking.endDate).getTime();
    return dayTime >= start && dayTime <= end;
  });
}

function countWeekBookings(bookings: Booking[], days: Date[]) {
  const weekStart = normalizeDay(days[0]).getTime();
  const weekEnd = normalizeDay(days[days.length - 1]).getTime();

  return bookings.filter((booking) => {
    const start = normalizeDay(booking.startDate).getTime();
    const end = normalizeDay(booking.endDate).getTime();
    return start <= weekEnd && end >= weekStart;
  }).length;
}

function CalendarLegend() {
  const items = [
    BookingStatus.PENDING,
    BookingStatus.CONFIRMED,
    BookingStatus.IN_PROGRESS,
    BookingStatus.COMPLETED,
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {items.map((status) => (
        <span
          key={status}
          className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-2.5 py-1 text-[11px] font-medium shadow-sm"
        >
          <span
            className={cn("h-2 w-2 rounded-full", STATUS_CONFIG[status].dot)}
            aria-hidden
          />
          {STATUS_CONFIG[status].label}
        </span>
      ))}
    </div>
  );
}

function FleetCalendarGrid({
  cars,
  bookings,
  days,
}: {
  cars: CarType[];
  bookings: Booking[];
  days: Date[];
}) {
  if (cars.length === 0) {
    return (
      <DashboardEmptyState
        icon={Car}
        title="Aucune voiture dans la flotte"
        description="Ajoutez des véhicules pour visualiser le planning"
      />
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.05] bg-[#F2F2F7]/50">
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          {/* Header row */}
          <div className="grid grid-cols-[11rem_repeat(7,minmax(5rem,1fr))] border-b border-black/[0.06] bg-white/80">
            <div className="sticky left-0 z-20 border-r border-black/[0.06] bg-white/95 px-4 py-3 backdrop-blur-sm">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Flotte
              </p>
            </div>
            {days.map((day) => {
              const today = isToday(day);
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "border-r border-black/[0.04] px-2 py-3 text-center last:border-r-0",
                    today && "bg-primary/[0.06]",
                  )}
                >
                  <p
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-wide",
                      today ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    {format(day, "EEE", { locale: fr })}
                  </p>
                  <p
                    className={cn(
                      "mx-auto mt-1 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold tabular-nums",
                      today && "bg-primary text-primary-foreground shadow-sm",
                    )}
                  >
                    {format(day, "d")}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Car rows */}
          {cars.map((car, rowIndex) => (
            <div
              key={car.id}
              className={cn(
                "grid grid-cols-[11rem_repeat(7,minmax(5rem,1fr))] border-b border-black/[0.04] last:border-b-0",
                rowIndex % 2 === 0 ? "bg-white/60" : "bg-white/30",
              )}
            >
              <div className="sticky left-0 z-10 border-r border-black/[0.06] bg-white/95 px-4 py-3 backdrop-blur-sm">
                <p className="truncate text-sm font-semibold">
                  {car.brand} {car.model}
                </p>
                <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                  {car.registrationNumber}
                </p>
              </div>

              {days.map((day) => {
                const booking = getBookingForCell(bookings, car.id, day);
                const config = booking
                  ? STATUS_CONFIG[booking.status]
                  : null;
                const isStart = booking
                  ? isSameDay(normalizeDay(booking.startDate), day)
                  : false;

                return (
                  <div
                    key={`${car.id}-${day.toISOString()}`}
                    className="flex min-h-[3.25rem] items-center border-r border-black/[0.03] p-1.5 last:border-r-0"
                  >
                    {booking ? (
                      <Link
                        href={`/dashboard/bookings/${booking.id}`}
                        className={cn(
                          "flex h-full w-full items-center justify-center rounded-xl px-1 py-2 text-center text-[10px] font-semibold leading-tight transition-transform hover:scale-[1.02] active:scale-[0.98]",
                          config?.cell,
                          !isStart && "opacity-85",
                        )}
                        title={`${booking.clientFirstName} ${booking.clientLastName} · ${booking.bookingReference}`}
                      >
                        {isStart ? (
                          <span className="line-clamp-2 px-0.5">
                            {booking.clientFirstName}
                          </span>
                        ) : (
                          <span className="sr-only">
                            {booking.clientFirstName} {booking.clientLastName}
                          </span>
                        )}
                      </Link>
                    ) : (
                      <div className="h-full w-full rounded-xl bg-transparent" />
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function FleetCalendarSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-10 w-full max-w-xl rounded-2xl" />
      <Skeleton className="h-[24rem] rounded-[1.25rem]" />
    </div>
  );
}

export function FleetCalendarBoard() {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const days = useMemo(
    () =>
      eachDayOfInterval({
        start: weekStart,
        end: addDays(weekStart, 6),
      }),
    [weekStart],
  );

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "calendar"],
    queryFn: async () => (await dashboardApi.getCalendar()).data,
  });

  const cars = data?.cars ?? [];
  const bookings = data?.bookings ?? [];
  const weekBookings = useMemo(
    () => countWeekBookings(bookings, days),
    [bookings, days],
  );

  const weekLabel = `${format(days[0], "d MMM", { locale: fr })} – ${format(days[6], "d MMM yyyy", { locale: fr })}`;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Calendrier"
        description="Planning hebdomadaire de votre flotte et des réservations"
        action={
          <div className="flex items-center gap-1.5 rounded-2xl border border-black/[0.06] bg-white p-1 shadow-sm">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl"
              onClick={() => setWeekStart(addDays(weekStart, -7))}
              aria-label="Semaine précédente"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="gap-1.5 rounded-xl px-3 text-xs font-semibold"
              onClick={() =>
                setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))
              }
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Aujourd&apos;hui
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-xl"
              onClick={() => setWeekStart(addDays(weekStart, 7))}
              aria-label="Semaine suivante"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        }
      />

      {isLoading ? (
        <FleetCalendarSkeleton />
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-xs font-medium shadow-sm">
                <Car className="h-3.5 w-3.5 text-primary" aria-hidden />
                <span className="font-bold tabular-nums">{cars.length}</span>
                <span className="text-muted-foreground">véhicules</span>
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden />
                {weekBookings} cette semaine
              </span>
            </div>
            <CalendarLegend />
          </div>

          <DashboardPanel padding="compact" className="overflow-hidden">
            <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-[17px] font-semibold tracking-tight capitalize">
                  {weekLabel}
                </h2>
                <p className="text-sm text-muted-foreground">
                  Vue planning par voiture · cliquez sur une réservation
                </p>
              </div>
            </div>

            <FleetCalendarGrid cars={cars} bookings={bookings} days={days} />
          </DashboardPanel>
        </>
      )}
    </div>
  );
}
