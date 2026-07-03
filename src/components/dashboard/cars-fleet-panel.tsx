"use client";

import Image from "next/image";
import { useDeferredValue, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CarFront,
  Fuel,
  LayoutGrid,
  List,
  Pencil,
  Plus,
  Search,
  Settings2,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardApi } from "@/lib/api";
import { CAR_CATEGORY_LABELS, CAR_STATUS_LABELS } from "@/lib/constants/governorates";
import { canManageCars } from "@/lib/constants/permissions";
import { useAuth } from "@/lib/auth/use-auth";
import { cn, formatPrice } from "@/lib/utils";
import type { Car } from "@/types";
import { CarCategory, CarStatus, Transmission } from "@/types";

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: "all", label: "Toutes" },
  { value: CarStatus.AVAILABLE, label: "Disponibles" },
  { value: CarStatus.RENTED, label: "Louées" },
  { value: CarStatus.MAINTENANCE, label: "Maintenance" },
  { value: CarStatus.INACTIVE, label: "Inactives" },
];

const TRANSMISSION_LABELS: Record<Transmission, string> = {
  [Transmission.MANUAL]: "Manuelle",
  [Transmission.AUTOMATIC]: "Automatique",
};

function FleetStat({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-border/70 bg-card px-4 py-3 shadow-sm">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-0.5 text-2xl font-bold tabular-nums", accent)}>
        {value}
      </p>
    </div>
  );
}

