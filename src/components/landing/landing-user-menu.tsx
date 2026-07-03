"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  User,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuth } from "@/lib/auth/use-auth";
import { useLogout } from "@/lib/auth/use-logout";
import { cn } from "@/lib/utils";
import type { User as AuthUser } from "@/types";

function UserInitials({ user, className }: { user: AuthUser; className?: string }) {
  const initials = `${user.firstName?.[0] ?? ""}${user.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-semibold text-primary-foreground shadow-sm",
        className,
      )}
      aria-hidden
    >
      {initials || "?"}
    </span>
  );
}

interface LandingUserMenuProps {
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

export function LandingUserMenu({
  variant = "desktop",
  onNavigate,
}: LandingUserMenuProps) {
  const t = useTranslations("landing.header");
  const tAuth = useTranslations("auth");
  const { user, isDashboard } = useAuth();
  const logout = useLogout();
  const [open, setOpen] = useState(false);

  if (!user) return null;

  const showSpaceLink = !isDashboard;
  const spaceHref = "/account";
  const spaceLabel = t("myAccount");

  const handleLogout = () => {
    setOpen(false);
    onNavigate?.();
    void logout();
  };

  if (variant === "mobile") {
    return (
      <div className="mx-4 overflow-hidden rounded-2xl border bg-muted/30">
        <div className="flex items-center gap-3 px-4 py-3">
          <UserInitials user={user} className="size-11 text-sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
          {isDashboard && (
            <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
              {t("agencyBadge")}
            </span>
          )}
        </div>

        <div className="border-t bg-background/80 p-2">
          {showSpaceLink && (
            <Link
              href={spaceHref}
              onClick={onNavigate}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <User className="size-4 text-muted-foreground" />
              {spaceLabel}
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5"
          >
            <LogOut className="size-4" />
            {tAuth("logout")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex items-center gap-1.5 rounded-full border bg-background/80 py-1 ps-1 pe-2.5 shadow-sm transition-colors hover:bg-secondary/60"
          aria-label={`${user.firstName} ${user.lastName}`}
        >
          <UserInitials user={user} className="size-8" />
          <ChevronDown
            className={cn(
              "size-3.5 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        </button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-64 p-0">
        <div className="flex items-center gap-3 border-b px-4 py-3.5">
          <UserInitials user={user} />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-semibold">
              {user.firstName} {user.lastName}
            </p>
            <p className="truncate text-xs text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <div className="p-1.5">
          {showSpaceLink && (
            <Link
              href={spaceHref}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-secondary"
            >
              <User className="size-4 text-muted-foreground" />
              {spaceLabel}
            </Link>
          )}
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive transition-colors hover:bg-destructive/5"
          >
            <LogOut className="size-4" />
            {tAuth("logout")}
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function LandingAuthActions({
  variant = "desktop",
  onNavigate,
}: LandingUserMenuProps) {
  const tCommon = useTranslations("common");
  const t = useTranslations("landing.header");
  const { isAuthenticated, isLoading, isDashboard } = useAuth();

  if (isLoading) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-full bg-muted",
          variant === "desktop" ? "size-9" : "mx-4 h-16",
        )}
        aria-hidden
      />
    );
  }

  if (isAuthenticated) {
    return <LandingUserMenu variant={variant} onNavigate={onNavigate} />;
  }

  if (variant === "mobile") {
    return (
      <Button variant="outline" asChild className="mx-4">
        <Link href="/login" onClick={onNavigate}>
          {tCommon("login")}
        </Link>
      </Button>
    );
  }

  return (
    <Button variant="ghost" size="sm" asChild>
      <Link href="/login">{tCommon("login")}</Link>
    </Button>
  );
}

export function LandingPrimaryCta({
  onNavigate,
  variant = "desktop",
}: {
  onNavigate?: () => void;
  variant?: "desktop" | "mobile";
}) {
  const tCommon = useTranslations("common");
  const t = useTranslations("landing.header");
  const { isAuthenticated, isLoading, isDashboard } = useAuth();

  const buttonClass = variant === "mobile" ? "w-full" : undefined;

  if (isLoading) {
    return (
      <div
        className={cn(
          "animate-pulse rounded-md bg-muted",
          variant === "mobile" ? "mx-4 h-10" : "h-9 w-28",
        )}
        aria-hidden
      />
    );
  }

  if (isAuthenticated && isDashboard) {
    return (
      <Button size="sm" className={buttonClass} asChild>
        <Link href="/dashboard" onClick={onNavigate}>
          <LayoutDashboard className="size-4" />
          {t("dashboard")}
        </Link>
      </Button>
    );
  }

  return (
    <Button size="sm" className={buttonClass} asChild>
      <Link href="/cars" onClick={onNavigate}>
        {tCommon("book")}
      </Link>
    </Button>
  );
}
