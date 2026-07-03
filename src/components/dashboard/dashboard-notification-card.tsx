"use client";

import { Check, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  extractBookingReference,
  getNotificationAction,
  getNotificationVisual,
} from "@/lib/dashboard/notification-config";
import { cn, formatDate, formatRelativeTime } from "@/lib/utils";
import type { Notification } from "@/types";

type DashboardNotificationCardProps = {
  notification: Notification;
  onMarkRead: (id: string) => void;
  isMarkingRead?: boolean;
};

export function DashboardNotificationCard({
  notification,
  onMarkRead,
  isMarkingRead,
}: DashboardNotificationCardProps) {
  const visual = getNotificationVisual(notification.type);
  const action = getNotificationAction(notification);
  const Icon = visual.icon;
  const reference = extractBookingReference(notification.message);
  const isUnread = !notification.isRead;

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl border bg-card transition-all duration-200",
        "hover:border-primary/25 hover:shadow-md",
        isUnread
          ? cn(
              "border-l-[3px] shadow-sm",
              visual.unreadAccentClassName,
              "bg-gradient-to-r from-secondary/50 via-card to-card",
            )
          : "border-border/60 opacity-90 hover:opacity-100",
      )}
    >
      <div className="flex gap-4 p-4 sm:p-5">
        <div
          className={cn(
            "relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105",
            visual.iconBgClassName,
          )}
        >
          <Icon className={cn("h-5 w-5", visual.iconClassName)} aria-hidden />
          {isUnread && (
            <span
              className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-accent ring-2 ring-card"
              aria-hidden
            />
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-3">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0 space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={cn(
                    "text-base leading-snug",
                    isUnread ? "font-semibold text-foreground" : "font-medium",
                  )}
                >
                  {notification.title}
                </h3>
                {reference && (
                  <Badge variant="outline" className="font-mono text-[11px]">
                    {reference}
                  </Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                <time dateTime={notification.createdAt} title={formatDate(notification.createdAt)}>
                  {formatRelativeTime(notification.createdAt)}
                </time>
                <span className="mx-1.5 text-border">·</span>
                {formatDate(notification.createdAt)}
              </p>
            </div>

            <Badge
              variant="secondary"
              className="shrink-0 bg-secondary/80 text-[11px] font-medium uppercase tracking-wide text-primary"
            >
              {visual.label}
            </Badge>
          </div>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {notification.message}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {action && (
              <Button asChild size="sm" className="gap-1.5 shadow-sm">
                <Link href={action.href}>
                  {action.label}
                  <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            )}

            {isUnread && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 bg-background/80"
                onClick={() => onMarkRead(notification.id)}
                disabled={isMarkingRead}
              >
                <Check className="h-3.5 w-3.5" />
                Marquer lu
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

export function DashboardNotificationCardSkeleton() {
  return (
    <div className="flex gap-4 rounded-xl border bg-card p-4 sm:p-5">
      <div className="h-12 w-12 shrink-0 animate-pulse rounded-xl bg-muted" />
      <div className="flex-1 space-y-3">
        <div className="flex justify-between gap-4">
          <div className="space-y-2">
            <div className="h-4 w-48 animate-pulse rounded bg-muted" />
            <div className="h-3 w-32 animate-pulse rounded bg-muted" />
          </div>
          <div className="h-5 w-16 animate-pulse rounded-full bg-muted" />
        </div>
        <div className="h-4 w-full animate-pulse rounded bg-muted" />
        <div className="h-8 w-36 animate-pulse rounded-md bg-muted" />
      </div>
    </div>
  );
}
