"use client";

import { Bell } from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth/use-auth";
import { AgencyUserRole } from "@/types";

const roleLabels: Record<AgencyUserRole, string> = {
  [AgencyUserRole.OWNER]: "Propriétaire",
  [AgencyUserRole.MANAGER]: "Manager",
  [AgencyUserRole.AGENT]: "Agent",
};

export function DashboardTopbar() {
  const { user, agencyRole } = useAuth();

  return (
    <header className="flex h-16 items-center justify-between border-b bg-card px-4 lg:px-6">
      <div>
        <h2 className="text-sm font-medium text-muted-foreground">
          Espace agence
        </h2>
        <p className="text-lg font-semibold">
          Bonjour, {user?.firstName}
        </p>
      </div>
      <div className="flex items-center gap-3">
        {agencyRole && (
          <span className="hidden sm:inline-flex rounded-full bg-secondary px-3 py-1 text-xs font-medium text-primary">
            {roleLabels[agencyRole]}
          </span>
        )}
        <Link href="/dashboard/notifications">
          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
          {user?.firstName?.[0]}
          {user?.lastName?.[0]}
        </div>
      </div>
    </header>
  );
}
