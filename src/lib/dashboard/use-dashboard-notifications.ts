"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardApi } from "@/lib/api";
import { useAuth } from "@/lib/auth/use-auth";

export function useDashboardNotifications() {
  const { agencyId } = useAuth();

  return useQuery({
    queryKey: ["dashboard", "notifications", agencyId],
    queryFn: async () =>
      (await dashboardApi.getNotifications(agencyId ?? undefined)).data,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
}

export function useUnreadNotificationsCount() {
  const { data } = useDashboardNotifications();
  return data?.filter((n) => !n.isRead).length ?? 0;
}
