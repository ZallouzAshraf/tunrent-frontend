"use client";

import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Banknote,
  ChevronRight,
  CreditCard,
  Loader2,
  Plus,
  Receipt,
  Wallet,
  X,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardPanel,
} from "@/components/dashboard/dashboard-ui";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardApi, getErrorMessage } from "@/lib/api";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import type { Payment } from "@/types";
import { PaymentMethod, PaymentStatus } from "@/types";

const METHOD_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: "Espèces",
  [PaymentMethod.CARD]: "Carte bancaire",
  [PaymentMethod.FLOUCI]: "Flouci",
  [PaymentMethod.D17]: "D17",
  [PaymentMethod.CLICTOPAY]: "ClicToPay",
  [PaymentMethod.BANK_TRANSFER]: "Virement",
};

const STATUS_CONFIG: Record<
  PaymentStatus,
  { label: string; variant: "default" | "secondary" | "success" | "warning" | "destructive" | "outline" }
> = {
  [PaymentStatus.COMPLETED]: { label: "Encaissé", variant: "success" },
  [PaymentStatus.PENDING]: { label: "En attente", variant: "warning" },
  [PaymentStatus.FAILED]: { label: "Échoué", variant: "destructive" },
  [PaymentStatus.REFUNDED]: { label: "Remboursé", variant: "outline" },
};

function MethodIcon({ method }: { method: PaymentMethod }) {
  const className = "h-5 w-5";
  switch (method) {
    case PaymentMethod.CASH:
      return <Banknote className={className} aria-hidden />;
    case PaymentMethod.CARD:
    case PaymentMethod.FLOUCI:
    case PaymentMethod.D17:
    case PaymentMethod.CLICTOPAY:
      return <CreditCard className={className} aria-hidden />;
    default:
      return <Wallet className={className} aria-hidden />;
  }
}

function PaymentRow({ payment }: { payment: Payment }) {
  const status = STATUS_CONFIG[payment.status as PaymentStatus] ?? {
    label: payment.status,
    variant: "outline" as const,
  };
  const bookingRef =
    payment.booking?.bookingReference ?? payment.bookingId.slice(0, 8);

  return (
    <Link
      href={
        payment.booking?.id
          ? `/dashboard/bookings/${payment.booking.id}`
          : "/dashboard/payments"
      }
      className="group flex items-center gap-4 rounded-2xl px-4 py-3.5 transition-colors hover:bg-white/80 active:scale-[0.99]"
    >
      <div
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl",
          payment.method === PaymentMethod.CASH
            ? "bg-emerald-100 text-emerald-700"
            : "bg-primary/10 text-primary",
        )}
      >
        <MethodIcon method={payment.method} />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-mono text-xs font-semibold text-muted-foreground">
            {bookingRef}
          </p>
          <Badge variant={status.variant} className="text-[10px]">
            {status.label}
          </Badge>
        </div>
        <p className="mt-0.5 text-sm text-muted-foreground">
          {METHOD_LABELS[payment.method as PaymentMethod] ?? payment.method}
          {" · "}
          {formatDate(payment.paidAt ?? payment.createdAt)}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <p className="text-base font-bold tabular-nums text-primary">
          {formatPrice(payment.amount)}
        </p>
        <ChevronRight className="h-4 w-4 text-muted-foreground/50 transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function PaymentsSummary({ payments }: { payments: Payment[] }) {
  const completed = payments.filter((p) => p.status === PaymentStatus.COMPLETED);
  const total = completed.reduce((sum, p) => sum + Number(p.amount), 0);
  const cashTotal = completed
    .filter((p) => p.method === PaymentMethod.CASH)
    .reduce((sum, p) => sum + Number(p.amount), 0);

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <article className="rounded-[1.25rem] border border-black/[0.04] bg-gradient-to-br from-emerald-100/80 via-white to-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              CA encaissé
            </p>
            <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight">
              {formatPrice(total)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {completed.length} paiement{completed.length > 1 ? "s" : ""}
            </p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
            <Banknote className="h-5 w-5" aria-hidden />
          </div>
        </div>
      </article>

      <article className="rounded-[1.25rem] border border-black/[0.04] bg-gradient-to-br from-primary/10 via-white to-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              Espèces
            </p>
            <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-primary">
              {formatPrice(cashTotal)}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Encaissements cash</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Receipt className="h-5 w-5" aria-hidden />
          </div>
        </div>
      </article>

      <article className="rounded-[1.25rem] border border-black/[0.04] bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
              Total transactions
            </p>
            <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight">
              {payments.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Tous statuts confondus</p>
          </div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#F2F2F7] text-muted-foreground">
            <Wallet className="h-5 w-5" aria-hidden />
          </div>
        </div>
      </article>
    </div>
  );
}

