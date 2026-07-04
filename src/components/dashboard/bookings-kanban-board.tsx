"use client";

import {
  Ban,
  CalendarDays,
  Car,
  CheckCircle2,
  Clock,
  Flag,
  type LucideIcon,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import {
  DashboardEmptyState,
  DashboardPageHeader,
  DashboardPanel,
} from "@/components/dashboard/dashboard-ui";
import { StatusBadge } from "@/components/dashboard/status-badge";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { isBookingFullyPaid } from "@/lib/dashboard/booking-payment";
import { cn, formatDate, formatPrice } from "@/lib/utils";
import type { Booking } from "@/types";
import { BookingStatus } from "@/types";

type ColumnConfig = {
  status: BookingStatus;
  label: string;
  icon: LucideIcon;
  dot: string;
  header: string;
  empty: string;
};

const KANBAN_COLUMNS: ColumnConfig[] = [
  {
    status: BookingStatus.PENDING,
    label: "En attente",
    icon: Clock,
    dot: "bg-amber-500",
    header: "bg-amber-500/10 text-amber-800",
    empty: "Aucune demande en attente",
  },
  {
    status: BookingStatus.CONFIRMED,
    label: "Confirmées",
    icon: CheckCircle2,
    dot: "bg-emerald-500",
    header: "bg-emerald-500/10 text-emerald-800",
    empty: "Aucune réservation confirmée",
  },
  {
    status: BookingStatus.IN_PROGRESS,
    label: "En cours",
    icon: Car,
    dot: "bg-primary",
    header: "bg-primary/10 text-primary",
    empty: "Aucune location en cours",
  },
  {
    status: BookingStatus.COMPLETED,
    label: "Terminées",
    icon: Flag,
    dot: "bg-slate-400",
    header: "bg-slate-500/10 text-slate-700",
    empty: "Aucune location terminée",
  },
];

const ARCHIVED: BookingStatus[] = [
  BookingStatus.REJECTED,
  BookingStatus.CANCELLED,
];

function BookingKanbanCard({ booking }: { booking: Booking }) {
  const paid = isBookingFullyPaid(booking);

  return (
    <Link
      href={`/dashboard/bookings/${booking.id}`}
      className="group block rounded-2xl border border-black/[0.05] bg-white p-3.5 shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:-translate-y-0.5 hover:border-primary/15 hover:shadow-[0_8px_24px_rgba(0,0,0,0.08)] active:scale-[0.99]"
    >
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span className="rounded-md bg-[#F2F2F7] px-2 py-0.5 font-mono text-[10px] font-semibold text-muted-foreground">
          {booking.bookingReference}
        </span>
        {paid && (
          <Badge variant="success" className="h-5 px-1.5 text-[10px]">
            Payé
          </Badge>
        )}
      </div>

      <p className="text-[15px] font-semibold leading-snug tracking-tight">
        {booking.clientFirstName} {booking.clientLastName}
      </p>

      <div className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
        <Car className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden />
        <span className="truncate">
          {booking.car?.brand} {booking.car?.model}
        </span>
      </div>

      <div className="mt-1.5 flex items-center gap-1.5 text-xs text-muted-foreground">
        <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden />
        <span className="truncate">
          {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-black/[0.05] pt-3">
        <span className="text-xs text-muted-foreground">
          {booking.totalDays} jour{booking.totalDays > 1 ? "s" : ""}
        </span>
        <span className="text-sm font-bold tabular-nums text-primary">
          {formatPrice(booking.totalPrice)}
        </span>
      </div>
    </Link>
  );
}

function KanbanColumn({
  config,
  bookings,
}: {
  config: ColumnConfig;
  bookings: Booking[];
}) {
  const Icon = config.icon;

  return (
    <div className="flex w-[17.5rem] shrink-0 flex-col xl:w-auto xl:min-w-0">
      <div
        className={cn(
          "mb-3 flex items-center justify-between rounded-2xl px-3 py-2.5",
          config.header,
        )}
      >
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full", config.dot)} aria-hidden />
          <Icon className="h-4 w-4 opacity-80" aria-hidden />
          <h3 className="text-sm font-semibold">{config.label}</h3>
        </div>
        <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs font-bold tabular-nums shadow-sm">
          {bookings.length}
        </span>
      </div>

      <div className="flex min-h-[12rem] flex-1 flex-col gap-2.5 rounded-[1.25rem] bg-black/[0.03] p-2.5">
        {bookings.length === 0 ? (
          <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-black/[0.06] bg-white/40 px-4 py-8 text-center">
            <p className="text-xs leading-relaxed text-muted-foreground">
              {config.empty}
            </p>
          </div>
        ) : (
          bookings.map((booking) => (
            <BookingKanbanCard key={booking.id} booking={booking} />
          ))
        )}
      </div>
    </div>
  );
}

function BookingsKanbanSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-[28rem] w-72 shrink-0 rounded-[1.25rem]" />
      ))}
    </div>
  );
}

