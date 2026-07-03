"use client";

import {
  BarChart3,
  Bell,
  Calendar,
  CalendarDays,
  Car,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Settings,
  Star,
  Users,
  Wrench,
} from "lucide-react";
import { Link, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { canAccessRoute } from "@/lib/constants/permissions";
import { useAuth } from "@/lib/auth/use-auth";
import { useLogout } from "@/lib/auth/use-logout";
import { cn } from "@/lib/utils";
import type { AgencyUserRole } from "@/types";

const navItems: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}[] = [
  { href: "/dashboard", label: "Vue d'ensemble", icon: LayoutDashboard },
  { href: "/dashboard/cars", label: "Voitures", icon: Car },
  { href: "/dashboard/bookings", label: "Réservations", icon: CalendarDays },
  { href: "/dashboard/calendar", label: "Calendrier", icon: Calendar },
  { href: "/dashboard/availability", label: "Disponibilités", icon: Wrench },
  { href: "/dashboard/payments", label: "Paiements", icon: CreditCard },
  { href: "/dashboard/reviews", label: "Avis", icon: Star },
  { href: "/dashboard/notifications", label: "Notifications", icon: Bell },
  { href: "/dashboard/stats", label: "Statistiques", icon: BarChart3 },
  { href: "/dashboard/team", label: "Équipe", icon: Users },
  { href: "/dashboard/settings/agency", label: "Agence", icon: Settings },
  {
    href: "/dashboard/settings/billing",
    label: "Facturation",
    icon: CreditCard,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { agencyRole } = useAuth();
  const logout = useLogout();

  const visibleItems = navItems.filter((item) =>
    canAccessRoute(item.href, agencyRole ?? undefined),
  );

  const handleLogout = () => logout();

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-e bg-card">
      <div className="flex h-16 items-center gap-2 border-b px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Car className="h-4 w-4" />
        </div>
        <span className="font-bold text-primary">TunRent</span>
      </div>
      <nav className="flex-1 space-y-1 p-4 overflow-y-auto">
        {visibleItems.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t p-4">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Déconnexion
        </Button>
      </div>
    </aside>
  );
}

export function DashboardMobileNav({ role }: { role?: AgencyUserRole }) {
  const pathname = usePathname();
  const visibleItems = navItems.filter((item) =>
    canAccessRoute(item.href, role),
  );

  return (
    <nav className="flex gap-1 overflow-x-auto border-b bg-card p-2 lg:hidden">
      {visibleItems.slice(0, 6).map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex shrink-0 flex-col items-center gap-1 rounded-lg px-3 py-2 text-xs",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground",
            )}
          >
            <Icon className="h-4 w-4" />
            {label.split(" ")[0]}
          </Link>
        );
      })}
    </nav>
  );
}
