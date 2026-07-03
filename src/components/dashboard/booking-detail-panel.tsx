"use client";

import Image from "next/image";
import {
  ArrowLeft,
  Ban,
  Banknote,
  CalendarDays,
  Car,
  Check,
  CheckCircle2,
  Clock,
  CreditCard,
  Flag,
  IdCard,
  Loader2,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  User,
  XCircle,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  canMarkBookingPaidCash,
  getBookingPaidAmount,
  isBookingFullyPaid,
} from "@/lib/dashboard/booking-payment";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn, formatDate, formatPrice, formatRelativeTime } from "@/lib/utils";
import { Booking, BookingStatus, PaymentStatus } from "@/types";

const TIMELINE_STEPS = [
  { status: BookingStatus.PENDING, label: "Demande", icon: Clock },
  { status: BookingStatus.CONFIRMED, label: "Confirmée", icon: CheckCircle2 },
  { status: BookingStatus.IN_PROGRESS, label: "En cours", icon: Car },
  { status: BookingStatus.COMPLETED, label: "Terminée", icon: Flag },
] as const;

const STATUS_STEP_INDEX: Record<BookingStatus, number> = {
  [BookingStatus.PENDING]: 0,
  [BookingStatus.CONFIRMED]: 1,
  [BookingStatus.IN_PROGRESS]: 2,
  [BookingStatus.COMPLETED]: 3,
  [BookingStatus.REJECTED]: -1,
  [BookingStatus.CANCELLED]: -2,
};

const STATUS_HERO: Record<
  BookingStatus,
  { gradient: string; ring: string }
> = {
  [BookingStatus.PENDING]: {
    gradient: "from-amber-500/20 via-primary/10 to-card",
    ring: "ring-amber-400/30",
  },
  [BookingStatus.CONFIRMED]: {
    gradient: "from-emerald-500/20 via-primary/10 to-card",
    ring: "ring-emerald-400/30",
  },
  [BookingStatus.IN_PROGRESS]: {
    gradient: "from-primary/25 via-primary/10 to-card",
    ring: "ring-primary/30",
  },
  [BookingStatus.COMPLETED]: {
    gradient: "from-emerald-500/15 via-muted/30 to-card",
    ring: "ring-emerald-400/20",
  },
  [BookingStatus.REJECTED]: {
    gradient: "from-destructive/15 via-muted/20 to-card",
    ring: "ring-destructive/25",
  },
  [BookingStatus.CANCELLED]: {
    gradient: "from-muted/40 via-muted/20 to-card",
    ring: "ring-border",
  },
};

function InfoRow({
  icon: Icon,
  label,
  value,
  href,
  mono,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  href?: string;
  mono?: boolean;
}) {
  const content = (
    <div className="flex items-start gap-3 rounded-lg px-1 py-2 transition-colors hover:bg-muted/40">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-secondary">
        <Icon className="h-4 w-4 text-primary" aria-hidden />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p className={cn("mt-0.5 text-sm font-medium break-all", mono && "font-mono")}>
          {value}
        </p>
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        {content}
      </a>
    );
  }

  return content;
}

