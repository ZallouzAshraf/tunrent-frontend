"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import {
  Ban,
  Check,
  Loader2,
  MapPin,
  Search,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import {
  AdminAgencyAvatar,
  AdminEmptyState,
  AdminPageHeader,
  AdminPagination,
  AdminPanel,
  AdminStatusBadge,
  AdminTableSkeleton,
  AdminToolbar,
} from "@/components/admin/admin-ui";
import { adminApi, getErrorMessage } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { AgencyStatus } from "@/types";

const STATUS_LABELS: Record<string, string> = {
  pending_validation: "En attente",
  active: "Active",
  suspended: "Suspendue",
  rejected: "Rejetée",
};

export default function AdminAgenciesPage() {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(searchParams.get("status") ?? "all");
  const [page, setPage] = useState(1);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [actionId, setActionId] = useState<string | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "agencies", status, search, page],
    queryFn: async () =>
      (
        await adminApi.getAgencies({
          status: status === "all" ? undefined : status,
          search: search.trim() || undefined,
          page,
          limit: 20,
        })
      ).data,
  });

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin", "agencies"] });

  const approveMutation = useMutation({
    mutationFn: (id: string) => adminApi.approveAgency(id),
    onSuccess: () => {
      toast.success("Agence approuvée");
      invalidate();
      queryClient.invalidateQueries({ queryKey: ["admin", "stats"] });
    },
    onError: (err) => toast.error(getErrorMessage(err)),
    onSettled: () => setActionId(null),
  });

  const suspendMutation = useMutation({
    mutationFn: (id: string) => adminApi.suspendAgency(id),
    onSuccess: () => {
      toast.success("Agence suspendue");
      invalidate();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
    onSettled: () => setActionId(null),
  });

  const rejectMutation = useMutation({
    mutationFn: ({ id, reason }: { id: string; reason: string }) =>
      adminApi.rejectAgency(id, reason),
    onSuccess: () => {
      toast.success("Agence rejetée");
      setRejectId(null);
      setRejectReason("");
      invalidate();
    },
    onError: (err) => toast.error(getErrorMessage(err)),
  });

  const agencies = data?.data ?? [];
  const meta = data?.meta;

  const statusOptions = useMemo(
    () => [
      { value: "all", label: "Tous les statuts" },
      ...Object.values(AgencyStatus).map((s) => ({
        value: s,
        label: STATUS_LABELS[s] ?? s,
      })),
    ],
    [],
  );

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Gestion des agences"
        description="Validez les nouvelles inscriptions, surveillez les partenaires actifs et gérez les suspensions."
        badge={
          meta?.total != null ? (
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
              {meta.total} agence{meta.total > 1 ? "s" : ""}
            </span>
          ) : undefined
        }
      />

      <AdminToolbar>
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-10 border-black/[0.08] bg-white pl-9"
            placeholder="Rechercher par nom, email, ville..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <Select
          value={status}
          onValueChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        >
          <SelectTrigger className="h-10 w-full border-black/[0.08] bg-white sm:w-52">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AdminToolbar>

      <AdminPanel padding="none">
        {isLoading ? (
          <AdminTableSkeleton />
        ) : agencies.length === 0 ? (
          <AdminEmptyState
            title="Aucune agence trouvée"
            description="Modifiez vos filtres ou attendez de nouvelles demandes partenaires."
          />
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow className="border-black/[0.06] bg-slate-50/80 hover:bg-slate-50/80">
                  <TableHead className="font-semibold">Agence</TableHead>
                  <TableHead className="hidden font-semibold md:table-cell">
                    Localisation
                  </TableHead>
                  <TableHead className="hidden font-semibold lg:table-cell">
                    Contact
                  </TableHead>
                  <TableHead className="font-semibold">Statut</TableHead>
                  <TableHead className="hidden font-semibold sm:table-cell">
                    Inscription
                  </TableHead>
                  <TableHead className="text-end font-semibold">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agencies.map((agency) => (
                  <TableRow key={agency.id} className="border-black/[0.05]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <AdminAgencyAvatar
                          name={agency.name}
                          logoUrl={agency.logoUrl}
                        />
                        <div className="min-w-0">
                          <p className="truncate font-semibold">{agency.name}</p>
                          <p className="truncate text-xs text-muted-foreground md:hidden">
                            {agency.city}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-start gap-1.5 text-sm text-muted-foreground">
                        <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                        <span>
                          {agency.city}
                          {agency.governorate ? `, ${agency.governorate}` : ""}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                      {agency.email ?? "—"}
                    </TableCell>
                    <TableCell>
                      <AdminStatusBadge status={agency.status} />
                    </TableCell>
                    <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                      {formatDate(agency.createdAt)}
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1.5">
                        {agency.status === AgencyStatus.PENDING_VALIDATION && (
                          <>
                            <Button
                              size="sm"
                              className="h-8 gap-1 bg-emerald-600 hover:bg-emerald-700"
                              disabled={actionId === agency.id}
                              onClick={() => {
                                setActionId(agency.id);
                                approveMutation.mutate(agency.id);
                              }}
                            >
                              {actionId === agency.id &&
                              approveMutation.isPending ? (
                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                              ) : (
                                <Check className="h-3.5 w-3.5" />
                              )}
                              <span className="hidden sm:inline">Approuver</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-1 border-red-200 text-red-700 hover:bg-red-50"
                              onClick={() => setRejectId(agency.id)}
                            >
                              <X className="h-3.5 w-3.5" />
                              <span className="hidden sm:inline">Rejeter</span>
                            </Button>
                          </>
                        )}
                        {agency.status === AgencyStatus.ACTIVE && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8 gap-1"
                            disabled={actionId === agency.id}
                            onClick={() => {
                              setActionId(agency.id);
                              suspendMutation.mutate(agency.id);
                            }}
                          >
                            {actionId === agency.id && suspendMutation.isPending ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Ban className="h-3.5 w-3.5" />
                            )}
                            <span className="hidden sm:inline">Suspendre</span>
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {meta && (
              <AdminPagination
                page={meta.page}
                totalPages={meta.totalPages}
                hasPreviousPage={meta.hasPreviousPage}
                hasNextPage={meta.hasNextPage}
                total={meta.total}
                onPrevious={() => setPage((p) => p - 1)}
                onNext={() => setPage((p) => p + 1)}
              />
            )}
          </>
        )}
      </AdminPanel>

      <Dialog open={!!rejectId} onOpenChange={(o) => !o && setRejectId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rejeter l&apos;agence</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Motif du rejet</Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              placeholder="Documents incomplets, informations incorrectes..."
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectId(null)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              disabled={!rejectReason.trim() || rejectMutation.isPending}
              onClick={() =>
                rejectId &&
                rejectMutation.mutate({
                  id: rejectId,
                  reason: rejectReason.trim(),
                })
              }
            >
              {rejectMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Confirmer le rejet
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
