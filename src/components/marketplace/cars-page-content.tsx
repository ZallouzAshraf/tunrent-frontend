"use client";

import { Suspense, useEffect, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { Car, ArrowUpDown } from "lucide-react";
import { marketplaceApi } from "@/lib/api";
import { useFiltersStore } from "@/stores/filters-store";
import { toApiSearchParams, applyClientFilters } from "@/lib/marketplace/filters";
import { CarsSearchToolbar } from "@/components/marketplace/cars-search-toolbar";
import { CarCard } from "@/components/marketplace/car-card";
import { MarketplacePromoCard } from "@/components/marketplace/marketplace-promo-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MarketplaceSort } from "@/types";
import type { MarketplaceCarSearchParams } from "@/types";
import { daysBetween, cn } from "@/lib/utils";

export function CarsPageContent() {
  return (
    <Suspense fallback={<CarsPageSkeleton />}>
      <CarsPageContentInner />
    </Suspense>
  );
}

function CarsPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-[340px] rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

function CarsPageContentInner() {
  const t = useTranslations("marketplace.cars");
  const tMarket = useTranslations("marketplace");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const searchParams = useSearchParams();
  const { filters, setFilters, resetFilters } = useFiltersStore();

  useEffect(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((value, key) => {
      params[key] = value;
    });
    if (Object.keys(params).length > 0) {
      setFilters({
        governorate: params.governorate,
        category: params.category,
        start_date: params.start_date,
        end_date: params.end_date,
        min_price: params.min_price ? Number(params.min_price) : undefined,
        max_price: params.max_price ? Number(params.max_price) : undefined,
        transmission: params.transmission,
        fuel_type: params.fuel_type,
        has_ac: params.has_ac === "true" ? true : undefined,
        has_gps: params.has_gps === "true" ? true : undefined,
        has_bluetooth: params.has_bluetooth === "true" ? true : undefined,
        has_child_seat: params.has_child_seat === "true" ? true : undefined,
        seats: params.seats ? Number(params.seats) : undefined,
        sort: params.sort ?? "price_asc",
        page: params.page ? Number(params.page) : 1,
      });
    }
  }, [searchParams, setFilters]);

  const apiParams = useMemo(() => toApiSearchParams(filters), [filters]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: ["marketplace-cars", apiParams],
    queryFn: async () => {
      const res = await marketplaceApi.getCars(apiParams);
      return res.data;
    },
    placeholderData: (previous) => previous,
  });

  const cars = useMemo(
    () => applyClientFilters(data?.data ?? [], filters),
    [data?.data, filters],
  );

  const rentalDays = useMemo(() => {
    if (!filters.start_date || !filters.end_date) return null;
    return daysBetween(filters.start_date, filters.end_date);
  }, [filters.start_date, filters.end_date]);

  const syncUrl = (nextFilters: MarketplaceCarSearchParams) => {
    const params = new URLSearchParams();
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && key !== "limit") {
        params.set(key, String(value));
      }
    });
    const query = params.toString();
    router.replace(query ? `/cars?${query}` : "/cars", { scroll: false });
  };

  const handleFilterChange = (partial: Partial<MarketplaceCarSearchParams>) => {
    const next = { ...filters, ...partial, page: partial.page ?? 1 };
    setFilters(next);
    syncUrl(next);
  };

  const handleSearch = (partial: Partial<MarketplaceCarSearchParams>) => {
    const next = { ...filters, ...partial, page: 1 };
    setFilters(next);
    syncUrl(next);
    requestAnimationFrame(() => {
      document.getElementById("cars-results")?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  const handleReset = () => {
    resetFilters();
    router.replace("/cars", { scroll: false });
  };

  const isInitialLoading = isLoading && !data;

  const gridItems = useMemo(() => {
    const items: React.ReactNode[] = [];
    cars.forEach((car, index) => {
      if (index === 3 && cars.length > 4) {
        items.push(<MarketplacePromoCard key="promo" />);
      }
      items.push(<CarCard key={car.id} car={car} />);
    });
    return items;
  }, [cars]);

  return (
    <>
      <CarsSearchToolbar
        filters={filters}
        onChange={handleFilterChange}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <section
        id="cars-results"
        className="mx-auto max-w-7xl scroll-mt-36 px-4 py-6 sm:px-6 lg:px-8"
      >
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {data?.meta !== undefined && (
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">
                  {t("resultsSummary", { count: data.meta.total })}
                </span>
                {rentalDays && (
                  <span className="ms-1">
                    {t("forDays", { days: rentalDays })}
                  </span>
                )}
                {isFetching && !isInitialLoading && (
                  <span className="ms-2 text-primary">…</span>
                )}
              </p>
            )}
          </div>
          <Select
            value={filters.sort ?? MarketplaceSort.PRICE_ASC}
            onValueChange={(sort) => handleFilterChange({ sort })}
          >
            <SelectTrigger className="h-9 w-full gap-2 border-muted-foreground/20 sm:w-[200px]">
              <ArrowUpDown className="size-3.5 text-muted-foreground" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={MarketplaceSort.PRICE_ASC}>
                {tMarket("sortPriceAsc")}
              </SelectItem>
              <SelectItem value={MarketplaceSort.PRICE_DESC}>
                {tMarket("sortPriceDesc")}
              </SelectItem>
              <SelectItem value={MarketplaceSort.RATING_DESC}>
                {tMarket("sortRating")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isInitialLoading && <CarsPageSkeleton />}

        {isError && !data && (
          <div className="mt-8">
            <EmptyState title={tCommon("error")} description={t("loadError")} />
          </div>
        )}

        {!isInitialLoading && !isError && cars.length === 0 && (
          <div className="mt-8">
            <EmptyState
              icon={Car}
              title={tMarket("emptyCars")}
              description={tMarket("emptyCarsHint")}
              actionLabel={tCommon("reset")}
              onAction={handleReset}
            />
          </div>
        )}

        {!isInitialLoading && cars.length > 0 && (
          <>
            <div
              className={cn(
                "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
                isFetching && "opacity-70 transition-opacity",
              )}
            >
              {gridItems}
            </div>

            {data?.meta && data.meta.totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  disabled={!data.meta.hasPreviousPage}
                  onClick={() => handleFilterChange({ page: (filters.page ?? 1) - 1 })}
                >
                  {tCommon("previous")}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {data.meta.page} / {data.meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={!data.meta.hasNextPage}
                  onClick={() => handleFilterChange({ page: (filters.page ?? 1) + 1 })}
                >
                  {tCommon("next")}
                </Button>
              </div>
            )}
          </>
        )}
      </section>
    </>
  );
}
