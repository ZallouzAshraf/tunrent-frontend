"use client";

import { useTranslations } from "next-intl";
import { SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CarFilters } from "@/components/marketplace/car-filters";
import type { MarketplaceCarSearchParams } from "@/types";

interface CarFiltersDrawerProps {
  filters: MarketplaceCarSearchParams;
  onChange: (filters: Partial<MarketplaceCarSearchParams>) => void;
  onReset: () => void;
  onApply?: () => void;
}

export function CarFiltersDrawer({
  filters,
  onChange,
  onReset,
  onApply,
}: CarFiltersDrawerProps) {
  const t = useTranslations("common");

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="sm" className="lg:hidden">
          <SlidersHorizontal className="h-4 w-4" />
          {t("filters")}
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-full max-w-sm overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{t("filters")}</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <CarFilters
            filters={filters}
            onChange={onChange}
            onReset={onReset}
            showActions={false}
          />
          <div className="mt-6 flex gap-2">
            <Button variant="outline" className="flex-1" onClick={onReset}>
              {t("reset")}
            </Button>
            <SheetTrigger asChild>
              <Button className="flex-1" onClick={onApply}>
                {t("apply")}
              </Button>
            </SheetTrigger>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