export function BookingsKanbanBoard({
  bookings,
  isLoading,
  headerAction,
}: {
  bookings: Booking[];
  isLoading?: boolean;
  headerAction?: React.ReactNode;
}) {
  const getByStatus = (status: BookingStatus) =>
    bookings.filter((b) => b.status === status);

  const archived = bookings.filter((b) => ARCHIVED.includes(b.status));
  const pendingCount = getByStatus(BookingStatus.PENDING).length;
  const activeCount =
    getByStatus(BookingStatus.CONFIRMED).length +
    getByStatus(BookingStatus.IN_PROGRESS).length;

  return (
    <div className="space-y-6">
      <DashboardPageHeader
        title="Réservations"
        description="Suivez le cycle de vie de chaque location en un coup d'œil"
        action={headerAction}
      />

      {!isLoading && (
        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-black/[0.06] bg-white px-3 py-1.5 text-xs font-medium shadow-sm">
            <span className="font-bold tabular-nums text-foreground">{bookings.length}</span>
            <span className="text-muted-foreground">total</span>
          </span>
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800">
              {pendingCount} à traiter
            </span>
          )}
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
            {activeCount} actives
          </span>
        </div>
      )}

      {isLoading ? (
        <BookingsKanbanSkeleton />
      ) : (
        <>
          <div className="-mx-1 overflow-x-auto px-1 pb-2">
            <div className="flex min-w-max gap-4 xl:grid xl:min-w-0 xl:grid-cols-4">
              {KANBAN_COLUMNS.map((column) => (
                <KanbanColumn
                  key={column.status}
                  config={column}
                  bookings={getByStatus(column.status)}
                />
              ))}
            </div>
          </div>

          {archived.length > 0 && (
            <DashboardPanel padding="compact">
              <div className="mb-4 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
                  <Ban className="h-4 w-4 text-muted-foreground" aria-hidden />
                </div>
                <div>
                  <h2 className="text-[15px] font-semibold">
                    Rejetées & annulées
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {archived.length} réservation{archived.length > 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="divide-y divide-black/[0.05] overflow-hidden rounded-2xl bg-[#F2F2F7]/70">
                {archived.map((booking) => (
                  <Link
                    key={booking.id}
                    href={`/dashboard/bookings/${booking.id}`}
                    className="flex items-center justify-between gap-3 px-4 py-3.5 transition-colors hover:bg-white/70"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        <span className="font-mono text-xs text-muted-foreground">
                          {booking.bookingReference}
                        </span>
                        {" · "}
                        {booking.clientFirstName} {booking.clientLastName}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-muted-foreground">
                        {booking.car?.brand} {booking.car?.model} ·{" "}
                        {formatDate(booking.startDate)}
                      </p>
                    </div>
                    <StatusBadge status={booking.status} type="booking" />
                  </Link>
                ))}
              </div>
            </DashboardPanel>
          )}

          {bookings.length === 0 && (
            <DashboardEmptyState
              icon={CalendarDays}
              title="Aucune réservation"
              description="Les nouvelles demandes de vos clients apparaîtront ici"
            />
          )}
        </>
      )}
    </div>
  );
}
