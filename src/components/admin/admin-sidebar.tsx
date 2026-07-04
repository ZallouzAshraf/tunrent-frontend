"use client";

import {
  Building2,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Shield,
  Users,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { useLogout } from "@/lib/auth/use-logout";
import { cn } from "@/lib/utils";

type AdminNavItem = {
  href: string;
  labelKey: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

const navSections: { titleKey: string; items: AdminNavItem[] }[] = [
  {
    titleKey: "sections.platform",
    items: [
      { href: "/admin", labelKey: "overview", icon: LayoutDashboard, exact: true },
      { href: "/admin/agencies", labelKey: "agencies", icon: Building2 },
      { href: "/admin/users", labelKey: "users", icon: Users },
    ],
  },
  {
    titleKey: "sections.billing",
    items: [
      { href: "/admin/plan-requests", labelKey: "planRequests", icon: CreditCard },
    ],
  },
];

function NavItem({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
        active
          ? "bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "text-slate-400 hover:bg-white/[0.06] hover:text-slate-100",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4 shrink-0",
          active ? "text-amber-400" : "text-slate-500 group-hover:text-slate-300",
        )}
      />
      {label}
    </Link>
  );
}

export function AdminSidebar() {
  const pathname = usePathname();
  const t = useTranslations("admin");
  const logout = useLogout();

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-[17.5rem] flex-col border-r border-white/[0.06] bg-[#0f172a] lg:flex">
      <div className="flex h-full flex-col px-4 py-5">
        <div className="mb-8 flex items-center gap-3 px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-[#0f172a] shadow-lg shadow-amber-500/20">
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
              {t("brand")}
            </p>
            <p className="text-base font-bold text-white">{t("title")}</p>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.titleKey}>
              <p className="mb-2 px-3 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                {t(section.titleKey)}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => (
                  <NavItem
                    key={item.href}
                    href={item.href}
                    label={t(item.labelKey)}
                    icon={item.icon}
                    active={isActive(item.href, item.exact)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="mt-4 border-t border-white/[0.08] pt-4">
          <button
            type="button"
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
        </div>
      </div>
    </aside>
  );
}

export function AdminMobileNav() {
  const pathname = usePathname();
  const t = useTranslations("admin");
  const items = navSections.flatMap((s) => s.items);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex border-t border-black/[0.08] bg-white/95 px-2 py-2 backdrop-blur-xl lg:hidden">
      {items.map((item) => {
        const active = isActivePath(pathname, item.href, item.exact);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 rounded-xl py-2 text-[10px] font-medium",
              active ? "text-[#1e3a5f]" : "text-muted-foreground",
            )}
          >
            <item.icon className="h-5 w-5" />
            <span className="truncate px-1">{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function isActivePath(pathname: string, href: string, exact?: boolean) {
  return exact ? pathname === href : pathname.startsWith(href);
}
