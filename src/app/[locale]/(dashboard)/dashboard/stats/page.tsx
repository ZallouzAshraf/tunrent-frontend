"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { KpiCard } from "@/components/dashboard/kpi-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { Banknote, CalendarDays, TrendingUp, Users } from "lucide-react";

export default function DashboardStatsPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["dashboard", "stats", "overview"],
    queryFn: async () => (await dashboardApi.getStatsOverview()).data,
  });

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ["dashboard", "stats", "chart", 12],
    queryFn: async () => (await dashboardApi.getBookingsChart(12)).data,
  });

  const { data: topCars, isLoading: topLoading } = useQuery({
    queryKey: ["dashboard", "stats", "top-cars"],
    queryFn: async () => (await dashboardApi.getTopCars(8)).data,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Statistiques</h1>
        <p className="text-muted-foreground">
          Analytics et tendances — performance de votre agence
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))
        ) : (
          <>
            <KpiCard
              title="Chiffre d'affaires"
              value={formatPrice(stats?.totalRevenue ?? 0)}
              icon={Banknote}
              description="Total encaissé"
            />
            <KpiCard
              title="Réservations totales"
              value={stats?.totalBookings ?? 0}
              icon={CalendarDays}
              description="Toutes périodes"
            />
            <KpiCard
              title="Taux d'occupation"
              value={`${Math.round(stats?.occupancyRate ?? 0)}%`}
              icon={TrendingUp}
              description="Flotte en location"
            />
            <KpiCard
              title="Locations actives"
              value={stats?.activeBookings ?? 0}
              icon={Users}
              description="Confirmées + en cours"
            />
          </>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Évolution des réservations</CardTitle>
            <CardDescription>12 derniers mois</CardDescription>
          </CardHeader>
          <CardContent>
            {chartLoading ? (
              <Skeleton className="h-[280px]" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <LineChart data={chartData ?? []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="var(--tunrent-red)"
                    strokeWidth={2}
                    dot={{ fill: "var(--tunrent-blue)" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top voitures</CardTitle>
            <CardDescription>Par nombre de réservations</CardDescription>
          </CardHeader>
          <CardContent>
            {topLoading ? (
              <Skeleton className="h-[280px]" />
            ) : (
              <ResponsiveContainer width="100%" height={280}>
                <BarChart
                  data={(topCars ?? []).map((t) => ({
                    name: `${t.car.brand} ${t.car.model}`,
                    count: t.bookingCount,
                  }))}
                  layout="vertical"
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tick={{ fontSize: 11 }} />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={100}
                    tick={{ fontSize: 10 }}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="count"
                    fill="var(--tunrent-blue)"
                    radius={[0, 4, 4, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
