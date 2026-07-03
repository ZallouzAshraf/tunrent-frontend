"use client";

import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/routing";
import { CarFormWizard } from "@/components/dashboard/car-form-wizard";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardApi } from "@/lib/api";

export default function EditCarPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const { data: car, isLoading } = useQuery({
    queryKey: ["dashboard", "cars", id],
    queryFn: async () => (await dashboardApi.getCar(id)).data,
  });

  if (isLoading) return <Skeleton className="h-96" />;

  if (!car) {
    return (
      <p className="text-muted-foreground">Voiture introuvable</p>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/cars"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour à la liste
      </Link>
      <div>
        <h1 className="text-2xl font-bold">
          Éditer {car.brand} {car.model}
        </h1>
        <p className="text-muted-foreground">{car.registrationNumber}</p>
      </div>
      <CarFormWizard
        carId={id}
        initialValues={{
          brand: car.brand,
          model: car.model,
          year: car.year,
          color: car.color,
          registrationNumber: car.registrationNumber,
          vin: car.vin,
          category: car.category,
          transmission: car.transmission,
          fuelType: car.fuelType,
          seats: car.seats,
          doors: car.doors,
          hasAc: car.hasAc,
          hasGps: car.hasGps,
          hasBluetooth: car.hasBluetooth,
          hasUsb: car.hasUsb,
          hasChildSeat: car.hasChildSeat,
          hasInsurance: car.hasInsurance,
          description: car.description,
          pricePerDay: Number(car.pricePerDay),
          pricePerWeek: car.pricePerWeek
            ? Number(car.pricePerWeek)
            : undefined,
          depositAmount: car.depositAmount
            ? Number(car.depositAmount)
            : undefined,
          minRentalDays: car.minRentalDays,
          minDriverAge: car.minDriverAge,
          photos: car.photos,
          thumbnailUrl: car.thumbnailUrl,
          pickupLocations: car.pickupLocations,
        }}
      />
    </div>
  );
}
