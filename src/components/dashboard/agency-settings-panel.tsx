"use client";

import Image from "next/image";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Building2,
  Globe,
  Loader2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { StarRating } from "@/components/shared/star-rating";
import { agencyApi, getErrorMessage } from "@/lib/api";
import { cn } from "@/lib/utils";
import type { Agency } from "@/types";

interface AgencyFormValues {
  name: string;
  description: string;
  email: string;
  phone: string;
  phoneWhatsapp: string;
  address: string;
  city: string;
}

function toFormValues(agency?: Agency): AgencyFormValues {
  return {
    name: agency?.name ?? "",
    description: agency?.description ?? "",
    email: agency?.email ?? "",
    phone: agency?.phone ?? "",
    phoneWhatsapp: agency?.phoneWhatsapp ?? "",
    address: agency?.address ?? "",
    city: agency?.city ?? "",
  };
}

function Field({
  label,
  icon: Icon,
  children,
  className,
}: {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {Icon && <Icon className="size-3.5 shrink-0 text-primary/70" />}
        {label}
      </Label>
      {children}
    </div>
  );
}

function ContactRow({
  icon: Icon,
  value,
  iconClassName,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  iconClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2.5 rounded-lg border border-border/60 bg-muted/25 px-2.5 py-2">
      <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary/8">
        <Icon className={cn("size-3.5 text-primary/80", iconClassName)} />
      </div>
      <span className="min-w-0 truncate text-[11px] font-medium text-foreground/85">
        {value}
      </span>
    </div>
  );
}

