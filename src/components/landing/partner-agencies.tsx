"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import {
  ArrowRight,
  Building2,
  MapPin,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { marketplaceApi } from "@/lib/api";
import { GOVERNORATE_LABELS } from "@/lib/constants/governorates";
import { StarRating } from "@/components/shared/star-rating";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { Agency, Governorate } from "@/types";

const COVER_GRADIENTS = [
  "from-[#1e3a5f] via-[#2d5a8e] to-[#4a90c2]",
  "from-[#0f766e] via-[#14b8a6] to-[#5eead4]",
  "from-[#7c3aed] via-[#8b5cf6] to-[#c4b5fd]",
  "from-[#b45309] via-[#d97706] to-[#fbbf24]",
] as const;

function coverGradientForAgency(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COVER_GRADIENTS[Math.abs(hash) % COVER_GRADIENTS.length];
}

function PartnerAgencyCard({
  agency,
  locale,
}: {
  agency: Agency;
  locale: "fr" | "ar";
}) {
  const t = useTranslations("landing.partners");
  const governorateLabel = agency.governorate
    ? GOVERNORATE_LABELS[agency.governorate as Governorate]?.[locale]
    : null;
  const location = [agency.city, governorateLabel].filter(Boolean).join(", ");
  const gradient = coverGradientForAgency(agency.id);
  const hasRating = (agency.avgRating ?? 0) > 0;

  return (
    <Link
      href={`/agencies/${agency.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-xl border border-black/[0.06] bg-card shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-md"
    >
      <div className="relative h-16 shrink-0">
        <div className="absolute inset-0 overflow-hidden">
          {agency.coverUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={agency.coverUrl}
              alt=""
              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className={cn("relative size-full bg-gradient-to-br", gradient)}>
              <div className="absolute -end-4 -top-4 size-14 rounded-full bg-white/10" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

          {agency.isFeatured && (
            <span className="absolute start-2 top-2 inline-flex items-center gap-0.5 rounded-md bg-[var(--tunrent-gold,#f5c542)] px-1.5 py-0.5 text-[9px] font-bold uppercase text-primary">
              <Sparkles className="size-2.5" />
              {t("featured")}
            </span>
          )}
        </div>

        <div className="absolute -bottom-5 start-3 z-10">
          <div className="flex size-10 items-center justify-center overflow-hidden rounded-lg border-2 border-background bg-background shadow-sm">
            {agency.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={agency.logoUrl}
                alt={agency.name}
                className="size-full object-cover"
              />
            ) : (
              <span className="text-sm font-bold text-primary">
                {agency.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-3 pb-3 pt-7">
        <h3 className="line-clamp-1 text-sm font-semibold text-foreground group-hover:text-primary">
          {agency.name}
        </h3>

        {location && (
          <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3 shrink-0 text-primary/60" />
            <span className="line-clamp-1">{location}</span>
          </p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2.5">
          {hasRating ? (
            <StarRating
              rating={agency.avgRating!}
              size="sm"
              showValue
              reviewCount={agency.totalReviews}
            />
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700">
              <ShieldCheck className="size-3 text-emerald-600" />
              {t("verified")}
            </span>
          )}

          <ArrowRight className="size-3.5 shrink-0 text-primary opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </div>
    </Link>
  );
}

function PartnerAgencyCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Skeleton className="h-16 w-full rounded-none" />
      <div className="space-y-2 px-3 pb-3 pt-7">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

export function PartnerAgencies() {
  const t = useTranslations("landing.partners");
  const locale = useLocale() as "fr" | "ar";

  const { data, isLoading, isError } = useQuery({
    queryKey: ["partner-agencies"],
    queryFn: async () => {
      const res = await marketplaceApi.getAgencies({ limit: 10, page: 1 });
      return res.data;
    },
  });

  const agencies = data?.data ?? [];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-muted/40 via-background to-background py-14 sm:py-16">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.35]"
        aria-hidden
      >
        <div className="absolute -start-24 top-0 size-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -end-24 bottom-0 size-72 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
              <ShieldCheck className="size-3 text-emerald-600" />
              {t("badge")}
            </span>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("subtitle")}</p>
          </div>

          <Button variant="outline" size="sm" asChild className="gap-2 shrink-0">
            <Link href="/agencies">
              {t("viewAll")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-8">
          {isLoading && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <PartnerAgencyCardSkeleton key={i} />
              ))}
            </div>
          )}

          {!isLoading && (isError || agencies.length === 0) && (
            <EmptyState icon={Building2} title={t("empty")} />
          )}

          {!isLoading && agencies.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {agencies.map((agency) => (
                <PartnerAgencyCard key={agency.id} agency={agency} locale={locale} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
