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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { dashboardApi, getErrorMessage } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";
import { BookingStatus } from "@/types";

export default function DashboardBookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const queryClient = useQueryClient();
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState("");

  const { data: booking, isLoading } = useQuery({
    queryKey: ["dashboard", "bookings", id],
    queryFn: async () => (await dashboardApi.getBooking(id)).data,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["dashboard", "bookings"] });

  const confirmMutation = useMutation({
    mutationFn: () => dashboardApi.confirmBooking(id),
    onSuccess: () => {
      invalidate();
      toast.success("Réservation confirmée");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const rejectMutation = useMutation({
    mutationFn: () => dashboardApi.rejectBooking(id, rejectReason),
    onSuccess: () => {
      invalidate();
      setRejectOpen(false);
      toast.success("Réservation rejetée");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const startMutation = useMutation({
    mutationFn: () => dashboardApi.startBooking(id),
    onSuccess: () => {
      invalidate();
      toast.success("Location démarrée");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const completeMutation = useMutation({
    mutationFn: () => dashboardApi.completeBooking(id),
    onSuccess: () => {
      invalidate();
      toast.success("Location terminée");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  const cancelMutation = useMutation({
    mutationFn: () => dashboardApi.cancelBooking(id),
    onSuccess: () => {
      invalidate();
      toast.success("Réservation annulée");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  if (isLoading) return <Skeleton className="h-96" />;
  if (!booking) return <p>Réservation introuvable</p>;

  const pending = booking.status === BookingStatus.PENDING;
  const confirmed = booking.status === BookingStatus.CONFIRMED;
  const inProgress = booking.status === BookingStatus.IN_PROGRESS;

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/bookings"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour
      </Link>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold font-mono">
            {booking.bookingReference}
          </h1>
          <p className="text-muted-foreground">
            {formatDate(booking.createdAt)}
          </p>
        </div>
        <StatusBadge status={booking.status} type="booking" />
      </div>

      <div className="flex flex-wrap gap-2">
        {pending && (
          <>
            <Button
              onClick={() => confirmMutation.mutate()}
              disabled={confirmMutation.isPending}
            >
              {confirmMutation.isPending && (
                <Loader2 className="animate-spin" />
              )}
              Confirmer
            </Button>
            <Button
              variant="destructive"
              onClick={() => setRejectOpen(true)}
            >
              Rejeter
            </Button>
          </>
        )}
        {confirmed && (
          <Button
            onClick={() => startMutation.mutate()}
            disabled={startMutation.isPending}
          >
            Démarrer la location
          </Button>
        )}
        {inProgress && (
          <Button
            onClick={() => completeMutation.mutate()}
            disabled={completeMutation.isPending}
          >
            Terminer
          </Button>
        )}
        {(pending || confirmed) && (
          <Button
            variant="outline"
            onClick={() => cancelMutation.mutate()}
            disabled={cancelMutation.isPending}
          >
            Annuler
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Client</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">
              {booking.clientFirstName} {booking.clientLastName}
            </p>
            <p>{booking.clientEmail}</p>
            <p>{booking.clientPhone}</p>
            {booking.clientCin && <p>CIN : {booking.clientCin}</p>}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Voiture & dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p className="font-medium">
              {booking.car?.brand} {booking.car?.model}
            </p>
            <p>
              {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
            </p>
            <p>{booking.totalDays} jour(s)</p>
            <p className="font-semibold text-primary">
              {formatPrice(booking.totalPrice)}
            </p>
          </CardContent>
        </Card>
        {booking.agencyNotes && (
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Notes internes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{booking.agencyNotes}</p>
            </CardContent>
          </Card>
        )}
      </div>

      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la réservation</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label>Raison</Label>
            <Textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Indisponibilité, documents manquants..."
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={!rejectReason || rejectMutation.isPending}
              onClick={() => rejectMutation.mutate()}
            >
              Rejeter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
