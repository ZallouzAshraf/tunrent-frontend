"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

const guestSchema = z.object({
  clientFirstName: z.string().min(2, "Requis"),
  clientLastName: z.string().min(2, "Requis"),
  clientEmail: z.string().email("Email invalide"),
  clientPhone: z
    .string()
    .regex(/^\+216[0-9]{8}$/, "Format: +216XXXXXXXX"),
  clientCin: z
    .string()
    .regex(/^[0-9]{8}$/, "8 chiffres")
    .optional()
    .or(z.literal("")),
  clientDrivingLicense: z.string().max(50).optional().or(z.literal("")),
  clientNotes: z.string().max(500).optional().or(z.literal("")),
});

export type GuestFormValues = z.infer<typeof guestSchema>;

interface GuestFormProps {
  defaultValues?: Partial<GuestFormValues>;
  onSubmit: (values: GuestFormValues) => void;
  disabled?: boolean;
}

export function GuestForm({ defaultValues, onSubmit, disabled }: GuestFormProps) {
  const t = useTranslations("booking");
  const tCommon = useTranslations("common");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GuestFormValues>({
    resolver: zodResolver(guestSchema),
    defaultValues: {
      clientFirstName: "",
      clientLastName: "",
      clientEmail: "",
      clientPhone: "+216",
      clientCin: "",
      clientDrivingLicense: "",
      clientNotes: "",
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="clientFirstName">{t("firstName")}</Label>
          <Input id="clientFirstName" {...register("clientFirstName")} disabled={disabled} />
          {errors.clientFirstName && (
            <p className="mt-1 text-xs text-destructive">{errors.clientFirstName.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="clientLastName">{t("lastName")}</Label>
          <Input id="clientLastName" {...register("clientLastName")} disabled={disabled} />
          {errors.clientLastName && (
            <p className="mt-1 text-xs text-destructive">{errors.clientLastName.message}</p>
          )}
        </div>
      </div>

      <div>
        <Label htmlFor="clientEmail">{t("email")}</Label>
        <Input id="clientEmail" type="email" {...register("clientEmail")} disabled={disabled} />
        {errors.clientEmail && (
          <p className="mt-1 text-xs text-destructive">{errors.clientEmail.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="clientPhone">{t("phone")}</Label>
        <Input id="clientPhone" {...register("clientPhone")} placeholder="+216XXXXXXXX" disabled={disabled} />
        <p className="mt-1 text-xs text-muted-foreground">{t("phoneHint")}</p>
        {errors.clientPhone && (
          <p className="mt-1 text-xs text-destructive">{errors.clientPhone.message}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="clientCin">{t("cin")}</Label>
          <Input id="clientCin" {...register("clientCin")} disabled={disabled} />
          {errors.clientCin && (
            <p className="mt-1 text-xs text-destructive">{errors.clientCin.message}</p>
          )}
        </div>
        <div>
          <Label htmlFor="clientDrivingLicense">{t("license")}</Label>
          <Input id="clientDrivingLicense" {...register("clientDrivingLicense")} disabled={disabled} />
        </div>
      </div>

      <div>
        <Label htmlFor="clientNotes">{t("notes")}</Label>
        <Textarea id="clientNotes" rows={3} {...register("clientNotes")} disabled={disabled} />
      </div>

      <Button type="submit" className="w-full" disabled={disabled || isSubmitting}>
        {tCommon("next")}
      </Button>
    </form>
  );
}
