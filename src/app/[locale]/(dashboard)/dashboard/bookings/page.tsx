"use client";

import { useQuery } from "@tanstack/react-query";
import { Link } from "@/i18n/routing";
import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import { BookingStatus } from "@/types";

const KANBAN_COLUMNS: {
  status: BookingStatus;
  label: string;
  color: string;
}[] = [
  { status: BookingStatus.PENDING, label: "En attente", color: "border-amber-400" },
  { status: BookingStatus.CONFIRMED, label: "Confirmées", color: "border-green-500" },
  { status: BookingStatus.IN_PROGRESS, label: "En cours", color: "border-primary" },
  { status: BookingStatus.COMPLETED, label: "Terminées", color: "border-muted-foreground" },
];

const ARCHIVED: BookingStatus[] = [
  BookingStatus.REJECTED,
  BookingStatus.CANCELLED,
];

export default function DashboardBookingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "bookings"],
    queryFn: async () => (await dashboardApi.getBookings({ limit: 100 })).data,
  });

  const bookings = data?.data ?? [];

  const getByStatus = (status: BookingStatus) =>
    bookings.filter((b) => b.status === status);

  const archived = bookings.filter((b) => ARCHIVED.includes(b.status));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Réservations</h1>
        <p className="text-muted-foreground">Vue kanban par statut</p>
      </div>

      {isLoading ? (
        <Skeleton className="h-96" />
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {KANBAN_COLUMNS.map(({ status, label, color }) => {
              const items = getByStatus(status);
              return (
                <div key={status} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-sm">{label}</h3>
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                      {items.length}
                    </span>
                  </div>
                  <div className="space-y-2 min-h-[120px]">
                    {items.map((b) => (
                      <Link key={b.id} href={`/dashboard/bookings/${b.id}`}>
                        <Card
                          className={`cursor-pointer transition-shadow hover:shadow-md border-t-4 ${color}`}
                        >
                          <CardHeader className="p-3 pb-1">
                            <CardTitle className="text-sm font-medium">
                              {b.clientFirstName} {b.clientLastName}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-3 pt-0 space-y-1">
                            <p className="text-xs text-muted-foreground">
                              {b.car?.brand} {b.car?.model}
                            </p>
                            <p className="text-xs">
                              {formatDate(b.startDate)} — {formatDate(b.endDate)}
                            </p>
                            <p className="text-xs font-semibold text-primary">
                              {formatPrice(b.totalPrice)}
                            </p>
                          </CardContent>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {archived.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Rejetées / Annulées ({archived.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {archived.map((b) => (
                    <Link
                      key={b.id}
                      href={`/dashboard/bookings/${b.id}`}
                      className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {b.bookingReference} — {b.clientFirstName}{" "}
                          {b.clientLastName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatDate(b.startDate)}
                        </p>
                      </div>
                      <StatusBadge status={b.status} type="booking" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
