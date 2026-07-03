"use client";

import { useState, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import { MapPin, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  FilterPill,
  FilterRadioOption,
  FilterCheckboxOption,
} from "@/components/marketplace/filter-pill";
import { GOVERNORATE_LABELS, GOVERNORATES } from "@/lib/constants/governorates";
import type { Governorate } from "@/types";

type SortOption = "default" | "rating_desc";

interface AgenciesSearchToolbarProps {
  search: string;
  governorate?: string;
  sort: SortOption;
  featuredOnly: boolean;
  onSearchChange: (value: string) => void;
  onGovernorateChange: (gov?: string) => void;
  onSortChange: (sort: SortOption) => void;
  onFeaturedChange: (value: boolean) => void;
  onReset: () => void;
}

type FilterKey = "gov" | "sort" | "featured";

export function AgenciesSearchToolbar({
  search,
  governorate,
  sort,
  featuredOnly,
  onSearchChange,
  onGovernorateChange,
  onSortChange,
  onFeaturedChange,
  onReset,
}: AgenciesSearchToolbarProps) {
  const t = useTranslations("marketplace.agencies");
  const tCommon = useTranslations("common");
  const locale = useLocale() as "fr" | "ar";

  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [draftGov, setDraftGov] = useState<string | undefined>(governorate);
  const [draftSort, setDraftSort] = useState<SortOption>(sort);
  const [draftFeatured, setDraftFeatured] = useState(featuredOnly);

  const openDropdown = useCallback(
    (key: FilterKey) => {
      if (openFilter === key) {
        setOpenFilter(null);
        return;
      }
      setDraftGov(governorate);
      setDraftSort(sort);
      setDraftFeatured(featuredOnly);
      setOpenFilter(key);
    },
    [openFilter, governorate, sort, featuredOnly],
  );

  const applyDraft = () => {
    if (!openFilter) return;
    switch (openFilter) {
      case "gov":
        onGovernorateChange(draftGov);
        break;
      case "sort":
        onSortChange(draftSort);
        break;
      case "featured":
        onFeaturedChange(draftFeatured);
        break;
    }
    setOpenFilter(null);
  };

  const resetDraft = () => {
    if (!openFilter) return;
    switch (openFilter) {
      case "gov":
        setDraftGov(undefined);
        break;
      case "sort":
        setDraftSort("default");
        break;
      case "featured":
        setDraftFeatured(false);
        break;
    }
  };

  const hasFilters = !!governorate || !!search || sort !== "default" || featuredOnly;

  const pillProps = (key: FilterKey) => ({
    open: openFilter === key,
    onOpenChange: () => openDropdown(key),
    onApply: applyDraft,
    onReset: resetDraft,
  });

  return (
    <div className="sticky top-16 z-30 border-b bg-background shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="relative">
          <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="h-11 rounded-xl border-muted-foreground/20 bg-muted/30 ps-9"
          />
        </div>

        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterPill
            label={t("filterGovernorate")}
            active={!!governorate}
            {...pillProps("gov")}
            panelClassName="min-w-[280px]"
          >
            <div className="max-h-52 space-y-0.5 overflow-y-auto">
              <FilterRadioOption
                label={t("allGovernorates")}
                checked={!draftGov}
                onChange={() => setDraftGov(undefined)}
              />
              {GOVERNORATES.map((gov) => (
                <FilterRadioOption
                  key={gov}
                  label={GOVERNORATE_LABELS[gov as Governorate][locale]}
                  checked={draftGov === gov}
                  onChange={() => setDraftGov(gov)}
                />
              ))}
            </div>
          </FilterPill>

          <FilterPill
            label={t("sortLabel")}
            active={sort !== "default"}
            {...pillProps("sort")}
          >
            <div className="space-y-0.5">
              {(
                [
                  { value: "default" as const, label: t("sortDefault") },
                  { value: "rating_desc" as const, label: t("sortRating") },
                ] as const
              ).map(({ value, label }) => (
                <FilterRadioOption
                  key={value}
                  label={label}
                  checked={draftSort === value}
                  onChange={() => setDraftSort(value)}
                />
              ))}
            </div>
          </FilterPill>

          <FilterPill
            label={t("featuredOnly")}
            active={featuredOnly}
            {...pillProps("featured")}
          >
            <FilterCheckboxOption
              label={t("featuredOnly")}
              checked={draftFeatured}
              onChange={setDraftFeatured}
            />
          </FilterPill>

          {hasFilters && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onReset}
              className="h-10 shrink-0 gap-1 text-muted-foreground"
            >
              <X className="size-3.5" />
              {tCommon("reset")}
            </Button>
          )}
        </div>

        {governorate && (
          <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
            <MapPin className="size-3" />
            {GOVERNORATE_LABELS[governorate as Governorate][locale]}
          </p>
        )}
      </div>
    </div>
  );
}
