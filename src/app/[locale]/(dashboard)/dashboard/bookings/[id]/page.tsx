"use client";

import { use, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Link } from "@/i18n/routing";
import {
  BookingDetailPanel,
  BookingDetailSkeleton,
} from "@/components/dashboard/booking-detail-panel";
import {
  getBookingActionErrorMessage,
  refreshBookingQueries,
  syncBookingDetailCache,
} from "@/lib/dashboard/booking-mutations";
import { Button } from "@/components/ui/button";
import { dashboardApi } from "@/lib/api";

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
    refetchOnWindowFocus: true,
  });

  const handleMutationSuccess = async (
    response: Awaited<ReturnType<typeof dashboardApi.confirmBooking>>,
    message: string,
  ) => {
    syncBookingDetailCache(queryClient, id, response);
    await refreshBookingQueries(queryClient, id);
    toast.success(message);
  };

  const handleMutationError = async (error: unknown) => {
    await refreshBookingQueries(queryClient, id);
    toast.error(getBookingActionErrorMessage(error));
  };

  const confirmMutation = useMutation({
    mutationFn: () => dashboardApi.confirmBooking(id),
    onSuccess: (response) =>
      handleMutationSuccess(response, "Réservation confirmée"),
    onError: handleMutationError,
  });

  const rejectMutation = useMutation({
    mutationFn: () => dashboardApi.rejectBooking(id, rejectReason),
    onSuccess: async (response) => {
      syncBookingDetailCache(queryClient, id, response);
      await refreshBookingQueries(queryClient, id);
      setRejectOpen(false);
      setRejectReason("");
      toast.success("Réservation rejetée");
    },
    onError: handleMutationError,
  });

  const startMutation = useMutation({
    mutationFn: () => dashboardApi.startBooking(id),
    onSuccess: (response) =>
      handleMutationSuccess(response, "Location démarrée"),
    onError: handleMutationError,
  });

  const completeMutation = useMutation({
    mutationFn: () => dashboardApi.completeBooking(id),
    onSuccess: (response) =>
      handleMutationSuccess(response, "Location terminée"),
    onError: handleMutationError,
  });

  const cancelMutation = useMutation({
    mutationFn: () => dashboardApi.cancelBooking(id),
    onSuccess: (response) =>
      handleMutationSuccess(response, "Réservation annulée"),
    onError: handleMutationError,
  });

  const markPaidMutation = useMutation({
    mutationFn: () => dashboardApi.markBookingPaidCash(id),
    onSuccess: async (response) => {
      syncBookingDetailCache(queryClient, id, response);
      await refreshBookingQueries(queryClient, id);
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "payments"] });
      await queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
      toast.success("Paiement espèces enregistré — ajouté au CA");
    },
    onError: handleMutationError,
  });

  const isMutating =
    confirmMutation.isPending ||
    rejectMutation.isPending ||
    startMutation.isPending ||
    completeMutation.isPending ||
    cancelMutation.isPending ||
    markPaidMutation.isPending;

  if (isLoading) return <BookingDetailSkeleton />;

  if (!booking) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <p className="text-lg font-medium">Réservation introuvable</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Cette réservation n&apos;existe pas ou a été supprimée.
        </p>
        <Button asChild className="mt-6">
          <Link href="/dashboard/bookings">Retour aux réservations</Link>
        </Button>
      </div>
    );
  }

  return (
    <BookingDetailPanel
      booking={booking}
      rejectOpen={rejectOpen}
      rejectReason={rejectReason}
      onRejectOpenChange={setRejectOpen}
      onRejectReasonChange={setRejectReason}
      onConfirm={() => confirmMutation.mutate()}
      onReject={() => rejectMutation.mutate()}
      onStart={() => startMutation.mutate()}
      onComplete={() => completeMutation.mutate()}
      onCancel={() => cancelMutation.mutate()}
      onMarkPaidCash={() => markPaidMutation.mutate()}
      isConfirming={confirmMutation.isPending}
      isRejecting={rejectMutation.isPending}
      isStarting={startMutation.isPending}
      isCompleting={completeMutation.isPending}
      isCancelling={cancelMutation.isPending}
      isMarkingPaid={markPaidMutation.isPending}
      actionsDisabled={isMutating}
    />
  );
}
