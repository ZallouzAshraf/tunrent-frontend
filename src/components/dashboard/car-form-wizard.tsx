"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Loader2, Upload, X } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
import { Textarea } from "@/components/ui/textarea";
import { dashboardApi, getErrorMessage, uploadApi } from "@/lib/api";
import {
  carStep1Schema,
  carStep2Schema,
  carStep3Schema,
  carStep4Schema,
  carStep5Schema,
  defaultCarFormValues,
  type CarFormValues,
} from "@/lib/schemas/car";
import { CarCategory, FuelType, Transmission } from "@/types";

const STEPS = [
  { title: "Informations", schema: carStep1Schema },
  { title: "Spécifications", schema: carStep2Schema },
  { title: "Tarifs", schema: carStep3Schema },
  { title: "Photos", schema: carStep4Schema },
  { title: "Lieux", schema: carStep5Schema },
];

interface CarFormWizardProps {
  initialValues?: Partial<CarFormValues>;
  carId?: string;
  onSuccess?: () => void;
}

export function CarFormWizard({
  initialValues,
  carId,
  onSuccess,
}: CarFormWizardProps) {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [uploading, setUploading] = useState(false);

  const form = useForm<CarFormValues>({
    resolver: zodResolver(STEPS[step].schema as never),
    defaultValues: { ...defaultCarFormValues, ...initialValues },
    mode: "onChange",
  });

  const { register, handleSubmit, watch, setValue, getValues, formState } =
    form;

  const createMutation = useMutation({
    mutationFn: (data: CarFormValues) =>
      carId
        ? dashboardApi.updateCar(carId, data)
        : dashboardApi.createCar(data),
    onSuccess: () => {
      toast.success(carId ? "Voiture mise à jour" : "Voiture créée");
      onSuccess?.();
      router.push("/dashboard/cars");
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const nextStep = async () => {
    const valid = await form.trigger();
    if (valid && step < STEPS.length - 1) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 0) setStep(step - 1);
  };

  const onSubmit = () => {
    createMutation.mutate(getValues());
  };

  const photos = watch("photos") ?? [];
  const pickupLocations = watch("pickupLocations") ?? [];

  const handlePhotoUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    try {
      const urls: string[] = [...photos];
      for (const file of Array.from(files)) {
        const res = await uploadApi.image(file);
        urls.push(res.data.url);
      }
      setValue("photos", urls, { shouldValidate: true });
      if (!getValues("thumbnailUrl") && urls[0]) {
        setValue("thumbnailUrl", urls[0]);
      }
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s.title} className="flex items-center gap-2">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                i <= step
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {i + 1}
            </div>
            <span
              className={`hidden sm:inline text-sm ${
                i === step ? "font-medium" : "text-muted-foreground"
              }`}
            >
              {s.title}
            </span>
            {i < STEPS.length - 1 && (
              <div className="hidden sm:block h-px w-8 bg-border" />
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{STEPS[step].title}</CardTitle>
          <CardDescription>
            Étape {step + 1} sur {STEPS.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(step === STEPS.length - 1 ? onSubmit : nextStep)}>
            {step === 0 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Marque</Label>
                  <Input {...register("brand")} />
                </div>
                <div className="space-y-2">
                  <Label>Modèle</Label>
                  <Input {...register("model")} />
                </div>
                <div className="space-y-2">
                  <Label>Année</Label>
                  <Input type="number" {...register("year")} />
                </div>
                <div className="space-y-2">
                  <Label>Couleur</Label>
                  <Input {...register("color")} />
                </div>
                <div className="space-y-2">
                  <Label>Immatriculation</Label>
                  <Input {...register("registrationNumber")} />
                </div>
                <div className="space-y-2">
                  <Label>VIN</Label>
                  <Input {...register("vin")} />
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label>Catégorie</Label>
                    <Select
                      value={watch("category")}
                      onValueChange={(v) =>
                        setValue("category", v as CarCategory)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(CarCategory).map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Transmission</Label>
                    <Select
                      value={watch("transmission")}
                      onValueChange={(v) =>
                        setValue("transmission", v as Transmission)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(Transmission).map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Carburant</Label>
                    <Select
                      value={watch("fuelType")}
                      onValueChange={(v) =>
                        setValue("fuelType", v as FuelType)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(FuelType).map((f) => (
                          <SelectItem key={f} value={f}>
                            {f}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Places</Label>
                    <Input type="number" {...register("seats")} />
                  </div>
                  <div className="space-y-2">
                    <Label>Portes</Label>
                    <Input type="number" {...register("doors")} />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  {(
                    [
                      ["hasAc", "Climatisation"],
                      ["hasGps", "GPS"],
                      ["hasBluetooth", "Bluetooth"],
                      ["hasUsb", "USB"],
                      ["hasChildSeat", "Siège enfant"],
                      ["hasInsurance", "Assurance"],
                    ] as const
                  ).map(([key, label]) => (
                    <div key={key} className="flex items-center gap-2">
                      <Checkbox
                        checked={watch(key)}
                        onCheckedChange={(v) => setValue(key, v === true)}
                      />
                      <Label>{label}</Label>
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea {...register("description")} />
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Prix / jour (TND)</Label>
                  <Input type="number" {...register("pricePerDay")} />
                </div>
                <div className="space-y-2">
                  <Label>Prix / semaine</Label>
                  <Input type="number" {...register("pricePerWeek")} />
                </div>
                <div className="space-y-2">
                  <Label>Caution</Label>
                  <Input type="number" {...register("depositAmount")} />
                </div>
                <div className="space-y-2">
                  <Label>Jours minimum</Label>
                  <Input type="number" {...register("minRentalDays")} />
                </div>
                <div className="space-y-2">
                  <Label>Âge minimum conducteur</Label>
                  <Input type="number" {...register("minDriverAge")} />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {photos.map((url, i) => (
                    <div key={url} className="relative">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={url}
                        alt=""
                        className="h-24 w-32 rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        className="absolute -top-2 -end-2 rounded-full bg-destructive p-1 text-white"
                        onClick={() =>
                          setValue(
                            "photos",
                            photos.filter((_, j) => j !== i),
                          )
                        }
                      >
                        <X className="h-3 w-3" />
                      </button>
                      <Button
                        type="button"
                        size="sm"
                        variant={
                          watch("thumbnailUrl") === url ? "default" : "outline"
                        }
                        className="mt-1 w-full text-xs"
                        onClick={() => setValue("thumbnailUrl", url)}
                      >
                        Miniature
                      </Button>
                    </div>
                  ))}
                </div>
                <label className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border-2 border-dashed p-8 hover:border-primary">
                  <Upload className="h-8 w-8 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    Glisser ou cliquer pour ajouter
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handlePhotoUpload(e.target.files)}
                  />
                </label>
                {uploading && (
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Upload en cours...
                  </p>
                )}
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                {pickupLocations.map((_, i) => (
                  <div
                    key={i}
                    className="grid gap-3 rounded-lg border p-4 sm:grid-cols-2"
                  >
                    <div className="space-y-2">
                      <Label>Nom du lieu</Label>
                      <Input
                        {...register(`pickupLocations.${i}.name`)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Adresse</Label>
                      <Input
                        {...register(`pickupLocations.${i}.address`)}
                      />
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() =>
                    setValue("pickupLocations", [
                      ...pickupLocations,
                      { name: "", address: "" },
                    ])
                  }
                >
                  Ajouter un lieu
                </Button>
              </div>
            )}

            {Object.keys(formState.errors).length > 0 && (
              <p className="mt-4 text-sm text-destructive">
                Veuillez corriger les erreurs du formulaire
              </p>
            )}

            <div className="mt-6 flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={step === 0}
              >
                <ChevronLeft className="h-4 w-4" />
                Précédent
              </Button>
              {step < STEPS.length - 1 ? (
                <Button type="submit">
                  Suivant
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending && (
                    <Loader2 className="animate-spin" />
                  )}
                  {carId ? "Enregistrer" : "Créer la voiture"}
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
