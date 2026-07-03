"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import {
  CheckCircle2,
  Loader2,
  Building2,
  MapPin,
  UserCircle,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
} from "lucide-react";
import { agencyApi, getErrorMessage } from "@/lib/api";
import {
  GOVERNORATES,
  GOVERNORATE_LABELS,
} from "@/lib/constants/governorates";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import type { Governorate } from "@/types";

const phoneRegex = /^\+216\d{8}$/;

const partnerSchema = z.object({
  name: z.string().min(2).max(255),
  description: z.string().optional(),
  email: z.string().email(),
  phone: z.string().regex(phoneRegex, "Format: +216XXXXXXXX"),
  phoneWhatsapp: z
    .string()
    .regex(phoneRegex, "Format: +216XXXXXXXX")
    .optional()
    .or(z.literal("")),
  address: z.string().min(5),
  city: z.string().min(2).max(100),
  governorate: z.string().min(1),
  postalCode: z.string().max(10).optional(),
  patenteNumber: z.string().max(50).optional(),
  rib: z.string().max(20).optional(),
  ownerFirstName: z.string().min(2).max(100),
  ownerLastName: z.string().min(2).max(100),
  ownerEmail: z.string().email(),
  ownerPassword: z.string().min(8).max(128),
});

type PartnerFormData = z.infer<typeof partnerSchema>;

const STEPS = [
  { id: 1, icon: Building2, labelKey: "stepAgency" as const, fields: ["name", "description", "email", "phone", "phoneWhatsapp"] as const },
  { id: 2, icon: MapPin, labelKey: "stepLocation" as const, fields: ["governorate", "address", "city", "postalCode", "patenteNumber", "rib"] as const },
  { id: 3, icon: UserCircle, labelKey: "stepOwner" as const, fields: ["ownerFirstName", "ownerLastName", "ownerEmail", "ownerPassword"] as const },
] as const;

function StepIndicator({ currentStep }: { currentStep: number }) {
  const t = useTranslations("pages.partner");

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {STEPS.map((step, index) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          const isDone = currentStep > step.id;

          return (
            <div key={step.id} className="flex flex-1 items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex size-11 items-center justify-center rounded-xl border-2 transition-all",
                    isDone && "border-primary bg-primary text-primary-foreground",
                    isActive && "border-primary bg-primary/10 text-primary",
                    !isActive && !isDone && "border-muted bg-muted/50 text-muted-foreground",
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="size-5" />
                  ) : (
                    <Icon className="size-5" />
                  )}
                </div>
                <span
                  className={cn(
                    "hidden text-center text-xs font-medium sm:block",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {t(step.labelKey)}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div
                  className={cn(
                    "mx-2 mb-6 h-0.5 flex-1 sm:mx-4",
                    currentStep > step.id ? "bg-primary" : "bg-border",
                  )}
                  aria-hidden
                />
              )}
            </div>
          );
        })}
      </div>
      <p className="mt-3 text-center text-sm text-muted-foreground sm:hidden">
        {t("stepOf", { current: currentStep, total: STEPS.length })}
      </p>
    </div>
  );
}

