"use client";

import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  Building2,
  Car,
  CalendarDays,
  Users,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  AdminAlertBanner,
  AdminPageHeader,
  AdminPanel,
  AdminStatCard,
  AGENCY_STATUS_CONFIG,
} from "@/components/admin/admin-ui";
import { adminApi } from "@/lib/api";
import { cn } from "@/lib/utils";
import { AgencyStatus } from "@/types";

export default function AdminOverviewPage() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin", "stats"],
    queryFn: async () => (await adminApi.getStats()).data,
  });

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-20 w-full max-w-xl rounded-2xl" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-2xl" />
          ))}
        </div>
        <Skeleton className="h-48 rounded-2xl" />
      </div>
    );
  }

  if (!stats) return null;

  const pendingCount =
    stats.pendingAgencies ||
    stats.agenciesByStatus[AgencyStatus.PENDING_VALIDATION] ||
    0;

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Pilotage plateforme"
        description="Indicateurs clés, validations en attente et répartition des agences partenaires."
        badge={
          <span className="inline-flex items-center rounded-full bg-[#1e3a5f]/10 px-2.5 py-1 text-xs font-semibold text-[#1e3a5f]">
            Temps réel
          </span>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          title="Utilisateurs"
          value={stats.totalUsers}
          hint="Comptes inscrits"
          icon={Users}
          accent="slate"
        />
        <AdminStatCard
          title="Agences"
          value={stats.totalAgencies}
          hint={`${stats.agenciesByStatus[AgencyStatus.ACTIVE] ?? 0} actives`}
          icon={Building2}
          accent="blue"
        />
        <AdminStatCard
          title="Véhicules"
          value={stats.totalCars}
          hint="Flotte totale"
          icon={Car}
          accent="emerald"
        />
        <AdminStatCard
          title="Réservations"
          value={stats.totalBookings}
          hint="Toutes périodes"
          icon={CalendarDays}
          accent="violet"
        />
      </div>

      {pendingCount > 0 && (
        <AdminAlertBanner
          title={`${pendingCount} agence${pendingCount > 1 ? "s" : ""} en attente de validation`}
          description="Des partenaires ont soumis leur dossier et attendent votre approbation pour apparaître sur la marketplace."
          href="/admin/agencies?status=pending_validation"
          linkLabel="Traiter les demandes"
        />
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <AdminPanel className="lg:col-span-2" padding="default">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold">Agences par statut</h3>
              <p className="text-sm text-muted-foreground">
                Répartition du parc partenaire
              </p>
            </div>
            <Button variant="outline" size="sm" asChild className="gap-1.5">
              <Link href="/admin/agencies">
                Voir tout
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {Object.entries(stats.agenciesByStatus).map(([status, count]) => {
              const config = AGENCY_STATUS_CONFIG[status];
              const total = stats.totalAgencies || 1;
              const pct = Math.round((count / total) * 100);

              return (
                <div
                  key={status}
                  className="rounded-xl border border-black/[0.05] bg-slate-50/60 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <AdminStatusInline status={status} />
                    <span className="text-2xl font-bold tabular-nums">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-200/80">
                    <div
                      className={cn("h-full rounded-full transition-all", config?.dot ?? "bg-slate-400")}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{pct}% du total</p>
                </div>
              );
            })}
          </div>
        </AdminPanel>

        <AdminPanel padding="default">
          <h3 className="text-lg font-semibold">Actions rapides</h3>
          <p className="mb-5 text-sm text-muted-foreground">
            Raccourcis d&apos;administration
          </p>
          <div className="space-y-2">
            {[
              {
                href: "/admin/agencies?status=pending_validation",
                label: "Valider les agences",
                desc: "Demandes en attente",
              },
              {
                href: "/admin/users",
                label: "Gérer les utilisateurs",
                desc: "Clients & admins",
              },
              {
                href: "/admin/plan-requests",
                label: "Plans & upgrades",
                desc: "Demandes de facturation",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center justify-between rounded-xl border border-black/[0.05] bg-white px-4 py-3 transition-colors hover:border-[#1e3a5f]/20 hover:bg-[#1e3a5f]/[0.03]"
              >
                <div>
                  <p className="text-sm font-semibold">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </div>
        </AdminPanel>
      </div>
    </div>
  );
}

function AdminStatusInline({ status }: { status: string }) {
  const config = AGENCY_STATUS_CONFIG[status];
  return (
    <span className="inline-flex items-center gap-2 text-sm font-medium capitalize text-foreground">
      <span className={cn("h-2 w-2 rounded-full", config?.dot ?? "bg-slate-400")} />
      {config?.label ?? status.replace(/_/g, " ")}
    </span>
  );
}
