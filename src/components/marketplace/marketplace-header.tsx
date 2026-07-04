"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname, Link } from "@/i18n/routing";
import { Logo } from "@/components/shared/logo";
import { useAuth } from "@/lib/auth/use-auth";
import { useLogout } from "@/lib/auth/use-logout";
import { Button } from "@/components/ui/button";
import { Car, Building2, User, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function MarketplaceHeader() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user } = useAuth();
  const logout = useLogout();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    { href: "/cars", label: locale === "ar" ? "السيارات" : "Voitures", icon: Car },
    { href: "/agencies", label: locale === "ar" ? "الوكالات" : "Agences", icon: Building2 },
  ];

  const switchLocale = () => {
    const next = locale === "fr" ? "ar" : "fr";
    router.replace(pathname, { locale: next });
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-8">
          <Logo size="sm" />

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary",
                  pathname.startsWith(item.href) && "bg-secondary text-primary",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={switchLocale}>
            {locale === "fr" ? "عربي" : "FR"}
          </Button>
          {isAuthenticated ? (
            <>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/account">
                  <User className="h-4 w-4" />
                  {user?.firstName}
                </Link>
              </Button>
              <Button variant="outline" size="sm" onClick={() => void logout()}>
                {locale === "ar" ? "خروج" : "Déconnexion"}
              </Button>
            </>
          ) : (
            <Button size="sm" asChild>
              <Link href="/login">{locale === "ar" ? "تسجيل الدخول" : "Se connecter"}</Link>
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {mobileOpen && (
        <div className="border-t md:hidden">
          <nav className="flex flex-col gap-1 p-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-secondary"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            ))}
            <Separator className="my-2" />
            <Button variant="ghost" size="sm" onClick={switchLocale} className="justify-start">
              {locale === "fr" ? "عربي" : "Français"}
            </Button>
            {isAuthenticated ? (
              <>
                <Button variant="ghost" size="sm" asChild className="justify-start">
                  <Link href="/account" onClick={() => setMobileOpen(false)}>
                    {locale === "ar" ? "حسابي" : "Mon compte"}
                  </Link>
                </Button>
                <Button variant="outline" size="sm" onClick={() => void logout()}>
                  {locale === "ar" ? "خروج" : "Déconnexion"}
                </Button>
              </>
            ) : (
              <Button size="sm" asChild>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  {locale === "ar" ? "تسجيل الدخول" : "Se connecter"}
                </Link>
              </Button>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

function Separator({ className }: { className?: string }) {
  return <div className={cn("h-px bg-border", className)} />;
}
