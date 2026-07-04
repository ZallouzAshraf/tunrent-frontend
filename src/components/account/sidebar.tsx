"use client";

import {
  Bell,
  CalendarDays,
  Car,
  FileText,
  LayoutDashboard,
  LogOut,
  Shield,
  Star,
  User,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/shared/logo";
import { useAuth } from "@/lib/auth/use-auth";
import { useLogout } from "@/lib/auth/use-logout";

const navItems = [
  { href: "/account", labelKey: "overview", icon: LayoutDashboard },
  { href: "/account/bookings", labelKey: "bookings", icon: CalendarDays },
  { href: "/account/profile", labelKey: "profile", icon: User },
  { href: "/account/documents", labelKey: "documents", icon: FileText },
  { href: "/account/reviews", labelKey: "reviews", icon: Star },
  { href: "/account/notifications", labelKey: "notifications", icon: Bell },
  { href: "/account/security", labelKey: "security", icon: Shield },
] as const;

export function AccountSidebar() {
  const pathname = usePathname();
  const t = useTranslations("account");
  const { user } = useAuth();
  const logout = useLogout();

  const handleLogout = () => logout();

  return (
    <aside className="flex w-full flex-col lg:w-64 lg:shrink-0">
      <div className="mb-4 lg:hidden">
        <Logo href="/" size="sm" />
      </div>
      <div className="rounded-xl border bg-card p-4 shadow-sm">
        <div className="mb-4 hidden lg:block">
          <Logo href="/" size="sm" showText={false} />
        </div>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
          <div className="min-w-0">
            <p className="truncate font-medium">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </div>
        <Separator className="mb-3" />
        <nav className="space-y-1">
          {navItems.map(({ href, labelKey, icon: Icon }) => {
            const active =
              href === "/account"
                ? pathname === "/account"
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
                {t(labelKey)}
              </Link>
            );
          })}
        </nav>
        <Separator className="my-3" />
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-muted-foreground"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          {t("logout")}
        </Button>
      </div>
      <Link
        href="/cars"
        className="mt-4 flex items-center gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground hover:border-primary hover:text-primary transition-colors"
      >
        <Car className="h-4 w-4" />
        {t("rentCar")}
      </Link>
    </aside>
  );
}
