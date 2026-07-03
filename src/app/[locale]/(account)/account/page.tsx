"use client";

import { useQuery } from "@tanstack/react-query";
import { CalendarDays, Car, Star } from "lucide-react";
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
import { Skeleton } from "@/components/ui/skeleton";
import { clientApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import { BookingStatus } from "@/types";

export default function AccountOverviewPage() {
  const { data: bookings, isLoading } = useQuery({
    queryKey: ["client", "bookings"],
    queryFn: async () => (await clientApi.getBookings()).data,
  });

  const upcoming = bookings?.find(
    (b) =>
      b.status === BookingStatus.CONFIRMED ||
      b.status === BookingStatus.PENDING,
  );
  const completed =
    bookings?.filter((b) => b.status === BookingStatus.COMPLETED).length ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mon compte</h1>
        <p className="text-muted-foreground">
          Gérez vos réservations et votre profil
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Réservations</CardDescription>
            <CardTitle className="text-3xl">
              {isLoading ? "—" : (bookings?.length ?? 0)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Terminées</CardDescription>
            <CardTitle className="text-3xl">
              {isLoading ? "—" : completed}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Prochaine location</CardDescription>
            <CardTitle className="text-lg">
              {upcoming ? formatDate(upcoming.startDate) : "Aucune"}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              Prochaine réservation
            </CardTitle>
            <CardDescription>
              Votre location à venir ou en attente
            </CardDescription>
          </div>
          <Link href="/account/bookings">
            <Button variant="outline" size="sm">
              Voir tout
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-24 w-full" />
          ) : upcoming ? (
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between rounded-lg border p-4">
              <div className="space-y-1">
                <p className="font-medium">
                  {upcoming.car?.brand} {upcoming.car?.model}
                </p>
                <p className="text-sm text-muted-foreground">
                  {formatDate(upcoming.startDate)} →{" "}
                  {formatDate(upcoming.endDate)}
                </p>
                <p className="text-sm font-semibold text-primary">
                  {formatPrice(upcoming.totalPrice)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={upcoming.status} type="booking" />
                <Link href={`/account/bookings/${upcoming.id}`}>
                  <Button size="sm">Détails</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <Car className="h-10 w-10 text-muted-foreground" />
              <p className="text-muted-foreground">
                Aucune réservation à venir
              </p>
              <Link href="/cars">
                <Button>Parcourir les voitures</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Link href="/account/profile">
          <Card className="transition-shadow hover:shadow-md cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base">Mettre à jour le profil</CardTitle>
              <CardDescription>Nom, téléphone, avatar</CardDescription>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/account/reviews">
          <Card className="transition-shadow hover:shadow-md cursor-pointer">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Star className="h-4 w-4 text-[var(--tunrent-gold)]" />
                Laisser un avis
              </CardTitle>
              <CardDescription>Après une location terminée</CardDescription>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </div>
  );
}