function FleetCarCard({
  car,
  canManage,
  onStatusChange,
}: {
  car: Car;
  canManage: boolean;
  onStatusChange: (id: string, status: string) => void;
}) {
  const imageUrl =
    car.thumbnailUrl || car.photos[0] || "/placeholder-car.svg";
  const categoryLabel =
    CAR_CATEGORY_LABELS[car.category]?.fr ?? car.category;
  const price = Number(car.pricePerDay);

  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm ring-1 ring-black/[0.02] transition-all hover:border-primary/25 hover:shadow-md">
      <div className="relative bg-gradient-to-b from-muted/40 to-muted/10 p-4 pb-3">
        <div className="absolute start-3 top-3 z-10">
          <StatusBadge status={car.status} type="car" />
        </div>
        <div className="relative mx-auto aspect-[16/10] w-full max-w-[220px]">
          <Image
            src={imageUrl}
            alt={`${car.brand} ${car.model}`}
            fill
            className="object-contain transition-transform duration-300 group-hover:scale-[1.03]"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4 pt-2">
        <div>
          <h3 className="truncate text-sm font-bold tracking-tight">
            {car.brand} {car.model}
          </h3>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {car.year}
            {car.color ? ` · ${car.color}` : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          <span className="rounded-md bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
            {categoryLabel}
          </span>
          <span className="rounded-md bg-primary/8 px-2 py-0.5 text-[10px] font-medium text-primary">
            {TRANSMISSION_LABELS[car.transmission]}
          </span>
          <span className="rounded-md border border-border/60 px-2 py-0.5 font-mono text-[10px] text-foreground/80">
            {car.registrationNumber}
          </span>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 border-t border-border/60 pt-3">
          <div>
            <p className="text-lg font-bold text-primary">
              {formatPrice(price)}
            </p>
            <p className="text-[10px] text-muted-foreground">par jour</p>
          </div>

          <div className="flex items-center gap-1.5">
            {canManage && car.status !== CarStatus.RENTED && (
              <Select
                value={car.status}
                onValueChange={(v) => onStatusChange(car.id, v)}
              >
                <SelectTrigger className="h-8 w-8 shrink-0 p-0 [&>svg:last-child]:hidden">
                  <Settings2 className="mx-auto size-3.5 text-muted-foreground" />
                </SelectTrigger>
                <SelectContent align="end">
                  {Object.values(CarStatus)
                    .filter((s) => s !== CarStatus.RENTED)
                    .map((s) => (
                      <SelectItem key={s} value={s}>
                        {CAR_STATUS_LABELS[s]?.fr ?? s}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
            <Button variant="outline" size="sm" className="h-8" asChild>
              <Link href={`/dashboard/cars/${car.id}`}>
                <Pencil className="size-3.5" />
                Éditer
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}

function FleetCarRow({
  car,
  canManage,
  onStatusChange,
}: {
  car: Car;
  canManage: boolean;
  onStatusChange: (id: string, status: string) => void;
}) {
  const imageUrl =
    car.thumbnailUrl || car.photos[0] || "/placeholder-car.svg";
  const categoryLabel =
    CAR_CATEGORY_LABELS[car.category]?.fr ?? car.category;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-border/70 bg-card p-3 transition-colors hover:bg-muted/20">
      <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-muted/40">
        <Image
          src={imageUrl}
          alt=""
          fill
          className="object-contain p-1"
          sizes="56px"
        />
      </div>

      <div className="min-w-0 flex-1 grid gap-1 sm:grid-cols-[1.2fr_1fr_0.7fr_0.6fr] sm:items-center sm:gap-4">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">
            {car.brand} {car.model}
          </p>
          <p className="text-xs text-muted-foreground">
            {car.year} · {TRANSMISSION_LABELS[car.transmission]}
          </p>
        </div>
        <p className="font-mono text-xs text-muted-foreground">
          {car.registrationNumber}
        </p>
        <p className="text-xs capitalize text-muted-foreground">
          {categoryLabel}
        </p>
        <p className="text-sm font-semibold text-primary">
          {formatPrice(Number(car.pricePerDay))}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {canManage && car.status !== CarStatus.RENTED ? (
          <Select
            value={car.status}
            onValueChange={(v) => onStatusChange(car.id, v)}
          >
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(CarStatus)
                .filter((s) => s !== CarStatus.RENTED)
                .map((s) => (
                  <SelectItem key={s} value={s}>
                    {CAR_STATUS_LABELS[s]?.fr ?? s}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        ) : (
          <StatusBadge status={car.status} type="car" />
        )}
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/cars/${car.id}`}>Éditer</Link>
        </Button>
      </div>
    </div>
  );
}

function FleetSkeleton({ view }: { view: "grid" | "list" }) {
  if (view === "list") {
    return (
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    );
  }
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <Skeleton key={i} className="h-72 rounded-2xl" />
      ))}
    </div>
  );
}

export function CarsFleetPanel() {
  const queryClient = useQueryClient();
  const { agencyRole } = useAuth();
  const canManage = canManageCars(agencyRole ?? undefined);

  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const deferredSearch = useDeferredValue(search.trim());

  const { data: fleetData } = useQuery({
    queryKey: ["dashboard", "cars", "fleet-summary"],
    queryFn: async () => (await dashboardApi.getCars({ limit: 100 })).data,
  });

  const { data, isLoading } = useQuery({
    queryKey: [
      "dashboard",
      "cars",
      statusFilter,
      categoryFilter,
      deferredSearch,
    ],
    queryFn: async () =>
      (
        await dashboardApi.getCars({
          status: statusFilter !== "all" ? statusFilter : undefined,
          category: categoryFilter !== "all" ? categoryFilter : undefined,
          search: deferredSearch || undefined,
          limit: 100,
        })
      ).data,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      dashboardApi.updateCarStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "cars"] });
    },
  });

  const allCars = fleetData?.data ?? [];
  const cars = data?.data ?? [];

  const fleetStats = useMemo(
    () => ({
      total: allCars.length,
      available: allCars.filter((c) => c.status === CarStatus.AVAILABLE).length,
      rented: allCars.filter((c) => c.status === CarStatus.RENTED).length,
      maintenance: allCars.filter((c) => c.status === CarStatus.MAINTENANCE)
        .length,
    }),
    [allCars],
  );

  const handleStatusChange = (id: string, status: string) => {
    statusMutation.mutate({ id, status });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <CarFront className="size-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Ma flotte</h1>
            <p className="text-sm text-muted-foreground">
              {fleetStats.total} véhicule{fleetStats.total > 1 ? "s" : ""} au
              total
            </p>
          </div>
        </div>
        {canManage && (
          <Button asChild className="shrink-0">
            <Link href="/dashboard/cars/new">
              <Plus className="size-4" />
              Ajouter une voiture
            </Link>
          </Button>
        )}
      </header>

      {/* Fleet KPIs */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <FleetStat label="Total" value={fleetStats.total} />
        <FleetStat
          label="Disponibles"
          value={fleetStats.available}
          accent="text-emerald-700"
        />
        <FleetStat
          label="Louées"
          value={fleetStats.rented}
          accent="text-primary"
        />
        <FleetStat
          label="Maintenance"
          value={fleetStats.maintenance}
          accent="text-amber-700"
        />
      </div>

      {/* Toolbar */}
      <div className="space-y-3 rounded-2xl border border-border/80 bg-card p-4 shadow-sm">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative min-w-0 flex-1">
            <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher marque, modèle, immatriculation…"
              className="h-10 bg-muted/30 ps-9"
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-10 w-full min-w-[160px] sm:w-[180px]">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes catégories</SelectItem>
                {Object.values(CarCategory).map((c) => (
                  <SelectItem key={c} value={c}>
                    {CAR_CATEGORY_LABELS[c]?.fr ?? c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex rounded-lg border bg-muted/30 p-0.5">
              <Button
                type="button"
                variant={view === "grid" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-2.5"
                onClick={() => setView("grid")}
                aria-label="Vue grille"
              >
                <LayoutGrid className="size-4" />
              </Button>
              <Button
                type="button"
                variant={view === "list" ? "secondary" : "ghost"}
                size="sm"
                className="h-8 px-2.5"
                onClick={() => setView("list")}
                aria-label="Vue liste"
              >
                <List className="size-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setStatusFilter(value)}
              className={cn(
                "rounded-full px-3 py-1 text-xs font-medium transition-colors",
                statusFilter === value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div>
        <p className="mb-3 text-xs text-muted-foreground">
          {isLoading ? "Chargement…" : `${cars.length} résultat(s)`}
          {deferredSearch ? ` pour « ${deferredSearch} »` : ""}
        </p>

        {isLoading ? (
          <FleetSkeleton view={view} />
        ) : cars.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/15 px-6 py-16 text-center">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Fuel className="size-7" />
            </div>
            <h2 className="mt-4 text-base font-semibold">Aucune voiture</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              {deferredSearch || statusFilter !== "all" || categoryFilter !== "all"
                ? "Aucun véhicule ne correspond à vos filtres."
                : "Commencez par ajouter votre premier véhicule à la flotte."}
            </p>
            {canManage && !deferredSearch && statusFilter === "all" && (
              <Button className="mt-5" asChild>
                <Link href="/dashboard/cars/new">
                  <Plus className="size-4" />
                  Ajouter une voiture
                </Link>
              </Button>
            )}
          </div>
        ) : view === "grid" ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {cars.map((car) => (
              <FleetCarCard
                key={car.id}
                car={car}
                canManage={canManage}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            {cars.map((car) => (
              <FleetCarRow
                key={car.id}
                car={car}
                canManage={canManage}
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
