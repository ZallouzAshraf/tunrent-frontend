import { z } from "zod";
import { CarCategory, FuelType, Transmission } from "@/types";

export const carStep1Schema = z.object({
  brand: z.string().min(1, "Marque requise"),
  model: z.string().min(1, "Modèle requis"),
  year: z.coerce.number().min(1990).max(new Date().getFullYear() + 1),
  color: z.string().optional(),
  registrationNumber: z.string().min(1, "Immatriculation requise"),
  vin: z.string().optional(),
});

export const carStep2Schema = z.object({
  category: z.nativeEnum(CarCategory),
  transmission: z.nativeEnum(Transmission),
  fuelType: z.nativeEnum(FuelType),
  seats: z.coerce.number().min(2).max(9),
  doors: z.coerce.number().optional(),
  hasAc: z.boolean(),
  hasGps: z.boolean(),
  hasBluetooth: z.boolean(),
  hasUsb: z.boolean(),
  hasChildSeat: z.boolean(),
  hasInsurance: z.boolean(),
  description: z.string().optional(),
});

export const carStep3Schema = z.object({
  pricePerDay: z.coerce.number().min(1),
  pricePerWeek: z.coerce.number().optional(),
  depositAmount: z.coerce.number().optional(),
  minRentalDays: z.coerce.number().min(1).optional(),
  minDriverAge: z.coerce.number().min(18).optional(),
});

export const carStep4Schema = z.object({
  photos: z.array(z.string()).min(1, "Au moins une photo"),
  thumbnailUrl: z.string().optional(),
});

export const carStep5Schema = z.object({
  pickupLocations: z
    .array(
      z.object({
        name: z.string().min(1),
        address: z.string().min(1),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      }),
    )
    .min(1, "Au moins un lieu de prise en charge"),
});

export const carFormSchema = carStep1Schema
  .merge(carStep2Schema)
  .merge(carStep3Schema)
  .merge(carStep4Schema)
  .merge(carStep5Schema);

export type CarFormValues = z.infer<typeof carFormSchema>;

export const defaultCarFormValues: CarFormValues = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  color: "",
  registrationNumber: "",
  vin: "",
  category: CarCategory.ECONOMY,
  transmission: Transmission.MANUAL,
  fuelType: FuelType.GASOLINE,
  seats: 5,
  doors: 4,
  hasAc: true,
  hasGps: false,
  hasBluetooth: true,
  hasUsb: true,
  hasChildSeat: false,
  hasInsurance: true,
  description: "",
  pricePerDay: 80,
  pricePerWeek: undefined,
  depositAmount: 500,
  minRentalDays: 1,
  minDriverAge: 21,
  photos: [],
  thumbnailUrl: "",
  pickupLocations: [{ name: "Agence principale", address: "" }],
};
