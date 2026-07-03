"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Building2, ArrowRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { marketplaceApi } from "@/lib/api";
import { StarRating } from "@/components/shared/star-rating";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import type { Agency } from "@/types";

function AgencyCard({ agency }: { agency: Agency }) {
  return (
    <Link
      href={`/agencies/${agency.slug}`}
      className="group flex flex-col items-center rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-md"
    >
      <div className="flex size-16 items-center justify-center overflow-hidden rounded-xl bg-secondary">
        {agency.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={agency.logoUrl}
            alt={agency.name}
            className="size-full object-cover"
          />
        ) : (
          <Building2 className="size-8 text-primary/50" />
        )}
      </div>
      <h3 className="mt-4 font-semibold text-foreground group-hover:text-primary">
        {agency.name}
      </h3>
      {agency.city && (
        <p className="mt-1 text-sm text-muted-foreground">{agency.city}</p>
      )}
      {(agency.avgRating ?? 0) > 0 && (
        <div className="mt-2">
          <StarRating rating={agency.avgRating!} size="sm" />
        </div>
      )}
    </Link>
  );
}

export function PartnerAgencies() {
  const t = useTranslations("landing.partners");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["partner-agencies"],
    queryFn: async () => {
      const res = await marketplaceApi.getAgencies({ limit: 8, page: 1 });
      return res.data;
    },
  });

  const agencies = data?.data ?? [];

  return (
    <section className="border-y bg-background py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
              {t("title")}
            </h2>
            <p className="mt-2 text-muted-foreground">{t("subtitle")}</p>
          </div>
          <Button variant="outline" asChild className="gap-2">
            <Link href="/agencies">
              {t("viewAll")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-10">
          {isLoading && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          )}

          {!isLoading && (isError || agencies.length === 0) && (
            <EmptyState icon={Building2} title={t("empty")} />
          )}

          {!isLoading && agencies.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {agencies.map((agency) => (
                <AgencyCard key={agency.id} agency={agency} />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
