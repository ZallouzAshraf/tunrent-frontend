"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { adminApi, getErrorMessage } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  approved: "Approuvée",
  rejected: "Rejetée",
  cancelled: "Annulée",
};

export default function AdminPlanRequestsPage() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [adminNote, setAdminNote] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "plan-requests", status, page],
    queryFn: async () =>
      (
        await adminApi.getPlanRequests({
          status: status === "all" ? undefined : status,
          page,
          limit: 20,
        })
      ).data,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "plan-requests"] });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminApi.approvePlanRequest(id),
    onSuccess: () => {
      toast.success("Demande approuvée");
      invalidate();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
    onSettled: () => setActionId(null),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) =>
      adminApi.rejectPlanRequest(id, note),
    onSuccess: () => {
      toast.success("Demande rejetée");
      setRejectId(null);
      setAdminNote("");
      invalidate();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const requests = data?.data ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Demandes de plan</h1>
        <p className="text-muted-foreground">
          Validation des upgrades d&apos;abonnement agence
        </p>
      </div>

      <Select
        value={status}
        onValueChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
      >
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tous</SelectItem>
          <SelectItem value="pending">En attente</SelectItem>
          <SelectItem value="approved">Approuvées</SelectItem>
          <SelectItem value="rejected">Rejetées</SelectItem>
          <SelectItem value="cancelled">Annulées</SelectItem>
        </SelectContent>
      </Select>

      {isLoading ? (
        <Skeleton className="h-64 w-full" />
      ) : requests.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Aucune demande
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <Card key={req.id}>
              <CardHeader className="pb-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {req.agency?.name ?? "Agence"}
                    </CardTitle>
                    <CardDescription>
                      {req.currentPlan} → {req.requestedPlan} ·{" "}
                      {formatPrice(req.monthlyPrice)}/mois
                    </CardDescription>
                    {req.note && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Note agence : {req.note}
                      </p>
                    )}
                    <p className="mt-1 text-xs text-muted-foreground">
                      Demandé le {formatDate(req.createdAt)}
                      {req.requestedBy &&
                        ` par ${req.requestedBy.firstName} ${req.requestedBy.lastName}`}
                    </p>
                  </div>
                  <Badge variant={req.status === "pending" ? "secondary" : "outline"}>
                    {STATUS_LABELS[req.status] ?? req.status}
                  </Badge>
                </div>
              </CardHeader>
              {req.status === "pending" && (
                <CardContent className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    className="gap-1"
                    disabled={actionId === req.id}
                    onClick={() => {
                      setActionId(req.id);
                      approveMutation.mutate(req.id);
                    }}
                  >
                    {actionId === req.id && approveMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Approuver
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    className="gap-1"
                    onClick={() => setRejectId(req.id)}
                  >
                    <X className="h-4 w-4" />
                    Rejeter
                  </Button>
                </CardContent>
              )}
              {req.adminNote && (
                <CardContent className="pt-0 text-sm text-muted-foreground">
                  Note admin : {req.adminNote}
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={!meta.hasPreviousPage}
            onClick={() => setPage((p) => p - 1)}
          >
            Précédent
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {meta.page} / {meta.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={!meta.hasNextPage}
            onClick={() => setPage((p) => p + 1)}
          >
            Suivant
          </Button>
        </div>
      )}

      <Dialog open={!!rejectId} onOpenChange={(o) => !o && setRejectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la demande</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="admin-note">Note (optionnel)</Label>
            <Textarea
              id="admin-note"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectId(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={rejectMutation.isPending}
              onClick={() =>
                rejectId &&
                rejectMutation.mutate({
                  id: rejectId,
                  note: adminNote.trim() || undefined,
                })
              }
            >
              {rejectMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
