"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { DatePickerField } from "@/components/ui/date-picker";
import { dashboardApi, getErrorMessage } from "@/lib/api";
import { formatDate } from "@/lib/utils";

interface AvailabilityBlock {
  id: string;
  startDate: string;
  endDate: string;
  reason?: string;
}

export default function DashboardAvailabilityPage() {
  const queryClient = useQueryClient();
  const [carId, setCarId] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");

  const { data: carsData, isLoading: carsLoading } = useQuery({
    queryKey: ["dashboard", "cars", "all"],
    queryFn: async () => (await dashboardApi.getCars({ limit: 100 })).data,
  });

  const { data: availability, isLoading: availLoading } = useQuery({
    queryKey: ["dashboard", "availability", carId],
    queryFn: async () =>
      (await dashboardApi.getAvailability(carId)).data as AvailabilityBlock[],
    enabled: !!carId,
  });

  const createBlock = useMutation({
    mutationFn: () =>
      dashboardApi.createBlock({ carId, startDate, endDate, reason }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "availability", carId],
      });
      toast.success("Blocage créé");
      setStartDate("");
      setEndDate("");
      setReason("");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const deleteBlock = useMutation({
    mutationFn: (id: string) => dashboardApi.deleteBlock(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "availability", carId],
      }),
  });

  const cars = carsData?.data ?? [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Disponibilités</h1>
        <p className="text-muted-foreground">
          Bloquez manuellement des périodes par voiture
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Sélectionner une voiture</CardTitle>
        </CardHeader>
        <CardContent>
          {carsLoading ? (
            <Skeleton className="h-10 w-64" />
          ) : (
            <Select value={carId} onValueChange={setCarId}>
              <SelectTrigger className="max-w-md">
                <SelectValue placeholder="Choisir une voiture" />
              </SelectTrigger>
              <SelectContent>
                {cars.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.brand} {c.model} — {c.registrationNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      {carId && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Nouveau blocage
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <DatePickerField
                label="Date début"
                value={startDate}
                onChange={setStartDate}
              />
              <DatePickerField
                label="Date fin"
                value={endDate}
                min={startDate}
                onChange={setEndDate}
              />
              <div className="space-y-2 sm:col-span-2">
                <Label>Raison</Label>
                <Input
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Maintenance, usage personnel..."
                />
              </div>
              <Button
                className="sm:col-span-2 lg:col-span-4 w-fit"
                disabled={
                  !startDate || !endDate || createBlock.isPending
                }
                onClick={() => createBlock.mutate()}
              >
                {createBlock.isPending && (
                  <Loader2 className="animate-spin" />
                )}
                Créer le blocage
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blocages actifs</CardTitle>
              <CardDescription>
                Périodes indisponibles pour cette voiture
              </CardDescription>
            </CardHeader>
            <CardContent>
              {availLoading ? (
                <Skeleton className="h-24" />
              ) : !availability?.length ? (
                <p className="text-sm text-muted-foreground">
                  Aucun blocage
                </p>
              ) : (
                <div className="space-y-2">
                  {availability.map((block) => (
                    <div
                      key={block.id}
                      className="flex items-center justify-between rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {formatDate(block.startDate)} —{" "}
                          {formatDate(block.endDate)}
                        </p>
                        {block.reason && (
                          <p className="text-xs text-muted-foreground">
                            {block.reason}
                          </p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteBlock.mutate(block.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}
