"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { format, addDays } from "date-fns";
import { MapPin, Search, Car, ShieldCheck, CreditCard } from "lucide-react";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePickerField } from "@/components/ui/date-picker";
import { GOVERNORATES, GOVERNORATE_LABELS } from "@/lib/constants/governorates";
import type { Governorate } from "@/types";

export function CarsPageHero() {
  const t = useTranslations("marketplace.cars");
  const locale = useLocale() as "fr" | "ar";
  const router = useRouter();
  const searchParams = useSearchParams();

  const today = format(new Date(), "yyyy-MM-dd");
  const defaultEnd = format(addDays(new Date(), 3), "yyyy-MM-dd");

  const [governorate, setGovernorate] = useState("");
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(defaultEnd);

  useEffect(() => {
    setGovernorate(searchParams.get("governorate") ?? "");
    setStartDate(searchParams.get("start_date") ?? today);
    setEndDate(searchParams.get("end_date") ?? defaultEnd);
  }, [searchParams, today, defaultEnd]);

  const badges = [
    { icon: ShieldCheck, key: "badge1" as const },
    { icon: CreditCard, key: "badge2" as const },
    { icon: MapPin, key: "badge3" as const },
  ] as const;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (governorate) params.set("governorate", governorate);
    else params.delete("governorate");
    if (startDate) params.set("start_date", startDate);
    else params.delete("start_date");
    if (endDate) params.set("end_date", endDate);
    else params.delete("end_date");
    params.delete("page");
    const query = params.toString();
    router.replace(query ? `/cars?${query}` : "/cars", { scroll: false });
    requestAnimationFrame(() => {
      document.getElementById("cars-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <section className="relative overflow-hidden bg-primary pb-16 sm:pb-20">
      <Image
        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1920&q=80"
        alt=""
        fill
        className="object-cover opacity-25"
        sizes="100vw"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-primary/95 via-primary/90 to-primary/85" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,168,83,0.14)_0%,transparent_55%)]" />

      <div className="relative mx-auto max-w-7xl px-4 pt-14 sm:px-6 sm:pt-16 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
            <Car className="size-4 text-[var(--tunrent-gold)]" aria-hidden />
            {t("heroBadge")}
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-white/80 sm:text-lg">
            {t("heroSubtitle")}
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6">
            {badges.map(({ icon: Icon, key }) => (
              <span
                key={key}
                className="inline-flex items-center gap-2 text-sm text-white/85"
              >
                <Icon className="size-4 text-[var(--tunrent-gold)]" aria-hidden />
                {t(key)}
              </span>
            ))}
          </div>
        </div>

        <form
          onSubmit={handleSearch}
          className="relative z-10 mx-auto mt-10 max-w-4xl rounded-2xl border border-white/20 bg-background/95 p-4 shadow-xl backdrop-blur-md sm:p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
              <Label htmlFor="cars-governorate" className="text-xs font-medium text-muted-foreground">
                {t("searchGovernorate")}
              </Label>
              <div className="relative">
                <MapPin className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <select
                  id="cars-governorate"
                  value={governorate}
                  onChange={(e) => setGovernorate(e.target.value)}
                  className="flex h-11 w-full rounded-lg border border-input bg-background ps-9 pe-3 text-sm"
                >
                  <option value="">{t("allGovernorates")}</option>
                  {GOVERNORATES.map((gov) => (
                    <option key={gov} value={gov}>
                      {GOVERNORATE_LABELS[gov as Governorate][locale]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <DatePickerField
              label={t("searchStartDate")}
              value={startDate}
              min={today}
              showTime
              onChange={setStartDate}
            />

            <DatePickerField
              label={t("searchEndDate")}
              value={endDate}
              min={startDate || today}
              showTime
              onChange={setEndDate}
            />

            <div className="flex items-end sm:col-span-2 lg:col-span-1">
              <Button type="submit" size="lg" className="h-11 w-full gap-2">
                <Search className="size-4" />
                {t("searchCta")}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
}
