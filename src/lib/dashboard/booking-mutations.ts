import type { AxiosResponse } from "axios";
import type { QueryClient } from "@tanstack/react-query";
import { getErrorMessage } from "@/lib/api";
import type { Booking } from "@/types";

const BOOKING_ACTION_ERRORS: Record<string, string> = {
  "Only pending bookings can be confirmed":
    "Cette réservation a déjà été traitée. La page a été actualisée.",
  "Only pending bookings can be rejected":
    "Cette réservation ne peut plus être rejetée.",
  "Only confirmed bookings can be started":
    "Cette réservation n'est pas au statut confirmé.",
  "Car is no longer available for the selected dates":
    "Le véhicule n'est plus disponible pour ces dates.",
};

export function getBookingActionErrorMessage(error: unknown): string {
  const raw = getErrorMessage(error);
  return BOOKING_ACTION_ERRORS[raw] ?? raw;
}

export function syncBookingDetailCache(
  queryClient: QueryClient,
  id: string,
  response: AxiosResponse<Booking>,
) {
  queryClient.setQueryData<Booking>(["dashboard", "bookings", id], response.data);
}

export async function refreshBookingQueries(
  queryClient: QueryClient,
  id: string,
) {
  await queryClient.invalidateQueries({ queryKey: ["dashboard", "bookings", id] });
  await queryClient.invalidateQueries({ queryKey: ["dashboard", "bookings"] });
}
