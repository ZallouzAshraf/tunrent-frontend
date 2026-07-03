"use client";

import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Calendar,
  Banknote,
  CalendarDays,
  Car,
  CarFront,
  ChevronRight,
  Clock,
  Sparkles,
  Star,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  DashboardEmptyState,
  DashboardListRow,
  DashboardPageHeader,
  DashboardPanel,
  DashboardPanelHeader,
} from "@/components/dashboard/dashboard-ui";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
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
    tint: "bg-blue-500/10 text-blue-700",
  },
  {
    href: "/dashboard/bookings",
    label: "Réservations",
    description: "Valider les demandes",
    icon: CalendarDays,
    tint: "bg-violet-500/10 text-violet-700",
  },
  {
    href: "/dashboard/calendar",
    label: "Calendrier",
    description: "Planning de la flotte",
    icon: Calendar,
    tint: "bg-emerald-500/10 text-emerald-700",
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
    <div className="space-y-6 lg:space-y-8">
      <DashboardPageHeader
        title="Vue d'ensemble"
        description="Votre cockpit opérationnel — alertes et actions du jour"
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-36 rounded-[1.25rem]" />
          ))
        ) : (
          <>
            <KpiCard
              title="À traiter"
              value={stats?.pendingBookings ?? 0}
              icon={AlertCircle}
              description="Réservations en attente"
              accent="warning"
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
              accent="default"
            />
            <KpiCard
              title="CA encaissé"
              value={formatPrice(stats?.totalRevenue ?? 0)}
              icon={Banknote}
              description="Paiements complétés"
              accent="success"
            />
            <KpiCard
              title="Flotte dispo"
              value={`${stats?.availableCars ?? 0}/${stats?.totalCars ?? 0}`}
              icon={Car}
              description="Voitures disponibles"
              accent="gold"
            />
          </>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {QUICK_ACTIONS.map(({ href, label, description, icon: Icon, tint }) => (
          <Link
            key={href}
            href={href}
            className="group flex items-center gap-3 rounded-[1.25rem] border border-black/[0.04] bg-white p-4 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] active:scale-[0.99]"
          >
            <div
              className={`flex size-11 shrink-0 items-center justify-center rounded-2xl ${tint}`}
            >
              <Icon className="size-5" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-semibold">{label}</p>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <ChevronRight className="size-4 shrink-0 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
          </Link>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <DashboardPanel padding="compact">
          <DashboardPanelHeader
            title="Actions requises"
            description="Réservations à valider en priorité"
            icon={AlertCircle}
            iconClassName="bg-red-500/10"
            action={
              <Link href="/dashboard/bookings">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-black/[0.08] bg-white"
                >
                  Voir tout
                </Button>
              </Link>
            }
          />
          {pendingLoading ? (
            <Skeleton className="h-40 rounded-2xl" />
          ) : pendingBookings.length === 0 ? (
            <DashboardEmptyState
              icon={Sparkles}
              title="Tout est à jour"
              description="Aucune réservation en attente de validation"
            />
          ) : (
            <div className="divide-y divide-black/[0.05] rounded-2xl bg-[#F2F2F7]/70">
              {pendingBookings.map((b) => (
                <DashboardListRow
                  key={b.id}
                  href={`/dashboard/bookings/${b.id}`}
                  title={`${b.clientFirstName} ${b.clientLastName}`}
                  subtitle={`${b.car?.brand} ${b.car?.model} · ${formatDate(b.startDate)}`}
                  trailing={<StatusBadge status={b.status} type="booking" />}
                />
              ))}
            </div>
          )}
        </DashboardPanel>

        <DashboardPanel padding="compact">
          <DashboardPanelHeader
            title="Prochains départs"
            description="Réservations confirmées à venir"
            icon={CalendarDays}
            action={
              <Link href="/dashboard/calendar">
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-black/[0.08] bg-white"
                >
                  Calendrier
                </Button>
              </Link>
            }
          />
          {upcomingLoading ? (
            <Skeleton className="h-40 rounded-2xl" />
          ) : upcomingBookings.length === 0 ? (
            <DashboardEmptyState
              icon={CalendarDays}
              title="Aucun départ prévu"
              description="Les prochaines locations confirmées apparaîtront ici"
            />
          ) : (
            <div className="divide-y divide-black/[0.05] rounded-2xl bg-[#F2F2F7]/70">
              {upcomingBookings.map((b) => (
                <DashboardListRow
                  key={b.id}
                  href={`/dashboard/bookings/${b.id}`}
                  title={`${b.car?.brand} ${b.car?.model}`}
                  subtitle={`${b.clientFirstName} ${b.clientLastName} · ${formatDate(b.startDate)}`}
                  trailing={<StatusBadge status={b.status} type="booking" />}
                />
              ))}
            </div>
          )}
        </DashboardPanel>
      </div>

      <DashboardPanel>
        <DashboardPanelHeader
          title="Réputation agence"
          description="Note moyenne sur la marketplace"
          icon={Star}
          iconClassName="bg-[var(--tunrent-gold)]/20"
          action={
            <Link href="/dashboard/stats">
              <Button
                variant="outline"
                size="sm"
                className="rounded-full border-black/[0.08] bg-white"
              >
                Statistiques
              </Button>
            </Link>
          }
        />
        <div className="flex flex-wrap items-end gap-4">
          {agencyLoading ? (
            <Skeleton className="h-12 w-32 rounded-2xl" />
          ) : (
            <div className="flex items-baseline gap-2">
              <p className="text-4xl font-bold tracking-tight text-primary tabular-nums">
                {Number(agency?.avgRating ?? 0).toFixed(1)}
              </p>
              <p className="text-lg text-muted-foreground">/ 5</p>
              <p className="ms-2 rounded-full bg-[#F2F2F7] px-3 py-1 text-sm text-muted-foreground">
                {agency?.totalReviews ?? 0} avis
              </p>
            </div>
          )}
        </div>
      </DashboardPanel>
    </div>
  );
}