function AgencyPreview({
  agency,
  values,
}: {
  agency: Agency;
  values: AgencyFormValues;
}) {
  const displayName = values.name.trim() || "Nom de l'agence";
  const initial = displayName.charAt(0).toUpperCase() || "A";
  const hasDescription = Boolean(values.description.trim());

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_8px_30px_rgba(30,58,95,0.08)] ring-1 ring-black/[0.03]">
      {/* Cover */}
      <div className="relative h-28 shrink-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a5f] via-[#254a73] to-[#8b2942]" />
        {agency.coverUrl && (
          <Image
            src={agency.coverUrl}
            alt=""
            fill
            className="object-cover opacity-30"
          />
        )}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(255,255,255,0.22),transparent_50%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(0,0,0,0.35),transparent_60%)]" />

        <div className="absolute inset-x-3 top-3 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
            <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
            Aperçu en direct
          </span>
          <Badge className="border-0 bg-white/15 text-[10px] font-medium text-white backdrop-blur-md hover:bg-white/15">
            Marketplace
          </Badge>
        </div>
      </div>

      {/* Body */}
      <div className="relative flex min-h-0 flex-1 flex-col bg-card px-4 pb-4 pt-0">
        {/* Avatar overlaps cover; name stays fully on white background */}
        <div className="-mt-9">
          {agency.logoUrl ? (
            <div className="relative size-[4.25rem] shrink-0 overflow-hidden rounded-2xl border-[3px] border-card bg-card shadow-[0_4px_14px_rgba(30,58,95,0.18)]">
              <Image
                src={agency.logoUrl}
                alt={displayName}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex size-[4.25rem] shrink-0 items-center justify-center rounded-2xl border-[3px] border-card bg-gradient-to-br from-primary to-primary/85 text-2xl font-bold text-primary-foreground shadow-[0_4px_14px_rgba(30,58,95,0.18)]">
              {initial}
            </div>
          )}
        </div>

        <div className="mt-2.5 min-w-0">
          <h3 className="truncate text-[15px] font-semibold leading-snug tracking-tight text-foreground">
            {displayName}
          </h3>
          <p className="mt-1 flex items-center gap-1 text-[11px] text-muted-foreground">
            <MapPin className="size-3 shrink-0 text-primary/60" />
            <span className="truncate capitalize">
              {values.city.trim() || "Ville non renseignée"}
            </span>
          </p>
        </div>

        {/* Metrics strip */}
        <div className="mt-4 grid grid-cols-3 overflow-hidden rounded-xl border border-border/70 bg-muted/20">
          <div className="flex flex-col items-center gap-0.5 border-e border-border/60 px-2 py-2.5">
            <StarRating
              rating={agency.avgRating ?? 0}
              size="sm"
              showValue
              reviewCount={agency.totalReviews}
            />
          </div>
          <div className="flex flex-col items-center justify-center border-e border-border/60 px-2 py-2.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Plan
            </span>
            <span className="mt-0.5 text-xs font-semibold capitalize text-primary">
              {agency.plan ?? "starter"}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center px-2 py-2.5">
            <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Statut
            </span>
            <span className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Actif
            </span>
          </div>
        </div>

        {agency.isFeatured && (
          <div className="mt-2 flex justify-center">
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--tunrent-gold)]/12 px-2.5 py-0.5 text-[10px] font-semibold text-primary">
              <Sparkles className="size-3 text-[var(--tunrent-gold)]" />
              Agence vedette
            </span>
          </div>
        )}

        {/* Description */}
        <div
          className={cn(
            "mt-3 rounded-xl border px-3 py-2.5",
            hasDescription
              ? "border-border/60 bg-background"
              : "border-dashed border-border/80 bg-muted/15",
          )}
        >
          <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
            Description
          </p>
          <p
            className={cn(
              "mt-1 line-clamp-2 text-[11px] leading-relaxed",
              hasDescription
                ? "text-foreground/80"
                : "italic text-muted-foreground/70",
            )}
          >
            {hasDescription
              ? values.description.trim()
              : "Ajoutez une description pour rassurer vos clients."}
          </p>
        </div>

        {/* Contacts */}
        <div className="mt-3 min-h-0 flex-1 space-y-1.5">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
            Coordonnées visibles
          </p>
          <div className="space-y-1.5">
            <ContactRow
              icon={Mail}
              value={values.email.trim() || "email@agence.tn"}
            />
            <ContactRow
              icon={Phone}
              value={values.phone.trim() || "+216 XX XXX XXX"}
            />
            {values.phoneWhatsapp.trim() && (
              <ContactRow
                icon={MessageCircle}
                value={values.phoneWhatsapp}
                iconClassName="text-[#25D366]"
              />
            )}
            {values.address.trim() && (
              <ContactRow icon={MapPin} value={values.address} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AgencySettingsSkeleton() {
  return (
    <div className="-m-4 flex h-[calc(100dvh-8.5rem)] flex-col gap-4 overflow-hidden lg:-m-6 lg:h-[calc(100dvh-7rem)]">
      <Skeleton className="h-14 w-full rounded-xl" />
      <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[minmax(260px,32%)_1fr]">
        <Skeleton className="h-full rounded-2xl" />
        <Skeleton className="h-full rounded-2xl" />
      </div>
    </div>
  );
}

export function AgencySettingsPanel() {
  const queryClient = useQueryClient();

  const { data: agency, isLoading } = useQuery({
    queryKey: ["dashboard", "agency"],
    queryFn: async () => (await agencyApi.get()).data,
  });

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = useForm<AgencyFormValues>({
    values: toFormValues(agency),
  });

  const values = watch();

  const mutation = useMutation({
    mutationFn: (data: AgencyFormValues) =>
      agencyApi.update(data as unknown as Record<string, unknown>),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "agency"] });
      toast.success("Profil agence mis à jour");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (isLoading || !agency) return <AgencySettingsSkeleton />;

  return (
    <div className="-m-4 flex h-[calc(100dvh-8.5rem)] flex-col overflow-hidden px-1.5 lg:-m-6 lg:h-[calc(100dvh-7rem)] lg:px-1.5">
      {/* Header */}
      <header className="flex shrink-0 items-center justify-between gap-4 border-b bg-card/80 py-3 pe-1 ps-0.5 backdrop-blur-sm lg:pb-4 lg:pt-1">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Building2 className="size-4" />
            </div>
            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold tracking-tight">
                Paramètres agence
              </h1>
              <p className="truncate text-xs text-muted-foreground">
                Profil public ·{" "}
                <span className="font-mono text-primary/80">/{agency.slug}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 pe-1">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={!isDirty || mutation.isPending}
            onClick={() => reset(toFormValues(agency))}
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Annuler</span>
          </Button>
          <Button
            size="sm"
            disabled={!isDirty || mutation.isPending}
            onClick={handleSubmit((d) => mutation.mutate(d))}
          >
            {mutation.isPending ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Save className="size-3.5" />
            )}
            Enregistrer
          </Button>
        </div>
      </header>

      {/* Body */}
      <div className="grid min-h-0 flex-1 gap-4 pt-4 lg:grid-cols-[minmax(260px,32%)_1fr] lg:gap-5">
        {/* Preview */}
        <aside className="hidden min-h-0 lg:block">
          <AgencyPreview agency={agency} values={values} />
        </aside>

        {/* Form */}
        <form
          onSubmit={handleSubmit((d) => mutation.mutate(d))}
          className="flex min-h-0 flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-[0_8px_30px_rgba(30,58,95,0.06)] ring-1 ring-black/[0.03]"
        >
          <div className="shrink-0 border-b border-border/70 bg-muted/15 px-5 py-3.5">
            <p className="text-sm font-semibold tracking-tight">
              Informations publiques
            </p>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Ces données sont affichées sur votre fiche marketplace
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-hidden px-5 py-4">
            <div className="grid h-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-x-5 md:gap-y-3">
              <Field label="Nom de l'agence" icon={Building2} className="md:col-span-2">
                <Input
                  {...register("name")}
                  placeholder="Ex. Auto Prestige Tunis"
                  className="h-9 bg-muted/30"
                />
              </Field>

              <Field label="Description" icon={Globe} className="md:col-span-2">
                <Textarea
                  {...register("description")}
                  rows={2}
                  placeholder="Présentez votre agence en quelques lignes..."
                  className="min-h-[4.5rem] resize-none bg-muted/30"
                />
              </Field>

              <Field label="Email" icon={Mail}>
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="contact@agence.tn"
                  className="h-9 bg-muted/30"
                />
              </Field>

              <Field label="Téléphone" icon={Phone}>
                <Input
                  {...register("phone")}
                  placeholder="+216 XX XXX XXX"
                  className="h-9 bg-muted/30"
                />
              </Field>

              <Field label="WhatsApp" icon={MessageCircle}>
                <Input
                  {...register("phoneWhatsapp")}
                  placeholder="+216 XX XXX XXX"
                  className="h-9 bg-muted/30"
                />
              </Field>

              <Field label="Ville" icon={MapPin}>
                <Input
                  {...register("city")}
                  placeholder="Tunis, Sfax, Sousse..."
                  className="h-9 bg-muted/30"
                />
              </Field>

              <Field label="Adresse" icon={MapPin} className="md:col-span-2">
                <Input
                  {...register("address")}
                  placeholder="Rue, quartier, code postal..."
                  className="h-9 bg-muted/30"
                />
              </Field>
            </div>
          </div>

          <div className="flex shrink-0 items-center justify-between gap-3 border-t bg-muted/20 px-5 py-3 pb-3.5 pe-6">
            <p className="text-xs text-muted-foreground">
              {isDirty
                ? "Modifications non enregistrées"
                : "Tout est à jour"}
            </p>
            <div className="flex items-center gap-2 pe-1 lg:hidden">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={!isDirty || mutation.isPending}
                onClick={() => reset(toFormValues(agency))}
              >
                Annuler
              </Button>
              <Button type="submit" size="sm" disabled={!isDirty || mutation.isPending}>
                {mutation.isPending && (
                  <Loader2 className="size-3.5 animate-spin" />
                )}
                Enregistrer
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
