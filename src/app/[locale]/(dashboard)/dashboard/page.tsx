"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  CalendarDays,
  Car,
  CarFront,
  ChevronRight,
  Clock,
  DollarSign,
  Star,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { KpiCard } from "@/components/dashboard/kpi-card";
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
import { agencyApi, dashboardApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import { BookingStatus } from "@/types";

const QUICK_ACTIONS = [
  {
    href: "/dashboard/cars/new",
    label: "Ajouter une voiture",
    description: "Enrichir votre flotte",
    icon: CarFront,
  },
  {
    href: "/dashboard/bookings",
    label: "Gérer les réservations",
    description: "Valider ou suivre les demandes",
    icon: CalendarDays,
  },
  {
    href: "/dashboard/calendar",
    label: "Ouvrir le calendrier",
    description: "Vue planning de la flotte",
    icon: Calendar,
  },
] as const;

export default function DashboardOverviewPage() {
  const today = new Date().toISOString().split("T")[0];

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard", "stats", "overview"],
    queryFn: async () => (await dashboardApi.getStatsOverview()).data,
  });

  const { data: agency, isLoading: agencyLoading } = useQuery({
    queryKey: ["dashboard", "agency"],
    queryFn: async () => (await agencyApi.get()).data,
  });

  const { data: pendingData, isLoading: pendingLoading } = useQuery({
    queryKey: ["dashboard", "bookings", "pending"],
    queryFn: async () =>
      (
        await dashboardApi.getBookings({
          status: BookingStatus.PENDING,
          limit: 5,
        })
      ).data,
  });

  const { data: upcomingData, isLoading: upcomingLoading } = useQuery({
    queryKey: ["dashboard", "bookings", "upcoming", today],
    queryFn: async () =>
      (
        await dashboardApi.getBookings({
          status: BookingStatus.CONFIRMED,
          startDateFrom: today,
          limit: 5,
        })
      ).data,
  });

  const pendingBookings = pendingData?.data ?? [];
  const upcomingBookings = upcomingData?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Vue d&apos;ensemble</h1>
        <p className="text-muted-foreground">
          Votre cockpit opérationnel — alertes et actions du jour
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))
        ) : (
          <>
            <KpiCard
              title="À traiter"
              value={stats?.pendingBookings ?? 0}
              icon={AlertCircle}
              description="Réservations en attente"
              trend={
                (stats?.pendingBookings ?? 0) > 0
                  ? { value: "Action requise", positive: false }
                  : undefined
              }
            />
            <KpiCard
              title="En cours"
              value={stats?.activeBookings ?? 0}
              icon={Clock}
              description="Confirmées ou en location"
            />
            <KpiCard
              title="CA encaissé"
              value={formatPrice(stats?.totalRevenue ?? 0)}
              icon={DollarSign}
              description="Paiements complétés"
            />
            <KpiCard
              title="Flotte dispo"
              value={`${stats?.availableCars ?? 0}/${stats?.totalCars ?? 0}`}
              icon={Car}
              description="Voitures disponibles"
            />
          </>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {QUICK_ACTIONS.map(({ href, label, description, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 rounded-xl border bg-card p-4 transition-colors hover:border-primary/30 hover:bg-muted/30"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="size-5 text-accent" />
                Actions requises
              </CardTitle>
              <CardDescription>Réservations à valider en priorité</CardDescription>
            </div>
            <Link href="/dashboard/bookings">
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {pendingLoading ? (
              <Skeleton className="h-40" />
            ) : pendingBookings.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aucune réservation en attente — tout est à jour
              </p>
            ) : (
              <div className="space-y-3">
                {pendingBookings.map((b) => (
                  <Link
                    key={b.id}
                    href={`/dashboard/bookings/${b.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {b.clientFirstName} {b.clientLastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.car?.brand} {b.car?.model} · {formatDate(b.startDate)}
                      </p>
                    </div>
                    <StatusBadge status={b.status} type="booking" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="size-5 text-primary" />
                Prochains départs
              </CardTitle>
              <CardDescription>Réservations confirmées à venir</CardDescription>
            </div>
            <Link href="/dashboard/calendar">
              <Button variant="outline" size="sm">
                Calendrier
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {upcomingLoading ? (
              <Skeleton className="h-40" />
            ) : upcomingBookings.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aucun départ planifié prochainement
              </p>
            ) : (
              <div className="space-y-3">
                {upcomingBookings.map((b) => (
                  <Link
                    key={b.id}
                    href={`/dashboard/bookings/${b.id}`}
                    className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
                  >
                    <div>
                      <p className="text-sm font-medium">
                        {b.car?.brand} {b.car?.model}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.clientFirstName} {b.clientLastName} ·{" "}
                        {formatDate(b.startDate)}
                      </p>
                    </div>
                    <StatusBadge status={b.status} type="booking" />
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="size-5 text-[var(--tunrent-gold)]" />
            Réputation agence
          </CardTitle>
          <CardDescription>
            Note moyenne sur la marketplace
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-end justify-between gap-4">
          {agencyLoading ? (
            <Skeleton className="h-10 w-24" />
          ) : (
            <p className="text-3xl font-bold text-primary">
              {Number(agency?.avgRating ?? 0).toFixed(1)}
              <span className="text-base font-normal text-muted-foreground">
                {" "}
                / 5
              </span>
              <span className="ms-3 text-sm font-normal text-muted-foreground">
                ({agency?.totalReviews ?? 0} avis)
              </span>
            </p>
          )}
          <Link href="/dashboard/stats">
            <Button variant="outline" size="sm">
              Voir les statistiques détaillées
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
