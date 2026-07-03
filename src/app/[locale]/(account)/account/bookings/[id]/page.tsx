"use client";

import { use, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { clientApi, getErrorMessage } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import { BookingStatus } from "@/types";

export default function AccountBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [reason, setReason] = useState("");
  const [open, setOpen] = useState(false);

  const { data: booking, isLoading } = useQuery({
    queryKey: ["client", "bookings", id],
    queryFn: async () => {
      try {
        return (await clientApi.getBooking(id)).data;
      } catch {
        const all = (await clientApi.getBookings()).data;
        return all.find((b) => b.id === id) ?? null;
      }
    },
  });

  const cancelMutation = useMutation({
    mutationFn: () => clientApi.cancelBooking(id, reason || undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["client", "bookings"] });
      toast.success("Réservation annulée");
      setOpen(false);
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const canCancel =
    booking &&
    (booking.status === BookingStatus.PENDING ||
      booking.status === BookingStatus.CONFIRMED);

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Réservation introuvable</p>
        <Link href="/account/bookings">
          <Button variant="link">Retour</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/account/bookings"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux réservations
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono">
            {booking.bookingReference}
          </h1>
          <p className="text-muted-foreground">
            Créée le {formatDate(booking.createdAt)}
          </p>
        </div>
        <StatusBadge status={booking.status} type="booking" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Voiture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-lg font-semibold">
              {booking.car?.brand} {booking.car?.model} ({booking.car?.year})
            </p>
            <p className="text-sm text-muted-foreground">
              {booking.totalDays} jour(s) · {formatPrice(booking.pricePerDay)}/j
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dates & lieu</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <span className="text-muted-foreground">Début :</span>{" "}
              {formatDate(booking.startDate)}
            </p>
            <p>
              <span className="text-muted-foreground">Fin :</span>{" "}
              {formatDate(booking.endDate)}
            </p>
            <p>
              <span className="text-muted-foreground">Prise en charge :</span>{" "}
              {booking.pickupLocation}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agence</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{booking.agency?.name}</p>
            {booking.agency?.phone && (
              <p className="text-sm text-muted-foreground">
                {booking.agency.phone}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Paiement</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-primary">
              {formatPrice(booking.totalPrice)}
            </p>
            {booking.depositAmount && (
              <p className="text-sm text-muted-foreground">
                Caution : {formatPrice(booking.depositAmount)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {canCancel && (
        <Card className="border-accent/30">
          <CardHeader>
            <CardTitle className="text-accent">Annuler la réservation</CardTitle>
            <CardDescription>
              Annulation possible selon les conditions de l&apos;agence (J-2
              minimum)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive">Demander l&apos;annulation</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirmer l&apos;annulation</DialogTitle>
                  <DialogDescription>
                    Cette action est irréversible. Indiquez éventuellement une
                    raison.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <Label htmlFor="reason">Raison (optionnel)</Label>
                  <Textarea
                    id="reason"
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Changement de plans..."
                  />
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Retour
                  </Button>
                  <Button
                    variant="destructive"
                    disabled={cancelMutation.isPending}
                    onClick={() => cancelMutation.mutate()}
                  >
                    {cancelMutation.isPending && (
                      <Loader2 className="animate-spin" />
                    )}
                    Confirmer
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
