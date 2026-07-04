"use client";

import { useState, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { format, addDays } from "date-fns";
import { fr, ar } from "date-fns/locale";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { DatePickerField } from "@/components/ui/date-picker";
import {
  SearchToolbarLocationField,
  SEARCH_TOOLBAR_FIELD_HEIGHT,
} from "@/components/marketplace/search-toolbar-field";
import {
  FilterPill,
  FilterRadioOption,
  FilterCheckboxOption,
} from "@/components/marketplace/filter-pill";
import {
  GOVERNORATES,
  GOVERNORATE_LABELS,
  CAR_CATEGORY_LABELS,
} from "@/lib/constants/governorates";
import { CarCategory, FuelType, Transmission } from "@/types";
import type { MarketplaceCarSearchParams } from "@/types";
import type { Governorate } from "@/types";

interface CarsSearchToolbarProps {
  filters: MarketplaceCarSearchParams;
  onChange: (partial: Partial<MarketplaceCarSearchParams>) => void;
  onSearch: (partial: Partial<MarketplaceCarSearchParams>) => void;
  onReset: () => void;
}

type FilterKey =
  | "category"
  | "fuel"
  | "transmission"
  | "price"
  | "seats"
  | "equipment";

type FilterDraft = {
  category?: string;
  fuel_type?: string;
  transmission?: string;
  min_price?: number;
  max_price?: number;
  seats?: number;
  has_ac?: boolean;
  has_gps?: boolean;
  has_bluetooth?: boolean;
  has_child_seat?: boolean;
};

function draftFromFilters(filters: MarketplaceCarSearchParams): FilterDraft {
  return {
    category: filters.category,
    fuel_type: filters.fuel_type,
    transmission: filters.transmission,
    min_price: filters.min_price,
    max_price: filters.max_price,
    seats: filters.seats,
    has_ac: filters.has_ac,
    has_gps: filters.has_gps,
    has_bluetooth: filters.has_bluetooth,
    has_child_seat: filters.has_child_seat,
  };
}

export function CarsSearchToolbar({
  filters,
  onChange,
  onSearch,
  onReset,
}: CarsSearchToolbarProps) {
  const t = useTranslations("marketplace.cars");
  const tFilters = useTranslations("filters");
  const tCommon = useTranslations("common");
  const locale = useLocale() as "fr" | "ar";

  const today = format(new Date(), "yyyy-MM-dd");
  const defaultEnd = format(addDays(new Date(), 3), "yyyy-MM-dd");

  const [openFilter, setOpenFilter] = useState<FilterKey | null>(null);
  const [draft, setDraft] = useState<FilterDraft>(() => draftFromFilters(filters));
  const [draftGov, setDraftGov] = useState(filters.governorate ?? "");
  const [draftStart, setDraftStart] = useState(filters.start_date ?? today);
  const [draftEnd, setDraftEnd] = useState(filters.end_date ?? defaultEnd);
  const [draftSearch, setDraftSearch] = useState(filters.search ?? "");
  const [draftStartTime, setDraftStartTime] = useState("10:00");
  const [draftEndTime, setDraftEndTime] = useState("10:00");

  useEffect(() => {
    setDraftGov(filters.governorate ?? "");
    setDraftStart(filters.start_date ?? today);
    setDraftEnd(filters.end_date ?? defaultEnd);
    setDraftSearch(filters.search ?? "");
  }, [filters.governorate, filters.start_date, filters.end_date, filters.search, today, defaultEnd]);

  const fmtDate = (d: string) =>
    format(new Date(d), "d MMM yyyy", { locale: locale === "ar" ? ar : fr });

  const applyDraft = () => {
    if (!openFilter) return;
    const patch: Partial<MarketplaceCarSearchParams> = { page: 1 };

    switch (openFilter) {
      case "category":
        patch.category = draft.category;
        break;
      case "fuel":
        patch.fuel_type = draft.fuel_type;
        break;
      case "transmission":
        patch.transmission = draft.transmission;
        break;
      case "price":
        patch.min_price = draft.min_price;
        patch.max_price = draft.max_price;
        break;
      case "seats":
        patch.seats = draft.seats;
        break;
      case "equipment":
        patch.has_ac = draft.has_ac || undefined;
        patch.has_gps = draft.has_gps || undefined;
        patch.has_bluetooth = draft.has_bluetooth || undefined;
        patch.has_child_seat = draft.has_child_seat || undefined;
        break;
    }

    onChange(patch);
    setOpenFilter(null);
  };

  const resetDraft = () => {
    if (!openFilter) return;
    switch (openFilter) {
      case "category":
        setDraft((d) => ({ ...d, category: undefined }));
        break;
      case "fuel":
        setDraft((d) => ({ ...d, fuel_type: undefined }));
        break;
      case "transmission":
        setDraft((d) => ({ ...d, transmission: undefined }));
        break;
      case "price":
        setDraft((d) => ({ ...d, min_price: undefined, max_price: undefined }));
        break;
      case "seats":
        setDraft((d) => ({ ...d, seats: undefined }));
        break;
      case "equipment":
        setDraft((d) => ({
          ...d,
          has_ac: undefined,
          has_gps: undefined,
          has_bluetooth: undefined,
          has_child_seat: undefined,
        }));
        break;
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({
      governorate: draftGov || undefined,
      start_date: draftStart || undefined,
      end_date: draftEnd || undefined,
      search: draftSearch.trim() || undefined,
    });
  };

  const hasAdvancedFilters =
    !!filters.category ||
    !!filters.fuel_type ||
    !!filters.transmission ||
    filters.min_price !== undefined ||
    filters.max_price !== undefined ||
    !!filters.seats ||
    !!filters.has_ac ||
    !!filters.has_gps ||
    !!filters.has_bluetooth ||
    !!filters.has_child_seat;

  const pillProps = (key: FilterKey) => ({
    open: openFilter === key,
    onOpenChange: (next: boolean) => {
      if (next) {
        setDraft(draftFromFilters(filters));
        setOpenFilter(key);
      } else {
        setOpenFilter((current) => (current === key ? null : current));
      }
    },
    onApply: applyDraft,
    onReset: resetDraft,
  });

  return (
    <div className="sticky top-16 z-30 border-b bg-background shadow-sm">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <form onSubmit={handleSearchSubmit} className="space-y-2 pt-1">
          <div className="relative">
            <Search className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={draftSearch}
              onChange={(e) => setDraftSearch(e.target.value)}
              placeholder={t("searchPlaceholder")}
              className="h-11 w-full rounded-xl border border-muted-foreground/20 bg-muted/30 ps-9 pe-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/20"
            />
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)_minmax(0,1fr)_auto] lg:items-stretch">
            <SearchToolbarLocationField
              label={t("pickupLocation")}
              value={draftGov}
              onChange={setDraftGov}
              options={[
                { value: "", label: t("allGovernorates") },
                ...GOVERNORATES.map((gov) => ({
                  value: gov,
                  label: GOVERNORATE_LABELS[gov as Governorate][locale],
                })),
              ]}
            />

            <DatePickerField
              label={t("searchStartDate")}
              value={draftStart}
              time={draftStartTime}
              min={today}
              showTime
              onChange={(date, time) => {
                setDraftStart(date);
                if (time) setDraftStartTime(time);
              }}
            />

            <DatePickerField
              label={t("searchEndDate")}
              value={draftEnd}
              time={draftEndTime}
              min={draftStart || today}
              showTime
              onChange={(date, time) => {
                setDraftEnd(date);
                if (time) setDraftEndTime(time);
              }}
            />

            <Button
              type="submit"
              className={`${SEARCH_TOOLBAR_FIELD_HEIGHT} w-full shrink-0 rounded-xl px-6 font-semibold shadow-sm lg:w-auto lg:min-w-[128px]`}
            >
              <Search className="size-4" />
              <span>{t("searchCta")}</span>
            </Button>
          </div>
        </form>

        <div className="mt-3 flex items-center gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <FilterPill
            label={tFilters("category")}
            active={!!filters.category}
            {...pillProps("category")}
          >
            <div className="max-h-56 space-y-0.5 overflow-y-auto">
              {Object.values(CarCategory).map((cat) => (
                <FilterRadioOption
                  key={cat}
                  label={CAR_CATEGORY_LABELS[cat]?.[locale] ?? cat}
                  checked={draft.category === cat}
                  onChange={() =>
                    setDraft((d) => ({
                      ...d,
                      category: d.category === cat ? undefined : cat,
                    }))
                  }
                />
              ))}
            </div>
          </FilterPill>

          <FilterPill
            label={tFilters("fuel")}
            active={!!filters.fuel_type}
            {...pillProps("fuel")}
          >
            <div className="space-y-0.5">
              {Object.values(FuelType).map((fuel) => (
                <FilterCheckboxOption
                  key={fuel}
                  label={fuel}
                  checked={draft.fuel_type === fuel}
                  onChange={() =>
                    setDraft((d) => ({
                      ...d,
                      fuel_type: d.fuel_type === fuel ? undefined : fuel,
                    }))
                  }
                />
              ))}
            </div>
          </FilterPill>

          <FilterPill
            label={tFilters("transmission")}
            active={!!filters.transmission}
            {...pillProps("transmission")}
          >
            <div className="space-y-0.5">
              {[
                { value: Transmission.MANUAL, label: tFilters("manual") },
                { value: Transmission.AUTOMATIC, label: tFilters("automatic") },
              ].map(({ value, label }) => (
                <FilterRadioOption
                  key={value}
                  label={label}
                  checked={draft.transmission === value}
                  onChange={() =>
                    setDraft((d) => ({
                      ...d,
                      transmission: d.transmission === value ? undefined : value,
                    }))
                  }
                />
              ))}
            </div>
          </FilterPill>

          <FilterPill
            label={tFilters("price")}
            active={filters.min_price !== undefined || filters.max_price !== undefined}
            {...pillProps("price")}
          >
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs text-muted-foreground">Min (TND)</Label>
                <input
                  type="number"
                  min={0}
                  placeholder="0"
                  value={draft.min_price ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      min_price: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Max (TND)</Label>
                <input
                  type="number"
                  min={0}
                  placeholder="∞"
                  value={draft.max_price ?? ""}
                  onChange={(e) =>
                    setDraft((d) => ({
                      ...d,
                      max_price: e.target.value ? Number(e.target.value) : undefined,
                    }))
                  }
                  className="mt-1 h-10 w-full rounded-lg border px-3 text-sm"
                />
              </div>
            </div>
          </FilterPill>

          <FilterPill
            label={tFilters("seats")}
            active={!!filters.seats}
            {...pillProps("seats")}
          >
            <div className="space-y-0.5">
              {[4, 5, 6, 7, 8, 9].map((n) => (
                <FilterRadioOption
                  key={n}
                  label={t("seatsOrMore", { count: n })}
                  checked={draft.seats === n}
                  onChange={() =>
                    setDraft((d) => ({
                      ...d,
                      seats: d.seats === n ? undefined : n,
                    }))
                  }
                />
              ))}
            </div>
          </FilterPill>

          <FilterPill
            label={tFilters("equipment")}
            active={
              !!filters.has_ac ||
              !!filters.has_gps ||
              !!filters.has_bluetooth ||
              !!filters.has_child_seat
            }
            {...pillProps("equipment")}
          >
            <div className="space-y-0.5">
              {[
                { key: "has_ac" as const, label: tFilters("hasAc") },
                { key: "has_gps" as const, label: tFilters("hasGps") },
                { key: "has_bluetooth" as const, label: tFilters("hasBluetooth") },
                { key: "has_child_seat" as const, label: tFilters("hasChildSeat") },
              ].map(({ key, label }) => (
                <FilterCheckboxOption
                  key={key}
                  label={label}
                  checked={draft[key] === true}
                  onChange={(checked) =>
                    setDraft((d) => ({ ...d, [key]: checked ? true : undefined }))
                  }
                />
              ))}
            </div>
          </FilterPill>

          {(hasAdvancedFilters || filters.governorate || filters.start_date) && (
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

        {(filters.governorate || filters.start_date) && (
          <p className="mt-2 text-xs text-muted-foreground">
            {filters.governorate &&
              GOVERNORATE_LABELS[filters.governorate as Governorate][locale]}
            {filters.governorate && filters.start_date && " · "}
            {filters.start_date && filters.end_date && (
              <>
                {fmtDate(filters.start_date)} → {fmtDate(filters.end_date)}
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
}
