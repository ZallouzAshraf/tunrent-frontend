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
  Sparkles,
  Star,
  Users,
  Wrench,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { NotificationUnreadBadge } from "@/components/dashboard/notification-unread-badge";
import { Logo } from "@/components/shared/logo";
import { canAccessRoute } from "@/lib/constants/permissions";
import { useUnreadNotificationsCount } from "@/lib/dashboard/use-dashboard-notifications";
import { useAuth } from "@/lib/auth/use-auth";
import { useLogout } from "@/lib/auth/use-logout";
import { cn } from "@/lib/utils";
import type { AgencyUserRole } from "@/types";

type NavItem = {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
};

const navSections: { titleKey: string; items: NavItem[] }[] = [
  {
    titleKey: "sections.main",
    items: [
      { href: "/dashboard", labelKey: "overview", icon: LayoutDashboard },
      { href: "/dashboard/bookings", labelKey: "bookings", icon: CalendarDays },
      { href: "/dashboard/calendar", labelKey: "calendar", icon: Calendar },
      { href: "/dashboard/cars", labelKey: "cars", icon: Car },
    ],
  },
  {
    titleKey: "sections.activity",
    items: [
      { href: "/dashboard/availability", labelKey: "availability", icon: Wrench },
      { href: "/dashboard/payments", labelKey: "payments", icon: CreditCard },
      { href: "/dashboard/reviews", labelKey: "reviews", icon: Star },
      { href: "/dashboard/notifications", labelKey: "notifications", icon: Bell },
    ],
  },
  {
    titleKey: "sections.admin",
    items: [
      { href: "/dashboard/stats", labelKey: "stats", icon: BarChart3 },
      { href: "/dashboard/team", labelKey: "team", icon: Users },
      { href: "/dashboard/settings/agency", labelKey: "agency", icon: Settings },
      {
        href: "/dashboard/settings/billing",
        labelKey: "billing",
        icon: CreditCard,
      },
    ],
  },
];

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  badge,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
  badge?: number;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition-all duration-200",
        active
          ? "bg-primary text-primary-foreground shadow-[0_4px_14px_rgba(30,58,95,0.22)]"
          : "text-muted-foreground hover:bg-black/[0.04] hover:text-foreground",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          active ? "text-primary-foreground" : "text-muted-foreground group-hover:text-primary",
        )}
        aria-hidden
      />
      <span className="flex-1 font-medium leading-none">{label}</span>
      {badge != null && badge > 0 && (
        <NotificationUnreadBadge
          count={badge}
          variant="pill"
          className={active ? "bg-accent text-accent-foreground" : undefined}
        />
      )}
    </Link>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const t = useTranslations("dashboard");
  const { agencyRole } = useAuth();
  const logout = useLogout();
  const unreadCount = useUnreadNotificationsCount();

  const isActive = (href: string) =>
    href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname.startsWith(href);

  return (
    <aside className="sticky top-0 hidden h-screen w-[17rem] shrink-0 flex-col border-r border-black/[0.06] bg-white/75 px-3 py-4 backdrop-blur-2xl lg:flex">
      <div className="mb-4 px-1.5">
        <Logo href="/dashboard" size="sm" />
        <p className="mt-1.5 text-[11px] text-muted-foreground">{t("agencySpace")}</p>
      </div>

      <nav className="flex min-h-0 flex-1 flex-col justify-between px-0.5">
        <div className="space-y-3">
          {navSections.map((section) => {
            const visibleItems = section.items.filter((item) =>
              canAccessRoute(item.href, agencyRole ?? undefined),
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.titleKey}>
                <p className="mb-1 px-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground/75">
                  {t(section.titleKey)}
                </p>
                <div className="space-y-0.5">
                  {visibleItems.map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      label={t(item.labelKey)}
                      icon={item.icon}
                      active={isActive(item.href)}
                      badge={
                        item.href === "/dashboard/notifications"
                          ? unreadCount
                          : undefined
                      }
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t border-black/[0.06] pt-3">
          <button
            type="button"
            onClick={() => logout()}
            className="flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-black/[0.04] hover:text-foreground"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            {t("logout")}
          </button>
        </div>
      </nav>
    </aside>
  );
}

const mobileTabs: NavItem[] = [
  { href: "/dashboard", labelKey: "mobile.home", icon: LayoutDashboard },
  { href: "/dashboard/bookings", labelKey: "bookings", icon: CalendarDays },
  { href: "/dashboard/cars", labelKey: "cars", icon: Car },
  { href: "/dashboard/calendar", labelKey: "calendar", icon: Calendar },
  { href: "/dashboard/notifications", labelKey: "mobile.alerts", icon: Bell },
];

export function DashboardMobileNav({ role }: { role?: AgencyUserRole }) {
  const pathname = usePathname();
  const t = useTranslations("dashboard");
  const unreadCount = useUnreadNotificationsCount();
  const visibleItems = mobileTabs.filter((item) =>
    canAccessRoute(item.href, role),
  );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-black/[0.06] bg-white/85 px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2 backdrop-blur-2xl lg:hidden">
      <div className="mx-auto flex max-w-lg items-stretch justify-around gap-1">
        {visibleItems.map(({ href, labelKey, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(href);

          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center gap-1 rounded-2xl px-2 py-2 text-[10px] font-medium transition-colors",
                active ? "text-primary" : "text-muted-foreground",
              )}
            >
              <div
                className={cn(
                  "relative flex h-9 w-9 items-center justify-center rounded-2xl transition-colors",
                  active && "bg-primary/10",
                )}
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden />
                {href === "/dashboard/notifications" && (
                  <NotificationUnreadBadge
                    count={unreadCount}
                    variant="dot"
                    className="-right-0.5 -top-0.5"
                  />
                )}
              </div>
              <span className="truncate">{t(labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export function DashboardMobileHeader() {
  const { user } = useAuth();
  const t = useTranslations("dashboard");

  return (
    <div className="flex items-center justify-between gap-3 px-1 lg:hidden">
      <Logo href="/dashboard" size="sm" showText={false} className="shrink-0" />
      <div className="min-w-0 flex-1">
        <div className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-primary/8 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
          <Sparkles className="h-3 w-3" aria-hidden />
          {t("mobile.badge")}
        </div>
        <p className="text-xl font-bold tracking-tight">
          {t("mobile.greeting", { name: user?.firstName ?? "" })}
        </p>
      </div>
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground shadow-[0_4px_12px_rgba(30,58,95,0.2)]">
        {user?.firstName?.[0]}
        {user?.lastName?.[0]}
      </div>
    </div>
  );
}
