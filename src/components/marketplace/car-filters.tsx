"use client";

import { useLocale, useTranslations } from "next-intl";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CAR_CATEGORY_LABELS } from "@/lib/constants/governorates";
import { CarCategory, FuelType, Transmission } from "@/types";
import type { MarketplaceCarSearchParams } from "@/types";
import { cn } from "@/lib/utils";

interface CarFiltersProps {
  filters: MarketplaceCarSearchParams;
  onChange: (filters: Partial<MarketplaceCarSearchParams>) => void;
  onReset: () => void;
  className?: string;
  showActions?: boolean;
}

export function CarFilters({
  filters,
  onChange,
  onReset,
  className,
  showActions = true,
}: CarFiltersProps) {
  const t = useTranslations("filters");
  const tCommon = useTranslations("common");
  const locale = useLocale() as "fr" | "ar";

  const categories = Object.values(CarCategory);

  return (
    <div className={cn("space-y-6", className)}>
      <div>
        <Label className="mb-2 block text-sm font-medium">{t("category")}</Label>
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = filters.category === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => onChange({ category: active ? undefined : cat })}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background hover:bg-secondary",
                )}
              >
                {CAR_CATEGORY_LABELS[cat]?.[locale] ?? cat}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">{t("price")} (TND)</Label>
        <div className="grid grid-cols-2 gap-2">
          <input
            type="number"
            min={0}
            placeholder="Min"
            value={filters.min_price ?? ""}
            onChange={(e) =>
              onChange({
                min_price: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
          />
          <input
            type="number"
            min={0}
            placeholder="Max"
            value={filters.max_price ?? ""}
            onChange={(e) =>
              onChange({
                max_price: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="flex h-10 w-full rounded-lg border border-input bg-background px-3 text-sm"
          />
        </div>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">{t("transmission")}</Label>
        <Select
          value={filters.transmission ?? "all"}
          onValueChange={(v) =>
            onChange({ transmission: v === "all" ? undefined : v })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{locale === "ar" ? "الكل" : "Toutes"}</SelectItem>
            <SelectItem value={Transmission.MANUAL}>{t("manual")}</SelectItem>
            <SelectItem value={Transmission.AUTOMATIC}>{t("automatic")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">{t("fuel")}</Label>
        <Select
          value={filters.fuel_type ?? "all"}
          onValueChange={(v) => onChange({ fuel_type: v === "all" ? undefined : v })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{locale === "ar" ? "الكل" : "Tous"}</SelectItem>
            {Object.values(FuelType).map((fuel) => (
              <SelectItem key={fuel} value={fuel}>
                {fuel}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block text-sm font-medium">{t("seats")}</Label>
        <Select
          value={filters.seats?.toString() ?? "all"}
          onValueChange={(v) =>
            onChange({ seats: v === "all" ? undefined : Number(v) })
          }
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{locale === "ar" ? "الكل" : "Tous"}</SelectItem>
            {[2, 4, 5, 7, 9].map((n) => (
              <SelectItem key={n} value={n.toString()}>
                {n}+
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-3 block text-sm font-medium">{t("equipment")}</Label>
        <div className="space-y-3">
          {[
            { key: "has_ac" as const, label: t("hasAc") },
            { key: "has_gps" as const, label: t("hasGps") },
            { key: "has_bluetooth" as const, label: t("hasBluetooth") },
            { key: "has_child_seat" as const, label: t("hasChildSeat") },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={filters[key] === true}
                onCheckedChange={(checked) =>
                  onChange({ [key]: checked === true ? true : undefined })
                }
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2 pt-2">
          <Button variant="outline" className="flex-1" onClick={onReset}>
            {tCommon("reset")}
          </Button>
        </div>
      )}
    </div>
  );
}
