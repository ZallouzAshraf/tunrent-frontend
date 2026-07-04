"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Download } from "lucide-react";
import { BookingsKanbanBoard } from "@/components/dashboard/bookings-kanban-board";
import { CreateBookingDialog } from "@/components/dashboard/create-booking-dialog";
import { Button } from "@/components/ui/button";
import { dashboardApi } from "@/lib/api";
import { downloadCsv } from "@/lib/csv-export";
import { formatDate, formatPrice } from "@/lib/utils";
import type { Booking } from "@/types";

function exportBookingsCsv(bookings: Booking[]) {
  const rows: string[][] = [
    [
      "Référence",
      "Client",
      "Email",
      "Téléphone",
      "Voiture",
      "Début",
      "Fin",
      "Statut",
      "Total",
    ],
    ...bookings.map((booking) => [
      booking.bookingReference,
      `${booking.clientFirstName} ${booking.clientLastName}`,
      booking.clientEmail,
      booking.clientPhone,
      booking.car
        ? `${booking.car.brand} ${booking.car.model}`
        : booking.carId,
      formatDate(booking.startDate),
      formatDate(booking.endDate),
      booking.status,
      formatPrice(Number(booking.totalPrice)),
    ]),
  ];

  downloadCsv(`reservations-${format(new Date(), "yyyy-MM-dd")}.csv`, rows);
}

export default function DashboardBookingsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "bookings"],
    queryFn: async () => (await dashboardApi.getBookings({ limit: 100 })).data,
  });

  const bookings = data?.data ?? [];

  return (
    <BookingsKanbanBoard
      bookings={bookings}
      isLoading={isLoading}
      headerAction={
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            variant="outline"
            className="gap-2"
            disabled={bookings.length === 0}
            onClick={() => exportBookingsCsv(bookings)}
          >
            <Download className="size-4" />
            Exporter CSV
          </Button>
          <CreateBookingDialog />
        </div>
      }
    />
  );
}
