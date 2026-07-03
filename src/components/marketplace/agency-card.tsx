"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { MapPin, Car, Sparkles } from "lucide-react";
import { Link } from "@/i18n/routing";
import { StarRating } from "@/components/shared/star-rating";
import { GOVERNORATE_LABELS } from "@/lib/constants/governorates";
import type { Agency, Governorate } from "@/types";
import { cn } from "@/lib/utils";

interface AgencyCardProps {
  agency: Agency & { availableCarsCount?: number };
  className?: string;
}

export function AgencyCard({ agency, className }: AgencyCardProps) {
  const locale = useLocale() as "fr" | "ar";
  const t = useTranslations("marketplace.agencies");
  const governorateLabel = agency.governorate
    ? GOVERNORATE_LABELS[agency.governorate as Governorate]?.[locale]
    : null;

  return (
    <Link href={`/agencies/${agency.slug}`} className="group block h-full">
      <article
        className={cn(
          "flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition-all hover:border-primary/30 hover:shadow-md",
          className,
        )}
      >
        <div className="relative mx-3 mt-3 flex h-32 items-center justify-center overflow-hidden rounded-xl bg-muted/60 p-4">
          {agency.logoUrl ? (
            <div className="relative size-20 overflow-hidden rounded-xl border-2 border-background bg-background shadow-sm">
              <Image
                src={agency.logoUrl}
                alt={agency.name}
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <div className="flex size-20 items-center justify-center rounded-xl bg-primary text-2xl font-bold text-primary-foreground shadow-sm">
              {agency.name.charAt(0)}
            </div>
          )}
          {agency.isFeatured && (
            <span className="absolute start-2 top-2 inline-flex items-center gap-1 rounded-md bg-[var(--tunrent-gold)] px-2 py-0.5 text-[10px] font-bold text-primary">
              <Sparkles className="size-3" />
              {t("featuredBadge")}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-4 pt-3">
          <h3 className="truncate text-sm font-bold uppercase tracking-wide text-foreground group-hover:text-primary">
            {agency.name}
          </h3>

          {(agency.city || governorateLabel) && (
            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="size-3 shrink-0 text-primary/70" />
              <span className="truncate">
                {[agency.city, governorateLabel].filter(Boolean).join(", ")}
              </span>
            </p>
          )}

          {agency.description && (
            <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
              {agency.description}
            </p>
          )}

          <div className="mt-auto flex items-end justify-between gap-2 pt-4">
            <StarRating
              rating={agency.avgRating ?? 0}
              size="sm"
              showValue
              reviewCount={agency.totalReviews}
            />
            {agency.availableCarsCount !== undefined && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground">
                <Car className="size-3.5" />
                {agency.availableCarsCount} {t("carsLabel")}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  );
}
