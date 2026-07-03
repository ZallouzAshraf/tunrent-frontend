"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Menu, X, Globe } from "lucide-react";
import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/cars" as const, key: "cars" },
  { href: "/agencies" as const, key: "agencies" },
  { href: "/comment-ca-marche" as const, key: "howItWorks" },
  { href: "/devenir-partenaire" as const, key: "becomePartner" },
] as const;

export function Header() {
  const t = useTranslations("landing.header");
  const tCommon = useTranslations("common");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const switchLocale = (newLocale: "fr" | "ar") => {
    router.replace(pathname, { locale: newLocale });
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Logo size="sm" />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {navLinks.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-secondary hover:text-primary",
                pathname === link.href && "bg-secondary text-primary",
              )}
            >
              {t(link.key)}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <div className="relative flex items-center rounded-lg border bg-muted/50 p-0.5">
            <Globe className="ms-2 size-4 text-muted-foreground" aria-hidden />
            <button
              type="button"
              onClick={() => switchLocale("fr")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                locale === "fr"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label={tCommon("french")}
            >
              FR
            </button>
            <button
              type="button"
              onClick={() => switchLocale("ar")}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                locale === "ar"
                  ? "bg-background text-primary shadow-sm"
                  : "text-muted-foreground hover:text-foreground",
              )}
              aria-label={tCommon("arabic")}
            >
              ع
            </button>
          </div>

          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">{tCommon("login")}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/cars">{tCommon("book")}</Link>
          </Button>
        </div>

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border lg:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? tCommon("close") : tCommon("menu")}
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t bg-background lg:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-4" aria-label="Mobile">
            {navLinks.map((link) => (
              <Link
                key={link.key}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary",
                  pathname === link.href && "bg-secondary text-primary",
                )}
              >
                {t(link.key)}
              </Link>
            ))}

            <div className="my-2 border-t" />

            <div className="flex items-center gap-2 px-4 py-2">
              <span className="text-sm text-muted-foreground">
                {tCommon("language")}
              </span>
              <button
                type="button"
                onClick={() => switchLocale("fr")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium",
                  locale === "fr" ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                FR
              </button>
              <button
                type="button"
                onClick={() => switchLocale("ar")}
                className={cn(
                  "rounded-md px-3 py-1.5 text-sm font-medium",
                  locale === "ar" ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                ع
              </button>
            </div>

            <div className="flex flex-col gap-2 px-4 pt-2">
              <Button variant="outline" asChild>
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  {tCommon("login")}
                </Link>
              </Button>
              <Button asChild>
                <Link href="/cars" onClick={() => setMobileOpen(false)}>
                  {tCommon("book")}
                </Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
