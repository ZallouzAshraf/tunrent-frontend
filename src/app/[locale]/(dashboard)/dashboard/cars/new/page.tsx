"use client";

import { CarFormWizard } from "@/components/dashboard/car-form-wizard";

export default function NewCarPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Nouvelle voiture</h1>
        <p className="text-muted-foreground">
          Ajoutez un véhicule à votre flotte en 5 étapes
        </p>
      </div>
      <CarFormWizard />
    </div>
  );
}