function SectionCard({
  title,
  icon: Icon,
  children,
  className,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-xl border bg-card shadow-sm",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b bg-muted/20 px-5 py-3.5">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-4 w-4 text-primary" aria-hidden />
        </div>
        <h2 className="font-semibold">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

function BookingTimeline({ status }: { status: BookingStatus }) {
  const currentIndex = STATUS_STEP_INDEX[status];
  const isTerminal = currentIndex < 0;

  if (isTerminal) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm",
          status === BookingStatus.REJECTED
            ? "border-destructive/30 bg-destructive/5 text-destructive"
            : "border-border bg-muted/30 text-muted-foreground",
        )}
      >
        {status === BookingStatus.REJECTED ? (
          <XCircle className="h-4 w-4 shrink-0" />
        ) : (
          <Ban className="h-4 w-4 shrink-0" />
        )}
        <span className="font-medium">
          {status === BookingStatus.REJECTED
            ? "Cette réservation a été rejetée"
            : "Cette réservation a été annulée"}
        </span>
      </div>
    );
  }

  return (
    <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {TIMELINE_STEPS.map((step, index) => {
        const StepIcon = step.icon;
        const done = index < currentIndex;
        const active = index === currentIndex;

        return (
          <li
            key={step.status}
            className={cn(
              "relative flex flex-col items-center gap-2 rounded-xl border px-3 py-3 text-center transition-colors",
              active && "border-primary/40 bg-primary/5 shadow-sm",
              done && "border-emerald-200 bg-emerald-50/60",
              !done && !active && "border-border/60 bg-background/60 opacity-70",
            )}
          >
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full",
                active && "bg-primary text-primary-foreground",
                done && "bg-emerald-100 text-emerald-700",
                !done && !active && "bg-muted text-muted-foreground",
              )}
            >
              {done ? (
                <Check className="h-4 w-4" aria-hidden />
              ) : (
                <StepIcon className="h-4 w-4" aria-hidden />
              )}
            </div>
            <span
              className={cn(
                "text-xs font-medium",
                active && "text-primary",
                done && "text-emerald-700",
              )}
            >
              {step.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function BookingDetailSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-pulse">
      <div className="h-4 w-24 rounded bg-muted" />
      <div className="h-48 rounded-2xl bg-muted" />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-64 rounded-xl bg-muted lg:col-span-2" />
        <div className="h-64 rounded-xl bg-muted" />
      </div>
    </div>
  );
}

type BookingDetailPanelProps = {
  booking: Booking;
  rejectOpen: boolean;
  rejectReason: string;
  onRejectOpenChange: (open: boolean) => void;
  onRejectReasonChange: (reason: string) => void;
  onConfirm: () => void;
  onReject: () => void;
  onStart: () => void;
  onComplete: () => void;
  onCancel: () => void;
  onMarkPaidCash?: () => void;
  isConfirming?: boolean;
  isRejecting?: boolean;
  isStarting?: boolean;
  isCompleting?: boolean;
  isCancelling?: boolean;
  isMarkingPaid?: boolean;
  actionsDisabled?: boolean;
};

export function BookingDetailPanel({
  booking,
  rejectOpen,
  rejectReason,
  onRejectOpenChange,
  onRejectReasonChange,
  onConfirm,
  onReject,
  onStart,
  onComplete,
  onCancel,
  onMarkPaidCash,
  isConfirming,
  isRejecting,
  isStarting,
  isCompleting,
  isCancelling,
  isMarkingPaid,
  actionsDisabled,
}: BookingDetailPanelProps) {
  const pending = booking.status === BookingStatus.PENDING;
  const confirmed = booking.status === BookingStatus.CONFIRMED;
  const inProgress = booking.status === BookingStatus.IN_PROGRESS;
  const heroStyle = STATUS_HERO[booking.status];
  const carImage =
    booking.car?.thumbnailUrl ?? booking.car?.photos?.[0] ?? null;
  const clientInitials = `${booking.clientFirstName[0] ?? ""}${booking.clientLastName[0] ?? ""}`;
  const isPaid = isBookingFullyPaid(booking);
  const paidAmount = getBookingPaidAmount(booking.payments);
  const showMarkPaid =
    canMarkBookingPaidCash(booking.status) && !isPaid && onMarkPaidCash;
  const latestCashPayment = [...(booking.payments ?? [])]
    .filter((payment) => payment.status === PaymentStatus.COMPLETED)
    .sort(
      (a, b) =>
        new Date(b.paidAt ?? b.createdAt).getTime() -
        new Date(a.paidAt ?? a.createdAt).getTime(),
    )[0];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Link
        href="/dashboard/bookings"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux réservations
      </Link>

      <header
        className={cn(
          "overflow-hidden rounded-2xl border bg-gradient-to-br p-5 shadow-sm ring-1 sm:p-6",
          heroStyle.gradient,
          heroStyle.ring,
        )}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-lg bg-primary/10 px-2.5 py-1 font-mono text-sm font-semibold text-primary">
                {booking.bookingReference}
              </span>
              <StatusBadge status={booking.status} type="booking" />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                {booking.clientFirstName} {booking.clientLastName}
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Demande reçue{" "}
                <time dateTime={booking.createdAt} title={formatDate(booking.createdAt)}>
                  {formatRelativeTime(booking.createdAt)}
                </time>
                <span className="mx-1.5 text-border">·</span>
                {formatDate(booking.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start gap-1 rounded-xl border bg-card/80 px-4 py-3 backdrop-blur-sm sm:items-end sm:text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Montant total
            </p>
            <p className="text-3xl font-bold text-primary">
              {formatPrice(booking.totalPrice)}
            </p>
            <p className="text-xs text-muted-foreground">
              {booking.totalDays} jour{booking.totalDays > 1 ? "s" : ""} ·{" "}
              {formatPrice(booking.pricePerDay)}/j
            </p>
          </div>
        </div>

        <div className="mt-6">
          <BookingTimeline status={booking.status} />
        </div>
      </header>

      {canMarkBookingPaidCash(booking.status) && (
        <section
          className={cn(
            "rounded-xl border p-4 shadow-sm sm:p-5",
            isPaid
              ? "border-emerald-200 bg-emerald-50/70"
              : "border-amber-200 bg-amber-50/50",
          )}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  isPaid ? "bg-emerald-100" : "bg-amber-100",
                )}
              >
                <Banknote
                  className={cn(
                    "h-5 w-5",
                    isPaid ? "text-emerald-700" : "text-amber-700",
                  )}
                  aria-hidden
                />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-semibold">Paiement espèces</p>
                  <Badge
                    variant={isPaid ? "success" : "warning"}
                    className="text-[11px]"
                  >
                    {isPaid ? "Payé" : "En attente"}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isPaid ? (
                    <>
                      {formatPrice(paidAmount)} encaissé
                      {latestCashPayment?.paidAt && (
                        <>
                          {" "}
                          le {formatDate(latestCashPayment.paidAt)}
                        </>
                      )}
                      {" "}· comptabilisé dans votre CA
                    </>
                  ) : (
                    <>
                      Le client règle {formatPrice(booking.totalPrice)} en
                      espèces à l&apos;agence. Cliquez ci-dessous une fois
                      l&apos;encaissement effectué.
                    </>
                  )}
                </p>
              </div>
            </div>

            {showMarkPaid && (
              <Button
                className="gap-2 self-start shadow-sm sm:self-center"
                onClick={onMarkPaidCash}
                disabled={isMarkingPaid || actionsDisabled}
              >
                {isMarkingPaid ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Banknote className="h-4 w-4" />
                )}
                Encaisser en espèces
              </Button>
            )}
          </div>
        </section>
      )}

      {(pending || confirmed || inProgress) && (
        <section className="rounded-xl border bg-card p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="font-medium">
                {pending && "Cette demande attend votre validation"}
                {confirmed && "Prête à démarrer — le client peut récupérer le véhicule"}
                {inProgress && "Location en cours — marquez comme terminée à la restitution"}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {pending &&
                  "Confirmez si le véhicule est disponible, ou rejetez avec une raison."}
                {confirmed &&
                  `Début prévu le ${formatDate(booking.startDate)}`}
                {inProgress &&
                  `Fin prévue le ${formatDate(booking.endDate)}`}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {pending && (
                <>
                  <Button
                    className="gap-2 shadow-sm"
                    onClick={onConfirm}
                    disabled={isConfirming || actionsDisabled}
                  >
                    {isConfirming ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4" />
                    )}
                    Confirmer
                  </Button>
                  <Button
                    variant="destructive"
                    className="gap-2"
                    onClick={() => onRejectOpenChange(true)}
                    disabled={actionsDisabled}
                  >
                    <XCircle className="h-4 w-4" />
                    Rejeter
                  </Button>
                </>
              )}
              {confirmed && (
                <Button className="gap-2 shadow-sm" onClick={onStart} disabled={isStarting || actionsDisabled}>
                  {isStarting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Car className="h-4 w-4" />
                  )}
                  Démarrer la location
                </Button>
              )}
              {inProgress && (
                <Button className="gap-2 shadow-sm" onClick={onComplete} disabled={isCompleting || actionsDisabled}>
                  {isCompleting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Flag className="h-4 w-4" />
                  )}
                  Terminer
                </Button>
              )}
              {(pending || confirmed) && (
                <Button
                  variant="outline"
                  className="gap-2 bg-background"
                  onClick={onCancel}
                  disabled={isCancelling || actionsDisabled}
                >
                  {isCancelling ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Ban className="h-4 w-4" />
                  )}
                  Annuler
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        <SectionCard title="Client" icon={User} className="lg:col-span-1">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-lg font-semibold text-primary-foreground">
              {clientInitials}
            </div>
            <div>
              <p className="font-semibold">
                {booking.clientFirstName} {booking.clientLastName}
              </p>
              <p className="text-xs text-muted-foreground">Locataire</p>
            </div>
          </div>
          <div className="divide-y">
            <InfoRow
              icon={Mail}
              label="Email"
              value={booking.clientEmail}
              href={`mailto:${booking.clientEmail}`}
            />
            <InfoRow
              icon={Phone}
              label="Téléphone"
              value={booking.clientPhone}
              href={`tel:${booking.clientPhone}`}
            />
            {booking.clientCin && (
              <InfoRow icon={IdCard} label="CIN" value={booking.clientCin} mono />
            )}
            {booking.clientDrivingLicense && (
              <InfoRow
                icon={IdCard}
                label="Permis"
                value={booking.clientDrivingLicense}
                mono
              />
            )}
          </div>
        </SectionCard>

        <SectionCard title="Véhicule" icon={Car} className="lg:col-span-2">
          <div className="flex flex-col gap-5 sm:flex-row">
            <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl bg-muted sm:w-48">
              {carImage ? (
                <Image
                  src={carImage}
                  alt={`${booking.car?.brand} ${booking.car?.model}`}
                  fill
                  className="object-cover"
                  sizes="192px"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <Car className="h-10 w-10 text-muted-foreground/50" />
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1 space-y-4">
              <div>
                <p className="text-xl font-bold">
                  {booking.car?.brand} {booking.car?.model}
                </p>
                {booking.car?.year && (
                  <p className="text-sm text-muted-foreground">
                    Année {booking.car.year}
                    {booking.car.registrationNumber &&
                      ` · ${booking.car.registrationNumber}`}
                  </p>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border bg-muted/20 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Début
                  </div>
                  <p className="mt-1 text-sm font-semibold">
                    {formatDate(booking.startDate)}
                  </p>
                </div>
                <div className="rounded-xl border bg-muted/20 p-3">
                  <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    <CalendarDays className="h-3.5 w-3.5" />
                    Fin
                  </div>
                  <p className="mt-1 text-sm font-semibold">
                    {formatDate(booking.endDate)}
                  </p>
                </div>
              </div>

              {booking.car?.id && (
                <Button asChild variant="outline" size="sm" className="gap-1.5">
                  <Link href={`/dashboard/cars/${booking.car.id}`}>
                    Voir la fiche véhicule
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </SectionCard>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <SectionCard title="Lieux" icon={MapPin}>
          <div className="space-y-3">
            <div className="rounded-xl border bg-muted/20 p-4">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Prise en charge
              </p>
              <p className="mt-1 font-medium">{booking.pickupLocation}</p>
            </div>
            {booking.dropoffLocation && (
              <div className="rounded-xl border bg-muted/20 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Restitution
                </p>
                <p className="mt-1 font-medium">{booking.dropoffLocation}</p>
              </div>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Tarification" icon={CreditCard}>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {formatPrice(booking.pricePerDay)} × {booking.totalDays} jour
                {booking.totalDays > 1 ? "s" : ""}
              </span>
              <span className="font-medium">{formatPrice(booking.totalPrice)}</span>
            </div>
            {booking.depositAmount != null && Number(booking.depositAmount) > 0 && (
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Caution</span>
                <span className="font-medium">
                  {formatPrice(booking.depositAmount)}
                </span>
              </div>
            )}
            <div className="border-t pt-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold">Total</span>
                <span className="text-xl font-bold text-primary">
                  {formatPrice(booking.totalPrice)}
                </span>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>

      {(booking.clientNotes ||
        booking.agencyNotes ||
        booking.rejectionReason ||
        booking.cancellationReason) && (
        <SectionCard title="Notes & historique" icon={MessageSquare}>
          <div className="space-y-4">
            {booking.clientNotes && (
              <div className="rounded-xl border border-dashed bg-muted/20 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Message du client
                </p>
                <p className="mt-2 text-sm leading-relaxed">{booking.clientNotes}</p>
              </div>
            )}
            {booking.agencyNotes && (
              <div className="rounded-xl border bg-secondary/30 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Notes internes
                </p>
                <p className="mt-2 text-sm leading-relaxed">{booking.agencyNotes}</p>
              </div>
            )}
            {booking.rejectionReason && (
              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-destructive">
                  Motif de rejet
                </p>
                <p className="mt-2 text-sm leading-relaxed">{booking.rejectionReason}</p>
              </div>
            )}
            {booking.cancellationReason && (
              <div className="rounded-xl border bg-muted/30 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Motif d&apos;annulation
                </p>
                <p className="mt-2 text-sm leading-relaxed">
                  {booking.cancellationReason}
                </p>
              </div>
            )}
          </div>
        </SectionCard>
      )}

      <Dialog open={rejectOpen} onOpenChange={onRejectOpenChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rejeter la réservation</DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reject-reason">Raison du rejet</Label>
            <Textarea
              id="reject-reason"
              value={rejectReason}
              onChange={(e) => onRejectReasonChange(e.target.value)}
              placeholder="Indisponibilité, documents manquants..."
              rows={4}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => onRejectOpenChange(false)}>
              Annuler
            </Button>
            <Button
              variant="destructive"
              className="gap-2"
              disabled={!rejectReason.trim() || isRejecting}
              onClick={onReject}
            >
              {isRejecting && <Loader2 className="h-4 w-4 animate-spin" />}
              Rejeter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
