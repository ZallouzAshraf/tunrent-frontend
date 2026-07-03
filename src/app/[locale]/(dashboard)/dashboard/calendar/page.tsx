"use client";

import { useQuery } from "@tanstack/react-query";
import {
  addDays,
  eachDayOfInterval,
  format,
  startOfWeek,
} from "date-fns";
import { fr } from "date-fns/locale";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardApi } from "@/lib/api";
import { BookingStatus } from "@/types";
import { cn } from "@/lib/utils";

const statusColors: Partial<Record<BookingStatus, string>> = {
  [BookingStatus.PENDING]: "bg-amber-200",
  [BookingStatus.CONFIRMED]: "bg-green-200",
  [BookingStatus.IN_PROGRESS]: "bg-blue-200",
  [BookingStatus.COMPLETED]: "bg-gray-200",
};

export default function DashboardCalendarPage() {
  const [weekStart, setWeekStart] = useState(() =>
    startOfWeek(new Date(), { weekStartsOn: 1 }),
  );

  const days = eachDayOfInterval({
    start: weekStart,
    end: addDays(weekStart, 6),
  });

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "calendar"],
    queryFn: async () => (await dashboardApi.getCalendar()).data,
  });

  const cars = data?.cars ?? [];
  const bookings = data?.bookings ?? [];

  const getBookingForCell = (carId: string, day: Date) =>
    bookings.find((b) => {
      if (b.carId !== carId) return false;
      const start = new Date(b.startDate);
      const end = new Date(b.endDate);
      return day >= start && day <= end;
    });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Calendrier</h1>
          <p className="text-muted-foreground">
            Planning des voitures et réservations
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekStart(addDays(weekStart, -7))}
          >
            Semaine préc.
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}
          >
            Aujourd&apos;hui
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setWeekStart(addDays(weekStart, 7))}
          >
            Semaine suiv.
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Semaine du {format(weekStart, "d MMMM yyyy", { locale: fr })}</CardTitle>
          <CardDescription>Vue planning par voiture</CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          {isLoading ? (
            <Skeleton className="h-64" />
          ) : (
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr>
                  <th className="border p-2 text-left bg-muted/50">Voiture</th>
                  {days.map((d) => (
                    <th key={d.toISOString()} className="border p-2 text-center bg-muted/50 min-w-[80px]">
                      {format(d, "EEE d", { locale: fr })}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => (
                  <tr key={car.id}>
                    <td className="border p-2 font-medium whitespace-nowrap">
                      {car.brand} {car.model}
                    </td>
                    {days.map((day) => {
                      const booking = getBookingForCell(car.id, day);
                      return (
                        <td
                          key={day.toISOString()}
                          className={cn(
                            "border p-1 h-10 text-center text-xs",
                            booking && statusColors[booking.status],
                          )}
                          title={
                            booking
                              ? `${booking.clientFirstName} ${booking.clientLastName}`
                              : undefined
                          }
                        >
                          {booking?.clientFirstName?.[0]}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
