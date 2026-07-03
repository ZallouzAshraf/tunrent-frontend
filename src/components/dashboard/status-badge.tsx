import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BookingStatus, CarStatus } from "@/types";

const bookingLabels: Record<BookingStatus, string> = {
  [BookingStatus.PENDING]: "En attente",
  [BookingStatus.CONFIRMED]: "Confirmée",
  [BookingStatus.REJECTED]: "Rejetée",
  [BookingStatus.IN_PROGRESS]: "En cours",
  [BookingStatus.COMPLETED]: "Terminée",
  [BookingStatus.CANCELLED]: "Annulée",
};

const bookingVariants: Record<
  BookingStatus,
  "default" | "secondary" | "destructive" | "success" | "warning" | "outline"
> = {
  [BookingStatus.PENDING]: "warning",
  [BookingStatus.CONFIRMED]: "success",
  [BookingStatus.REJECTED]: "destructive",
  [BookingStatus.IN_PROGRESS]: "default",
  [BookingStatus.COMPLETED]: "secondary",
  [BookingStatus.CANCELLED]: "outline",
};

const carLabels: Record<CarStatus, string> = {
  [CarStatus.AVAILABLE]: "Disponible",
  [CarStatus.RENTED]: "Louée",
  [CarStatus.MAINTENANCE]: "Maintenance",
  [CarStatus.INACTIVE]: "Inactive",
};

const carVariants: Record<
  CarStatus,
  "default" | "secondary" | "destructive" | "success" | "warning" | "outline"
> = {
  [CarStatus.AVAILABLE]: "success",
  [CarStatus.RENTED]: "default",
  [CarStatus.MAINTENANCE]: "warning",
  [CarStatus.INACTIVE]: "outline",
};

export function StatusBadge({
  status,
  type = "booking",
  className,
}: {
  status: BookingStatus | CarStatus | string;
  type?: "booking" | "car";
  className?: string;
}) {
  if (type === "car") {
    const s = status as CarStatus;
    return (
      <Badge variant={carVariants[s] ?? "outline"} className={cn(className)}>
        {carLabels[s] ?? status}
      </Badge>
    );
  }

  const s = status as BookingStatus;
  return (
    <Badge variant={bookingVariants[s] ?? "outline"} className={cn(className)}>
      {bookingLabels[s] ?? status}
    </Badge>
  );
}
