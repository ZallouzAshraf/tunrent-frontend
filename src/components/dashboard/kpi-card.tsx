import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const accentStyles = {
  default: {
    wrap: "from-primary/10 via-white to-white",
    icon: "bg-primary/12 text-primary",
  },
  warning: {
    wrap: "from-amber-100/80 via-white to-white",
    icon: "bg-amber-100 text-amber-700",
  },
  success: {
    wrap: "from-emerald-100/80 via-white to-white",
    icon: "bg-emerald-100 text-emerald-700",
  },
  gold: {
    wrap: "from-[var(--tunrent-gold)]/15 via-white to-white",
    icon: "bg-[var(--tunrent-gold)]/20 text-[#9a7b2e]",
  },
} as const;

export function KpiCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
  accent = "default",
}: {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: { value: string; positive?: boolean };
  className?: string;
  accent?: keyof typeof accentStyles;
}) {
  const styles = accentStyles[accent];

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-[1.25rem] border border-black/[0.04] bg-gradient-to-br p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_30px_rgba(0,0,0,0.05)]",
        styles.wrap,
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-muted-foreground">
            {title}
          </p>
          <p className="mt-2 text-[1.75rem] font-bold tracking-tight tabular-nums">
            {value}
          </p>
          {description && (
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          )}
          {trend && (
            <p
              className={cn(
                "mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                trend.positive
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-700",
              )}
            >
              {trend.value}
            </p>
          )}
        </div>
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl",
            styles.icon,
          )}
        >
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      </div>
    </article>
  );
}
