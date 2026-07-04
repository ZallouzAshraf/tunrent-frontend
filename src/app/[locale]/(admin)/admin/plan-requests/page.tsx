"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Check, CreditCard, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import {
  AdminAgencyAvatar,
  AdminEmptyState,
  AdminPageHeader,
  AdminPagination,
  AdminPanel,
  AdminTableSkeleton,
  AdminToolbar,
} from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui/badge";
import { adminApi, getErrorMessage } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/utils";

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  approved: "Approuvée",
  rejected: "Rejetée",
  cancelled: "Annulée",
};

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-50 text-amber-800 ring-amber-200/80",
  approved: "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
  rejected: "bg-red-50 text-red-800 ring-red-200/80",
  cancelled: "bg-slate-100 text-slate-700 ring-slate-200/80",
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
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Demandes de plan"
        description="Validation des upgrades d'abonnement agence"
        badge={
          pendingCount > 0 ? (
            <Badge variant="secondary" className="rounded-full">
              {pendingCount} en attente
            </Badge>
          ) : undefined
        }
      />

      <AdminToolbar>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="w-full sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="approved">Approuvées</SelectItem>
            <SelectItem value="rejected">Rejetées</SelectItem>
            <SelectItem value="cancelled">Annulées</SelectItem>
          </SelectContent>
        </Select>
      </AdminToolbar>

      {isLoading ? (
        <AdminTableSkeleton rows={5} />
      ) : requests.length === 0 ? (
        <AdminPanel>
          <AdminEmptyState
            title="Aucune demande"
            description="Les demandes de changement de plan apparaîtront ici."
          />
        </AdminPanel>
      ) : (
        <div className="space-y-3">
          {requests.map((req) => (
            <AdminPanel key={req.id} padding="compact">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex gap-4">
                  <AdminAgencyAvatar
                    name={req.agency?.name ?? "Agence"}
                    logoUrl={req.agency?.logoUrl}
                  />
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-lg font-semibold">
                        {req.agency?.name ?? "Agence"}
                      </h2>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${
                          STATUS_STYLES[req.status] ?? STATUS_STYLES.cancelled
                        }`}
                      >
                        {STATUS_LABELS[req.status] ?? req.status}
                      </span>
                    </div>
                    <p className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <CreditCard className="size-4 shrink-0" />
                      <span className="font-medium text-foreground">
                        {req.currentPlan}
                      </span>
                      <span>→</span>
                      <span className="font-medium text-primary">
                        {req.requestedPlan}
                      </span>
                      <span>· {formatPrice(req.monthlyPrice)}/mois</span>
                    </p>
                    {req.note && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Note agence : {req.note}
                      </p>
                    )}
                    {req.adminNote && (
                      <p className="mt-2 text-sm text-muted-foreground">
                        Note admin : {req.adminNote}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-muted-foreground">
                      Demandé le {formatDate(req.createdAt)}
                      {req.requestedBy &&
                        ` par ${req.requestedBy.firstName} ${req.requestedBy.lastName}`}
                    </p>
                  </div>
                </div>

                {req.status === "pending" && (
                  <div className="flex shrink-0 flex-wrap gap-2">
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
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Check className="size-4" />
                      )}
                      Approuver
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      className="gap-1"
                      onClick={() => setRejectId(req.id)}
                    >
                      <X className="size-4" />
                      Rejeter
                    </Button>
                  </div>
                )}
              </div>
            </AdminPanel>
          ))}
        </div>
      )}

      {meta && meta.totalPages > 1 && (
        <AdminPagination
          page={meta.page}
          totalPages={meta.totalPages}
          hasPreviousPage={meta.hasPreviousPage}
          hasNextPage={meta.hasNextPage}
          onPrevious={() => setPage((p) => p - 1)}
          onNext={() => setPage((p) => p + 1)}
          total={meta.total}
        />
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
                <Loader2 className="size-4 animate-spin" />
              )}
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
