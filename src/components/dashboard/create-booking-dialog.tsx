"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format, addDays } from "date-fns";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { dashboardApi, getErrorMessage } from "@/lib/api";
import type { Car } from "@/types";

const schema = z.object({
  carId: z.string().uuid(),
  clientFirstName: z.string().min(2),
  clientLastName: z.string().min(2),
  clientEmail: z.string().email(),
  clientPhone: z.string().regex(/^\+216[0-9]{8}$/),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  pickupLocation: z.string().min(2),
  dropoffLocation: z.string().min(2),
  clientNotes: z.string().optional(),
  source: z.enum(["direct", "phone"]),
  autoConfirm: z.boolean(),
});

type FormData = z.infer<typeof schema>;

export function CreateBookingDialog() {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const today = format(new Date(), "yyyy-MM-dd");
  const defaultEnd = format(addDays(new Date(), 3), "yyyy-MM-dd");

  const { data: carsData } = useQuery({
    queryKey: ["dashboard", "cars", "booking-form"],
    queryFn: async () => (await dashboardApi.getCars({ limit: 100 })).data,
    enabled: open,
  });

  const cars = carsData?.data ?? [];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      source: "direct",
      autoConfirm: true,
      startDate: today,
      endDate: defaultEnd,
      pickupLocation: "",
      dropoffLocation: "",
    },
  });

  const selectedCarId = watch("carId");
  const selectedCar = cars.find((c: Car) => c.id === selectedCarId);

  const mutation = useMutation({
    mutationFn: (data: FormData) => dashboardApi.createBooking(data),
    onSuccess: () => {
      toast.success("Réservation créée");
      queryClient.invalidateQueries({ queryKey: ["dashboard", "bookings"] });
      setOpen(false);
      reset();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const onCarChange = (carId: string) => {
    setValue("carId", carId);
    const car = cars.find((c: Car) => c.id === carId);
    const location =
      car?.pickupLocations?.[0]?.address ||
      car?.pickupLocations?.[0]?.city ||
      "";
    if (location) {
      setValue("pickupLocation", location);
      setValue("dropoffLocation", location);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="size-4" />
          Nouvelle réservation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer une réservation</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit((data) => mutation.mutate(data))}
          className="space-y-4"
        >
          <div className="space-y-2">
            <Label>Voiture</Label>
            <input type="hidden" {...register("carId")} />
            <Select
              value={selectedCarId}
              onValueChange={(carId) => {
                setValue("carId", carId, { shouldValidate: true });
                onCarChange(carId);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une voiture" />
              </SelectTrigger>
              <SelectContent>
                {cars.map((car: Car) => (
                  <SelectItem key={car.id} value={car.id}>
                    {car.brand} {car.model} ({car.year})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.carId && (
              <p className="text-sm text-destructive">{errors.carId.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Prénom client</Label>
              <Input {...register("clientFirstName")} />
            </div>
            <div className="space-y-2">
              <Label>Nom client</Label>
              <Input {...register("clientLastName")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" {...register("clientEmail")} />
          </div>

          <div className="space-y-2">
            <Label>Téléphone (+216XXXXXXXX)</Label>
            <Input {...register("clientPhone")} placeholder="+21620123456" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Début</Label>
              <Input type="date" {...register("startDate")} />
            </div>
            <div className="space-y-2">
              <Label>Fin</Label>
              <Input type="date" {...register("endDate")} />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Lieu de prise en charge</Label>
            <Input {...register("pickupLocation")} />
          </div>

          <div className="space-y-2">
            <Label>Lieu de retour</Label>
            <Input {...register("dropoffLocation")} />
          </div>

          <div className="space-y-2">
            <Label>Source</Label>
            <input type="hidden" {...register("source")} />
            <Select
              value={watch("source")}
              onValueChange={(v) =>
                setValue("source", v as "direct" | "phone", {
                  shouldValidate: true,
                })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="direct">Direct (agence)</SelectItem>
                <SelectItem value="phone">Téléphone</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notes</Label>
            <Textarea rows={2} {...register("clientNotes")} />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <Checkbox
              checked={watch("autoConfirm")}
              onCheckedChange={(v) =>
                setValue("autoConfirm", v === true, { shouldValidate: true })
              }
            />
            Confirmer automatiquement la réservation
          </label>

          {selectedCar && (
            <p className="text-sm text-muted-foreground">
              Tarif : {selectedCar.pricePerDay} TND / jour
            </p>
          )}

          <DialogFooter>
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Créer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
