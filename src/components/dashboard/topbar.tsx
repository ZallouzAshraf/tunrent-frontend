"use client";

import { Bell } from "lucide-react";
import { Link } from "@/i18n/routing";
import { NotificationUnreadBadge } from "@/components/dashboard/notification-unread-badge";
import { useUnreadNotificationsCount } from "@/lib/dashboard/use-dashboard-notifications";
import { useAuth } from "@/lib/auth/use-auth";
import { AgencyUserRole } from "@/types";

const roleLabels: Record<AgencyUserRole, string> = {
  [AgencyUserRole.OWNER]: "Propriétaire",
  [AgencyUserRole.MANAGER]: "Manager",
  [AgencyUserRole.AGENT]: "Agent",
};

export function DashboardTopbar() {
  const { user, agencyRole } = useAuth();
  const unreadCount = useUnreadNotificationsCount();

  return (
    <header className="sticky top-0 z-40 hidden border-b border-black/[0.06] bg-[#F2F2F7]/80 px-6 py-4 backdrop-blur-2xl lg:block">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Bonjour, {user?.firstName}
          </p>
          <h2 className="text-2xl font-bold tracking-tight">
            Tableau de bord
          </h2>
        </div>

        <div className="flex items-center gap-3">
          {agencyRole && (
            <span className="inline-flex rounded-full border border-black/[0.06] bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-primary shadow-sm">
              {roleLabels[agencyRole]}
            </span>
          )}

          <Link
            href="/dashboard/notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-black/[0.06] bg-white/80 text-foreground shadow-sm transition-transform active:scale-95 hover:bg-white"
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`
                : "Notifications"
            }
          >
            <Bell className="h-5 w-5" />
            <NotificationUnreadBadge count={unreadCount} variant="dot" />
          </Link>

          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-[0_4px_12px_rgba(30,58,95,0.22)]">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
        </div>
      </div>
    </header>
  );
}
