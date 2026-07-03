import { create } from "zustand";
import type { MarketplaceCarSearchParams } from "@/types";

interface FiltersState {
  filters: MarketplaceCarSearchParams;
  setFilters: (filters: Partial<MarketplaceCarSearchParams>) => void;
  resetFilters: () => void;
}

const defaultFilters: MarketplaceCarSearchParams = {
  page: 1,
  limit: 12,
  sort: "price_asc",
};

export const useFiltersStore = create<FiltersState>((set) => ({
  filters: defaultFilters,
  setFilters: (filters) =>
    set((state) => ({
      filters: { ...state.filters, ...filters, page: filters.page ?? 1 },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
}));
