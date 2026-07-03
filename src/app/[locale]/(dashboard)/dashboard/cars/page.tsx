"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Link } from "@/i18n/routing";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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
import { dashboardApi } from "@/lib/api";
import { formatPrice } from "@/lib/utils";
import { CarCategory, CarStatus } from "@/types";
import { canManageCars } from "@/lib/constants/permissions";
import { useAuth } from "@/lib/auth/use-auth";

export default function DashboardCarsPage() {
  const queryClient = useQueryClient();
  const { agencyRole } = useAuth();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "cars", statusFilter, categoryFilter],
    queryFn: async () =>
      (
        await dashboardApi.getCars({
          status: statusFilter !== "all" ? statusFilter : undefined,
          category: categoryFilter !== "all" ? categoryFilter : undefined,
        })
      ).data,
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      dashboardApi.updateCarStatus(id, status),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["dashboard", "cars"] }),
  });

  const cars = data?.data ?? [];
  const canManage = canManageCars(agencyRole ?? undefined);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Voitures</h1>
          <p className="text-muted-foreground">Gérez votre flotte</p>
        </div>
        {canManage && (
          <Link href="/dashboard/cars/new">
            <Button>
              <Plus className="h-4 w-4" />
              Ajouter une voiture
            </Button>
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous statuts</SelectItem>
            {Object.values(CarStatus).map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            {Object.values(CarCategory).map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{data?.meta.total ?? 0} voiture(s)</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-48" />
          ) : cars.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">
              Aucune voiture
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Voiture</TableHead>
                  <TableHead>Immat.</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Prix/j</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {cars.map((car) => (
                  <TableRow key={car.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {car.thumbnailUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={car.thumbnailUrl}
                            alt=""
                            className="h-10 w-14 rounded object-cover"
                          />
                        )}
                        <span className="font-medium">
                          {car.brand} {car.model}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs">
                      {car.registrationNumber}
                    </TableCell>
                    <TableCell className="capitalize">{car.category}</TableCell>
                    <TableCell>{formatPrice(car.pricePerDay)}</TableCell>
                    <TableCell>
                      {canManage ? (
                        <Select
                          value={car.status}
                          onValueChange={(v) =>
                            statusMutation.mutate({ id: car.id, status: v })
                          }
                        >
                          <SelectTrigger className="h-8 w-[130px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(CarStatus).map((s) => (
                              <SelectItem key={s} value={s}>
                                {s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <StatusBadge status={car.status} type="car" />
                      )}
                    </TableCell>
                    <TableCell>
                      <Link href={`/dashboard/cars/${car.id}`}>
                        <Button variant="ghost" size="sm">
                          Éditer
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
