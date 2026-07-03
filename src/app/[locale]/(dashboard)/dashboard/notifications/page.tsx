"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardApi } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth/use-auth";

export default function DashboardNotificationsPage() {
  const queryClient = useQueryClient();
  const { agencyId } = useAuth();

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["dashboard", "notifications", agencyId],
    queryFn: async () =>
      (await dashboardApi.getNotifications(agencyId ?? undefined)).data,
  });

  const markRead = useMutation({
    mutationFn: (id: string) => dashboardApi.markRead(id),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "notifications"],
      }),
  });

  const markAllRead = useMutation({
    mutationFn: () =>
      dashboardApi.markAllRead(agencyId ?? undefined),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["dashboard", "notifications"],
      }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Centre de notifications agence</p>
        </div>
        {(notifications?.length ?? 0) > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => markAllRead.mutate()}
            disabled={markAllRead.isPending}
          >
            Tout marquer lu
          </Button>
        )}
      </div>

      {isLoading ? (
        <Skeleton className="h-48" />
      ) : !notifications?.length ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12">
            <Bell className="h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">Aucune notification</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <Card
              key={n.id}
              className={cn(!n.isRead && "border-primary/30 bg-secondary/30")}
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle className="text-base">{n.title}</CardTitle>
                    <CardDescription>{formatDate(n.createdAt)}</CardDescription>
                  </div>
                  {!n.isRead && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => markRead.mutate(n.id)}
                    >
                      Marquer lu
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{n.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
