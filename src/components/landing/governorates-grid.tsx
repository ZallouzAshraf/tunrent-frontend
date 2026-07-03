"use client";

import { useTranslations, useLocale } from "next-intl";
import { MapPin } from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  GOVERNORATES,
  GOVERNORATE_LABELS,
} from "@/lib/constants/governorates";
import type { Governorate } from "@/types";

const GOVERNORATE_CAR_COUNTS: Partial<Record<Governorate, number>> = {
  tunis: 120,
  ariana: 85,
  sousse: 95,
  sfax: 78,
  nabeul: 62,
  monastir: 55,
  bizerte: 48,
  gabes: 35,
  mahdia: 42,
  kairouan: 28,
};

export function GovernoratesGrid() {
  const t = useTranslations("landing.governorates");
  const locale = useLocale() as "fr" | "ar";

  return (
    <section className="bg-muted/30 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground sm:text-3xl">
            {t("title")}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted-foreground">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
          {GOVERNORATES.map((gov) => {
            const count = GOVERNORATE_CAR_COUNTS[gov as Governorate] ?? 15;
            const label = GOVERNORATE_LABELS[gov as Governorate][locale];

            return (
              <Link
                key={gov}
                href={`/cars?governorate=${gov}`}
                className="group flex flex-col items-center rounded-xl border bg-card p-4 text-center shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-secondary text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <MapPin className="size-5" aria-hidden />
                </div>
                <span className="mt-3 text-sm font-semibold text-foreground group-hover:text-primary">
                  {label}
                </span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {t("carsAvailable", { count })}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