export function PartnerRegistrationForm() {
  const t = useTranslations("pages.partner");
  const tCommon = useTranslations("common");
  const locale = useLocale() as "fr" | "ar";
  const [submitted, setSubmitted] = useState(false);
  const [step, setStep] = useState(1);

  const form = useForm<PartnerFormData>({
    resolver: zodResolver(partnerSchema),
    defaultValues: {
      phone: "+216",
      phoneWhatsapp: "",
    },
    mode: "onBlur",
  });

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors, isSubmitting },
  } = form;

  const onSubmit = async (data: PartnerFormData) => {
    try {
      await agencyApi.create({
        ...data,
        phoneWhatsapp: data.phoneWhatsapp || undefined,
        postalCode: data.postalCode || undefined,
        patenteNumber: data.patenteNumber || undefined,
        rib: data.rib || undefined,
        description: data.description || undefined,
      });
      setSubmitted(true);
      toast.success(t("successTitle"));
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const goNext = async () => {
    const fields = [...STEPS[step - 1].fields] as (keyof PartnerFormData)[];
    const valid = await trigger(fields);
    if (valid) setStep((s) => Math.min(s + 1, 3));
  };

  const goPrev = () => setStep((s) => Math.max(s - 1, 1));

  if (submitted) {
    return (
      <div className="rounded-2xl border bg-card p-8 text-center shadow-sm sm:p-12">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-teal-500/10">
          <CheckCircle2 className="size-10 text-teal-600" />
        </div>
        <h2 className="mt-6 text-2xl font-bold text-foreground">{t("successTitle")}</h2>
        <p className="mx-auto mt-3 max-w-md text-muted-foreground">{t("successDesc")}</p>
        <div className="mx-auto mt-8 max-w-sm rounded-xl border border-dashed bg-muted/30 px-4 py-3 text-sm text-muted-foreground">
          {t("successNote")}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border bg-card p-6 shadow-sm sm:p-8">
      <div className="mb-2">
        <h2 className="text-xl font-bold text-foreground">{t("formTitle")}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t("formSubtitle")}</p>
      </div>

      <StepIndicator currentStep={step} />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {step === 1 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="name">{t("name")} *</Label>
              <Input id="name" className="h-10" {...register("name")} />
              {errors.name && (
                <p className="text-xs text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="description">{t("description")}</Label>
              <Textarea id="description" rows={3} {...register("description")} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email">{t("email")} *</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="email" type="email" className="h-10 ps-10" {...register("email")} />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="phone">{t("phone")} *</Label>
              <div className="relative">
                <Phone className="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="phone"
                  placeholder="+216XXXXXXXX"
                  className="h-10 ps-10"
                  {...register("phone")}
                />
              </div>
              <p className="text-[11px] text-muted-foreground">{t("phoneHint")}</p>
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="phoneWhatsapp">{t("phoneWhatsapp")}</Label>
              <Input
                id="phoneWhatsapp"
                placeholder="+216XXXXXXXX"
                className="h-10"
                {...register("phoneWhatsapp")}
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="governorate">{t("governorate")} *</Label>
              <select
                id="governorate"
                {...register("governorate")}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="">—</option>
                {GOVERNORATES.map((gov) => (
                  <option key={gov} value={gov}>
                    {GOVERNORATE_LABELS[gov as Governorate][locale]}
                  </option>
                ))}
              </select>
              {errors.governorate && (
                <p className="text-xs text-destructive">{errors.governorate.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="city">{t("city")} *</Label>
              <Input id="city" className="h-10" {...register("city")} />
              {errors.city && (
                <p className="text-xs text-destructive">{errors.city.message}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="address">{t("address")} *</Label>
              <Input id="address" className="h-10" {...register("address")} />
              {errors.address && (
                <p className="text-xs text-destructive">{errors.address.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="postalCode">{t("postalCode")}</Label>
              <Input id="postalCode" className="h-10" {...register("postalCode")} />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="patenteNumber">{t("patenteNumber")}</Label>
              <Input id="patenteNumber" className="h-10" {...register("patenteNumber")} />
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="rib">{t("rib")}</Label>
              <Input id="rib" className="h-10" {...register("rib")} />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="ownerFirstName">{t("ownerFirstName")} *</Label>
              <Input id="ownerFirstName" className="h-10" {...register("ownerFirstName")} />
              {errors.ownerFirstName && (
                <p className="text-xs text-destructive">{errors.ownerFirstName.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="ownerLastName">{t("ownerLastName")} *</Label>
              <Input id="ownerLastName" className="h-10" {...register("ownerLastName")} />
              {errors.ownerLastName && (
                <p className="text-xs text-destructive">{errors.ownerLastName.message}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="ownerEmail">{t("ownerEmail")} *</Label>
              <Input id="ownerEmail" type="email" className="h-10" {...register("ownerEmail")} />
              {errors.ownerEmail && (
                <p className="text-xs text-destructive">{errors.ownerEmail.message}</p>
              )}
            </div>

            <div className="space-y-1.5 sm:col-span-2">
              <Label htmlFor="ownerPassword">{t("ownerPassword")} *</Label>
              <Input
                id="ownerPassword"
                type="password"
                className="h-10"
                {...register("ownerPassword")}
              />
              <p className="text-[11px] text-muted-foreground">{t("passwordHint")}</p>
              {errors.ownerPassword && (
                <p className="text-xs text-destructive">{errors.ownerPassword.message}</p>
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col-reverse gap-3 border-t pt-6 sm:flex-row sm:justify-between">
          {step > 1 ? (
            <Button type="button" variant="outline" onClick={goPrev} className="gap-2">
              <ArrowLeft className="size-4" />
              {tCommon("previous")}
            </Button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <Button type="button" onClick={goNext} className="gap-2 sm:ms-auto">
              {tCommon("next")}
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting} className="gap-2 bg-primary sm:ms-auto">
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t("submitting")}
                </>
              ) : (
                <>
                  {t("submit")}
                  <ArrowRight className="size-4" />
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
