"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTranslations } from "next-intl";
import { Building2 } from "lucide-react";
import { marketplaceApi } from "@/lib/api";
import { AgenciesSearchToolbar } from "@/components/marketplace/agencies-search-toolbar";
import { AgencyCard } from "@/components/marketplace/agency-card";
import { MarketplacePromoCard } from "@/components/marketplace/marketplace-promo-card";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type SortOption = "default" | "rating_desc";

export function AgenciesPageContent() {
  const t = useTranslations("marketplace.agencies");
  const tCommon = useTranslations("common");

  const [governorate, setGovernorate] = useState<string | undefined>();
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("default");
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchInput.trim()), 350);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, isError, isFetching } = useQuery({
    queryKey: [
      "marketplace-agencies",
      governorate,
      debouncedSearch,
      sort,
      featuredOnly,
      page,
    ],
    queryFn: async () => {
      const res = await marketplaceApi.getAgencies({
        governorate,
        search: debouncedSearch || undefined,
        sort: sort === "rating_desc" ? "rating_desc" : undefined,
        is_featured: featuredOnly || undefined,
        page,
        limit: 12,
      });
      return res.data;
    },
    placeholderData: (previous) => previous,
  });

  const resetFilters = () => {
    setGovernorate(undefined);
    setSearchInput("");
    setDebouncedSearch("");
    setSort("default");
    setFeaturedOnly(false);
    setPage(1);
  };

  const isInitialLoading = isLoading && !data;
  const agencies = data?.data ?? [];

  const gridItems: React.ReactNode[] = [];
  agencies.forEach((agency, index) => {
    if (index === 3 && agencies.length > 4) {
      gridItems.push(<MarketplacePromoCard key="promo" />);
    }
    gridItems.push(<AgencyCard key={agency.id} agency={agency} />);
  });

  return (
    <>
      <AgenciesSearchToolbar
        search={searchInput}
        governorate={governorate}
        sort={sort}
        featuredOnly={featuredOnly}
        onSearchChange={(v) => {
          setSearchInput(v);
          setPage(1);
        }}
        onGovernorateChange={(gov) => {
          setGovernorate(gov);
          setPage(1);
        }}
        onSortChange={(s) => {
          setSort(s);
          setPage(1);
        }}
        onFeaturedChange={(v) => {
          setFeaturedOnly(v);
          setPage(1);
        }}
        onReset={resetFilters}
      />

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {data?.meta !== undefined && (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {t("resultsSummary", { count: data.meta.total })}
            </span>
            {isFetching && !isInitialLoading && (
              <span className="ms-2 text-primary">…</span>
            )}
          </p>
        )}

        {isInitialLoading && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-[280px] rounded-2xl" />
            ))}
          </div>
        )}

        {isError && !data && (
          <div className="mt-8">
            <EmptyState title={tCommon("error")} description={t("loadError")} />
          </div>
        )}

        {!isInitialLoading && !isError && agencies.length === 0 && (
          <div className="mt-8">
            <EmptyState
              icon={Building2}
              title={tCommon("noResults")}
              description={t("emptyHint")}
              actionLabel={tCommon("reset")}
              onAction={resetFilters}
            />
          </div>
        )}

        {!isInitialLoading && agencies.length > 0 && (
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
                  onClick={() => setPage((p) => p - 1)}
                >
                  {tCommon("previous")}
                </Button>
                <span className="text-sm text-muted-foreground">
                  {data.meta.page} / {data.meta.totalPages}
                </span>
                <Button
                  variant="outline"
                  disabled={!data.meta.hasNextPage}
                  onClick={() => setPage((p) => p + 1)}
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
