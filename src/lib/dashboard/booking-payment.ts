import type { Booking, Payment } from "@/types";
import { BookingStatus, PaymentStatus } from "@/types";

export function getCompletedPayments(payments?: Payment[]): Payment[] {
  return (payments ?? []).filter(
    (payment) => payment.status === PaymentStatus.COMPLETED,
  );
}

export function getBookingPaidAmount(payments?: Payment[]): number {
  return getCompletedPayments(payments).reduce(
    (sum, payment) => sum + Number(payment.amount),
    0,
  );
}

export function isBookingFullyPaid(booking: Pick<Booking, "totalPrice" | "payments">): boolean {
  return getBookingPaidAmount(booking.payments) >= Number(booking.totalPrice);
}

export function canMarkBookingPaidCash(status: Booking["status"]): boolean {
  return (
    status === BookingStatus.CONFIRMED ||
    status === BookingStatus.IN_PROGRESS ||
    status === BookingStatus.COMPLETED
  );
}
