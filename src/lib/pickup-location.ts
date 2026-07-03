import type { PickupLocation } from "@/types";

export function pickupLocationLabel(loc: PickupLocation): string {
  return loc.name || loc.city || loc.address;
}

/** Stable unique value for selects (label alone may repeat across locations). */
export function pickupLocationValue(loc: PickupLocation, index: number): string {
  return `${pickupLocationLabel(loc)}::${loc.address}::${index}`;
}

export function pickupLocationDisplay(loc: PickupLocation): string {
  return `${pickupLocationLabel(loc)} — ${loc.address}`;
}
