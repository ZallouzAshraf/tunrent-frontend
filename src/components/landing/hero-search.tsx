"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from "next-intl";
import { format, addDays } from "date-fns";
import {
  MapPin,
  Search,
  ShieldCheck,
  Star,
  Car,
  Building2,
} from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { DatePickerField } from "@/components/ui/date-picker";
import {
  SearchToolbarLocationField,
  SEARCH_TOOLBAR_FIELD_HEIGHT,
} from "@/components/marketplace/search-toolbar-field";
import { GOVERNORATES, GOVERNORATE_LABELS } from "@/lib/constants/governorates";
import type { Governorate } from "@/types";

const stats = [
  { key: "statsCars" as const, value: "500+", icon: Car },
  { key: "statsAgencies" as const, value: "50+", icon: Building2 },
  { key: "statsGovernorates" as const, value: "24", icon: MapPin },
] as const;

export function HeroSearch() {
  const t = useTranslations("landing.hero");
  const locale = useLocale() as "fr" | "ar";
  const router = useRouter();

  const today = format(new Date(), "yyyy-MM-dd");
  const defaultEnd = format(addDays(new Date(), 3), "yyyy-MM-dd");

  const [governorate, setGovernorate] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEnd);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (governorate) params.set("governorate", governorate);
    if (startDate) params.set("start_date", startDate);
    if (endDate) params.set("end_date", endDate);
    const query = params.toString();
    router.push(query ? `/cars?${query}` : "/cars");
  };

  return (
    <section className="relative min-h-[92vh] overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80"
        alt=""
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-primary/95 via-primary/85 to-[#0f2744]/90" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,168,83,0.15)_0%,transparent_50%)]" />
      <div className="absolute -end-32 top-20 size-[500px] rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute -bottom-40 -start-40 size-96 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-center px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-4xl text-center">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
            <ShieldCheck className="size-4 text-[var(--tunrent-gold)]" aria-hidden />
            {t("trustedBy")}
          </div>

          <h1 className="text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-white/80 sm:text-xl">
            {t("subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-white/90">
            <span className="inline-flex select-none items-center gap-1.5 text-sm">
              <Star className="size-4 shrink-0 fill-[var(--tunrent-gold)] text-[var(--tunrent-gold)]" />
              4.8/5 {t("ratingLabel")}
            </span>
            <span className="hidden h-4 w-px shrink-0 bg-white/30 sm:block" aria-hidden />
            <span className="select-none text-sm">{t("noHiddenFees")}</span>
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="mx-auto mt-12 w-full max-w-5xl rounded-2xl border border-white/10 bg-background p-4 shadow-2xl sm:p-5"
        >
          <div className="grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-stretch">
            <SearchToolbarLocationField
              id="hero-governorate"
              label={t("governorate")}
              value={governorate}
              onChange={setGovernorate}
              options={[
                { value: "", label: t("governoratePlaceholder") },
                ...GOVERNORATES.map((gov) => ({
                  value: gov,
                  label: GOVERNORATE_LABELS[gov as Governorate][locale],
                })),
              ]}
            />

            <DatePickerField
              id="hero-start-date"
              label={t("startDate")}
              value={startDate}
              min={today}
              onChange={(date) => {
                setStartDate(date);
                if (date > endDate) setEndDate(date);
              }}
            />

            <DatePickerField
              id="hero-end-date"
              label={t("endDate")}
              value={endDate}
              min={startDate || today}
              onChange={setEndDate}
            />

            <Button
              type="submit"
              className={`${SEARCH_TOOLBAR_FIELD_HEIGHT} w-full shrink-0 gap-2 rounded-xl bg-accent px-6 text-sm font-semibold shadow-sm hover:bg-accent/90 lg:w-auto lg:min-w-[148px]`}
            >
              <Search className="size-4" />
              <span className="truncate">{t("searchCta")}</span>
            </Button>
          </div>
        </form>

        <div className="mx-auto mt-12 grid w-full max-w-3xl grid-cols-3 gap-4 sm:gap-8">
          {stats.map(({ key, value, icon: Icon }) => (
            <div
              key={key}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-4 text-center backdrop-blur-sm sm:px-6"
            >
              <Icon className="mx-auto mb-2 size-5 text-[var(--tunrent-gold)]" aria-hidden />
              <p className="text-2xl font-bold text-white sm:text-3xl">{value}</p>
              <p className="mt-1 text-xs text-white/70 sm:text-sm">{t(key)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
