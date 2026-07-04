import type { MarketplaceCarSearchParams } from "@/types";

/** Strips empty values before sending to the marketplace API. */
export function toApiSearchParams(
  filters: MarketplaceCarSearchParams,
): MarketplaceCarSearchParams {
  const params: MarketplaceCarSearchParams = {
    page: filters.page ?? 1,
    limit: filters.limit ?? 12,
  };

  if (filters.governorate) params.governorate = filters.governorate;
  if (filters.category) params.category = filters.category;
  if (filters.start_date) params.start_date = filters.start_date;
  if (filters.end_date) params.end_date = filters.end_date;
  if (filters.min_price !== undefined) params.min_price = filters.min_price;
  if (filters.max_price !== undefined) params.max_price = filters.max_price;
  if (filters.transmission) params.transmission = filters.transmission;
  if (filters.fuel_type) params.fuel_type = filters.fuel_type;
  if (filters.has_ac !== undefined) params.has_ac = filters.has_ac;
  if (filters.has_gps !== undefined) params.has_gps = filters.has_gps;
  if (filters.has_bluetooth !== undefined) params.has_bluetooth = filters.has_bluetooth;
  if (filters.has_child_seat !== undefined) params.has_child_seat = filters.has_child_seat;
  if (filters.seats) params.seats = filters.seats;
  if (filters.search?.trim()) params.search = filters.search.trim();
  if (filters.sort) params.sort = filters.sort;

  return params;
}
