import type { PickupLocation } from "@/types";
import type { CarFormValues } from "@/lib/schemas/car";

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

/** Maps API pickup locations to car form values (name required in form schema). */
export function normalizePickupLocationsForForm(
  locations: PickupLocation[],
): CarFormValues["pickupLocations"] {
  return locations.map((loc) => ({
    name: loc.name || loc.city || "Agence principale",
    address: loc.address,
    latitude: loc.latitude ?? loc.lat,
    longitude: loc.longitude ?? loc.lng,
  }));
}
