"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AlertCircle,
  CalendarDays,
  Car,
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
import { dashboardApi } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import { BookingStatus } from "@/types";

export default function DashboardOverviewPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboard", "stats", "overview"],
    queryFn: async () => (await dashboardApi.getStatsOverview()).data,
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ["dashboard", "stats", "chart"],
    queryFn: async () => (await dashboardApi.getBookingsChart(6)).data,
  });

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ["dashboard", "bookings", "pending"],
    queryFn: async () =>
      (
        await dashboardApi.getBookings({
          status: BookingStatus.PENDING,
          limit: 5,
        })
      ).data,
  });

  const pendingBookings = bookingsData?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Vue d&apos;ensemble</h1>
        <p className="text-muted-foreground">
          Statistiques et actions requises
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
              title="Réservations en attente"
              value={stats?.pendingBookings ?? 0}
              icon={AlertCircle}
              trend={
                (stats?.pendingBookings ?? 0) > 0
                  ? { value: "Action requise", positive: false }
                  : undefined
              }
            />
            <KpiCard
              title="CA du mois"
              value={formatPrice(stats?.totalRevenue ?? 0)}
              icon={DollarSign}
            />
            <KpiCard
              title="Taux d'occupation"
              value={`${Math.round(stats?.occupancyRate ?? 0)}%`}
              icon={CalendarDays}
            />
            <KpiCard
              title="Voitures disponibles"
              value={`${stats?.availableCars ?? 0}/${stats?.totalCars ?? 0}`}
              icon={Car}
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Réservations par mois</CardTitle>
            <CardDescription>6 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            {chartLoading ? (
              <Skeleton className="h-[250px]" />
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData ?? []}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid var(--border)",
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="var(--tunrent-blue)"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-accent" />
                Actions requises
              </CardTitle>
              <CardDescription>Réservations en attente</CardDescription>
            </div>
            <Link href="/dashboard/bookings">
              <Button variant="outline" size="sm">
                Voir tout
              </Button>
            </Link>
          </CardHeader>
          <CardContent>
            {bookingsLoading ? (
              <Skeleton className="h-40" />
            ) : pendingBookings.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                Aucune action en attente
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
                      <p className="font-medium text-sm">
                        {b.clientFirstName} {b.clientLastName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {b.car?.brand} {b.car?.model} ·{" "}
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
            <Star className="h-5 w-5 text-[var(--tunrent-gold)]" />
            Note moyenne agence
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-primary">
            {statsLoading ? "—" : "4.8"}
            <span className="text-base font-normal text-muted-foreground">
              {" "}
              / 5
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
