import type { MarketplaceCarSearchParams } from "@/types";

/** Params sent to the marketplace API (backend-supported only). */
export function toApiSearchParams(
  filters: MarketplaceCarSearchParams,
): MarketplaceCarSearchParams {
  const {
    governorate,
    category,
    start_date,
    end_date,
    min_price,
    max_price,
    transmission,
    has_ac,
    seats,
    sort,
    page,
    limit,
  } = filters;

  return {
    ...(governorate && { governorate }),
    ...(category && { category }),
    ...(start_date && { start_date }),
    ...(end_date && { end_date }),
    ...(min_price !== undefined && { min_price }),
    ...(max_price !== undefined && { max_price }),
    ...(transmission && { transmission }),
    ...(has_ac !== undefined && { has_ac }),
    ...(seats && { seats }),
    ...(sort && { sort }),
    page: page ?? 1,
    limit: limit ?? 12,
  };
}

/** Client-side filter for fields not yet supported by the API. */
export function applyClientFilters<T extends {
  fuelType?: string;
  hasGps?: boolean;
  hasBluetooth?: boolean;
  hasChildSeat?: boolean;
}>(
  cars: T[],
  filters: MarketplaceCarSearchParams,
): T[] {
  return cars.filter((car) => {
    if (filters.fuel_type && car.fuelType !== filters.fuel_type) return false;
    if (filters.has_gps !== undefined && car.hasGps !== filters.has_gps) return false;
    if (filters.has_bluetooth !== undefined && car.hasBluetooth !== filters.has_bluetooth)
      return false;
    if (filters.has_child_seat !== undefined && car.hasChildSeat !== filters.has_child_seat)
      return false;
    return true;
  });
}
