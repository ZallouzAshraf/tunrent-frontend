import { ChevronRight, type LucideIcon } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export function DashboardPageHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        className,
      )}
    >
      <div>
        <h1 className="text-[1.75rem] font-bold tracking-tight text-foreground sm:text-3xl">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-[15px] text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function DashboardPanel({
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
        "overflow-hidden rounded-[1.25rem] border border-black/[0.04] bg-card shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.04)]",
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

export function DashboardPanelHeader({
  title,
  description,
  icon: Icon,
  action,
  iconClassName,
}: {
  title: string;
  description?: string;
  icon?: LucideIcon;
  action?: React.ReactNode;
  iconClassName?: string;
}) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div className="flex items-start gap-3">
        {Icon && (
          <div
            className={cn(
              "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10",
              iconClassName,
            )}
          >
            <Icon className="h-5 w-5 text-primary" aria-hidden />
          </div>
        )}
        <div>
          <h2 className="text-[17px] font-semibold tracking-tight">{title}</h2>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
      {action}
    </div>
  );
}

export function DashboardListRow({
  href,
  title,
  subtitle,
  trailing,
  onClick,
}: {
  href?: string;
  title: string;
  subtitle?: string;
  trailing?: React.ReactNode;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-medium">{title}</p>
        {subtitle && (
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {trailing}
        {href && (
          <ChevronRight className="h-4 w-4 text-muted-foreground/60" aria-hidden />
        )}
      </div>
    </>
  );

  const className =
    "flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-colors active:scale-[0.99] hover:bg-black/[0.03]";

  if (href) {
    return (
      <Link href={href} className={className}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={cn(className, "w-full text-left")}>
      {content}
    </button>
  );
}

export function DashboardEmptyState({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-10 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted/80">
        <Icon className="h-6 w-6 text-muted-foreground" aria-hidden />
      </div>
      <p className="text-[15px] font-medium">{title}</p>
      {description && (
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
