import { cn } from "@/lib/utils";

type NotificationUnreadBadgeProps = {
  count: number;
  className?: string;
  /** Compact dot for icon buttons; pill shows the count. */
  variant?: "dot" | "pill";
};

export function NotificationUnreadBadge({
  count,
  className,
  variant = "pill",
}: NotificationUnreadBadgeProps) {
  if (count <= 0) return null;

  if (variant === "dot") {
    return (
      <span
        className={cn(
          "absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-bold leading-none text-accent-foreground ring-2 ring-card",
          className,
        )}
        aria-hidden
      >
        {count > 9 ? "9+" : count}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-bold leading-none text-accent-foreground",
        className,
      )}
      aria-hidden
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
