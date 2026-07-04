import type { LucideIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { AgencyStatus } from "@/types";

const AGENCY_STATUS_CONFIG: Record<
  string,
  { label: string; className: string; dot: string }
> = {
  [AgencyStatus.PENDING_VALIDATION]: {
    label: "En attente",
    className: "bg-amber-50 text-amber-800 ring-amber-200/80",
    dot: "bg-amber-500",
  },
  [AgencyStatus.ACTIVE]: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-800 ring-emerald-200/80",
    dot: "bg-emerald-500",
  },
  [AgencyStatus.SUSPENDED]: {
    label: "Suspendue",
    className: "bg-slate-100 text-slate-700 ring-slate-200/80",
    dot: "bg-slate-400",
  },
  [AgencyStatus.REJECTED]: {
    label: "Rejetée",
    className: "bg-red-50 text-red-800 ring-red-200/80",
    dot: "bg-red-500",
  },
};

export function AdminPageHeader({
  title,
  description,
  action,
  badge,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  badge?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 flex flex-wrap items-center gap-2">
          {badge}
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-[1.75rem]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-[15px] text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

export function AdminPanel({
  children,
  className,
  padding = "default",
}: {
  children: React.ReactNode;
  className?: string;
  padding?: "none" | "default" | "compact";
}) {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-black/[0.06] bg-white shadow-[0_1px_2px_rgba(15,23,42,0.04),0_12px_40px_rgba(15,23,42,0.06)]",
        padding === "default" && "p-5 sm:p-6",
        padding === "compact" && "p-4",
        padding === "none" && "p-0",
        className,
      )}
    >
      {children}
    </section>
  );
}

const statAccents = {
  slate: {
    wrap: "from-slate-100/90 via-white to-white",
    icon: "bg-slate-900 text-white",
  },
  blue: {
    wrap: "from-blue-100/70 via-white to-white",
    icon: "bg-[#1e3a5f] text-white",
  },
  emerald: {
    wrap: "from-emerald-100/70 via-white to-white",
    icon: "bg-emerald-600 text-white",
  },
  violet: {
    wrap: "from-violet-100/70 via-white to-white",
    icon: "bg-violet-600 text-white",
  },
  amber: {
    wrap: "from-amber-100/80 via-white to-white",
    icon: "bg-amber-600 text-white",
  },
} as const;

export function AdminStatCard({
  title,
  value,
  hint,
  icon: Icon,
  accent = "blue",
}: {
  title: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  accent?: keyof typeof statAccents;
}) {
  const styles = statAccents[accent];

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl border border-black/[0.05] bg-gradient-to-br p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_8px_24px_rgba(15,23,42,0.05)]",
        styles.wrap,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-3xl font-bold tabular-nums tracking-tight text-foreground">
            {value}
          </p>
          {hint && (
            <p className="mt-1.5 text-sm text-muted-foreground">{hint}</p>
          )}
        </div>
        <div
          className={cn(
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm",
            styles.icon,
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </article>
  );
}

export function AdminStatusBadge({ status }: { status: string }) {
  const config = AGENCY_STATUS_CONFIG[status] ?? {
    label: status.replace(/_/g, " "),
    className: "bg-muted text-muted-foreground ring-border",
    dot: "bg-muted-foreground",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset",
        config.className,
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
}

export function AdminToolbar({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border border-black/[0.06] bg-white/90 p-3 shadow-sm backdrop-blur sm:flex-row sm:items-center",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminEmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
        <span className="text-2xl font-light">—</span>
      </div>
      <p className="text-base font-semibold text-foreground">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}

export function AdminPagination({
  page,
  totalPages,
  hasPreviousPage,
  hasNextPage,
  onPrevious,
  onNext,
  total,
}: {
  page: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  onPrevious: () => void;
  onNext: () => void;
  total?: number;
}) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-black/[0.06] px-4 py-4 sm:flex-row sm:px-6">
      <p className="text-sm text-muted-foreground">
        Page {page} sur {totalPages}
        {total != null && ` · ${total} résultat${total > 1 ? "s" : ""}`}
      </p>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={!hasPreviousPage}
          onClick={onPrevious}
        >
          Précédent
        </Button>
        <Button
          variant="outline"
          size="sm"
          disabled={!hasNextPage}
          onClick={onNext}
        >
          Suivant
        </Button>
      </div>
    </div>
  );
}

export function AdminTableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-14 w-full rounded-xl" />
      ))}
    </div>
  );
}

export function AdminUserAvatar({
  firstName,
  lastName,
  className,
}: {
  firstName: string;
  lastName: string;
  className?: string;
}) {
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <div
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] text-sm font-semibold text-white shadow-sm",
        className,
      )}
    >
      {initials || "?"}
    </div>
  );
}

export function AdminAgencyAvatar({
  name,
  logoUrl,
}: {
  name: string;
  logoUrl?: string | null;
}) {
  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={logoUrl}
        alt=""
        className="h-10 w-10 shrink-0 rounded-xl border border-black/[0.06] object-cover"
      />
    );
  }

  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-sm font-bold text-slate-600">
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

export function AdminAlertBanner({
  title,
  description,
  href,
  linkLabel,
  variant = "warning",
}: {
  title: string;
  description: string;
  href: string;
  linkLabel: string;
  variant?: "warning" | "info";
}) {
  const styles =
    variant === "warning"
      ? "border-amber-200/80 bg-gradient-to-r from-amber-50 to-orange-50/50"
      : "border-blue-200/80 bg-gradient-to-r from-blue-50 to-slate-50";

  return (
    <AdminPanel className={cn("border", styles)} padding="default">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-semibold text-foreground">{title}</p>
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        </div>
        <Button asChild className="shrink-0 shadow-sm">
          <Link href={href}>{linkLabel}</Link>
        </Button>
      </div>
    </AdminPanel>
  );
}

export { AGENCY_STATUS_CONFIG };
