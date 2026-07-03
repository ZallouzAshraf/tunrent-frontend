"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bell, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DashboardNotificationCard,
  DashboardNotificationCardSkeleton,
} from "@/components/dashboard/dashboard-notification-card";
import { dashboardApi } from "@/lib/api";
import {
  useDashboardNotifications,
  useUnreadNotificationsCount,
} from "@/lib/dashboard/use-dashboard-notifications";
import { useAuth } from "@/lib/auth/use-auth";

export default function DashboardNotificationsPage() {
  const queryClient = useQueryClient();
  const { agencyId } = useAuth();
  const unreadCount = useUnreadNotificationsCount();

  const { data: notifications, isLoading } = useDashboardNotifications();

  const markRead = useMutation({
    mutationFn: (id: string) => dashboardApi.markRead(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "notifications"],
      }),
  });

  const markAllRead = useMutation({
    mutationFn: () => dashboardApi.markAllRead(agencyId ?? undefined),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "notifications"],
      }),
  });

  const hasUnread = unreadCount > 0;

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10">
            <Bell className="h-6 w-6 text-primary" aria-hidden />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
              {hasUnread && (
                <Badge variant="default" className="bg-accent hover:bg-accent">
                  {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                </Badge>
              )}
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Restez informé des réservations, paiements et avis de votre agence
            </p>
          </div>
        </div>

        {(notifications?.length ?? 0) > 0 && hasUnread && (
          <Button
            variant="outline"
            size="sm"
            className="shrink-0 gap-2 self-start"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
          >
            <CheckCheck className="h-4 w-4" />
            Tout marquer lu
          </Button>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <DashboardNotificationCardSkeleton key={i} />
          ))}
        </div>
      ) : !notifications?.length ? (
        <div className="flex flex-col items-center gap-4 rounded-2xl border border-dashed bg-muted/20 px-6 py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-secondary">
            <Bell className="h-8 w-8 text-primary/60" aria-hidden />
          </div>
          <div className="space-y-1">
            <p className="font-medium">Aucune notification pour le moment</p>
            <p className="max-w-sm text-sm text-muted-foreground">
              Les nouvelles demandes de réservation et mises à jour apparaîtront ici.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <DashboardNotificationCard
              key={notification.id}
              notification={notification}
              onMarkRead={(id) => markRead.mutate(id)}
              isMarkingRead={
                markRead.isPending && markRead.variables === notification.id
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