export function PaymentsPanel() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [bookingId, setBookingId] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState<PaymentMethod>(PaymentMethod.CASH);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "payments"],
    queryFn: async () => (await dashboardApi.getPayments({ limit: 100 })).data,
  });

  const payments = useMemo(() => data?.data ?? [], [data?.data]);

  const createPayment = useMutation({
    mutationFn: () =>
      dashboardApi.createPayment({
        bookingId,
        amount: Number(amount),
        method,
        type: "full_payment",
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "payments"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard", "stats"] });
      toast.success("Paiement enregistré");
      setShowForm(false);
      setBookingId("");
      setAmount("");
    },
    onError: (e) => toast.error(getErrorMessage(e)),
  });

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Paiements"
        description="Suivi du chiffre d'affaires et historique des encaissements"
        action={
          <Button
            className="gap-2 rounded-xl shadow-sm"
            variant={showForm ? "outline" : "default"}
            onClick={() => setShowForm((v) => !v)}
          >
            {showForm ? (
              <>
                <X className="h-4 w-4" />
                Fermer
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Paiement manuel
              </>
            )}
          </Button>
        }
      />

      {showForm && (
        <DashboardPanel>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
              <Plus className="h-4 w-4 text-primary" aria-hidden />
            </div>
            <div>
              <h2 className="text-[15px] font-semibold">Enregistrer un paiement</h2>
              <p className="text-xs text-muted-foreground">
                Pour les encaissements hors fiche réservation · préférez « Encaisser en espèces » sur la réservation
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2 sm:col-span-3">
              <Label htmlFor="payment-booking-id">ID réservation (UUID)</Label>
              <Input
                id="payment-booking-id"
                value={bookingId}
                onChange={(e) => setBookingId(e.target.value)}
                placeholder="1e3f4244-2d77-4bf0-9421-55fd1d15393d"
                className="rounded-xl border-black/[0.08] bg-[#F2F2F7]/50 font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payment-amount">Montant (TND)</Label>
              <Input
                id="payment-amount"
                type="number"
                min="0"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="rounded-xl border-black/[0.08] bg-[#F2F2F7]/50"
              />
            </div>
            <div className="space-y-2">
              <Label>Méthode</Label>
              <Select
                value={method}
                onValueChange={(v) => setMethod(v as PaymentMethod)}
              >
                <SelectTrigger className="rounded-xl border-black/[0.08] bg-[#F2F2F7]/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PaymentMethod).map((m) => (
                    <SelectItem key={m} value={m}>
                      {METHOD_LABELS[m]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button
                className="w-full gap-2 rounded-xl sm:w-auto"
                disabled={!bookingId || !amount || createPayment.isPending}
                onClick={() => createPayment.mutate()}
              >
                {createPayment.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Banknote className="h-4 w-4" />
                )}
                Enregistrer
              </Button>
            </div>
          </div>
        </DashboardPanel>
      )}

      {isLoading ? (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-28 rounded-[1.25rem]" />
            ))}
          </div>
          <Skeleton className="h-64 rounded-[1.25rem]" />
        </div>
      ) : (
        <>
          {payments.length > 0 && <PaymentsSummary payments={payments} />}

          <DashboardPanel padding="compact">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-[17px] font-semibold tracking-tight">
                  Historique
                </h2>
                <p className="text-sm text-muted-foreground">
                  {data?.meta.total ?? payments.length} transaction
                  {(data?.meta.total ?? payments.length) > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            {payments.length === 0 ? (
              <DashboardEmptyState
                icon={Banknote}
                title="Aucun paiement enregistré"
                description="Les encaissements depuis les fiches réservation apparaîtront ici"
              />
            ) : (
              <div className="divide-y divide-black/[0.05] overflow-hidden rounded-2xl bg-[#F2F2F7]/70">
                {payments.map((payment) => (
                  <PaymentRow key={payment.id} payment={payment} />
                ))}
              </div>
            )}
          </DashboardPanel>
        </>
      )}
    </div>
  );
}
