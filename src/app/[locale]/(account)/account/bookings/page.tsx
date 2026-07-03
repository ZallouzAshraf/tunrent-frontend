"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@/i18n/routing";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { clientApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import { BookingStatus } from "@/types";

export default function AccountBookingsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: bookings, isLoading } = useQuery({
    queryKey: ["client", "bookings"],
    queryFn: async () => (await clientApi.getBookings()).data,
  });

  const filtered =
    bookings?.filter(
      (b) => statusFilter === "all" || b.status === statusFilter,
    ) ?? [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Mes réservations</h1>
          <p className="text-muted-foreground">
            Historique et suivi de vos locations
          </p>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrer par statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {Object.values(BookingStatus).map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Réservations</CardTitle>
          <CardDescription>{filtered.length} résultat(s)</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48 w-full" />
          ) : filtered.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Aucune réservation trouvée
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Référence</TableHead>
                  <TableHead>Voiture</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((booking) => (
                  <TableRow key={booking.id}>
                    <TableCell className="font-mono text-xs">
                      {booking.bookingReference}
                    </TableCell>
                    <TableCell>
                      {booking.car?.brand} {booking.car?.model}
                    </TableCell>
                    <TableCell className="text-sm">
                      {formatDate(booking.startDate)} —{" "}
                      {formatDate(booking.endDate)}
                    </TableCell>
                    <TableCell>{formatPrice(booking.totalPrice)}</TableCell>
                    <TableCell>
                      <StatusBadge status={booking.status} type="booking" />
                    </TableCell>
                    <TableCell>
                      <Link href={`/account/bookings/${booking.id}`}>
                        <Button variant="ghost" size="sm">
                          Voir
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
