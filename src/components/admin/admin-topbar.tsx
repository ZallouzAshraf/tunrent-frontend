"use client";

import { usePathname } from "@/i18n/routing";
import { Shield } from "lucide-react";
import { useAuth } from "@/lib/auth/use-auth";

const PAGE_TITLES: Record<string, string> = {
  "/admin": "Vue d'ensemble",
  "/admin/agencies": "Agences",
  "/admin/users": "Utilisateurs",
  "/admin/plan-requests": "Plans & facturation",
};

export function AdminTopbar() {
  const pathname = usePathname();
  const { user } = useAuth();

  const pageTitle =
    Object.entries(PAGE_TITLES).find(([path]) =>
      path === "/admin" ? pathname === "/admin" : pathname.startsWith(path),
    )?.[1] ?? "Administration";

  return (
    <header className="sticky top-0 z-40 border-b border-black/[0.06] bg-[#f4f6f9]/85 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0 pl-12 lg:pl-0">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            <Shield className="h-3.5 w-3.5 text-[#1e3a5f]" />
            <span>Console super admin</span>
          </div>
          <h2 className="truncate text-xl font-bold tracking-tight sm:text-2xl">
            {pageTitle}
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden text-end sm:block">
            <p className="text-sm font-semibold text-foreground">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-muted-foreground">Super administrateur</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#1e3a5f] to-[#0f172a] text-sm font-bold text-white shadow-[0_4px_14px_rgba(15,23,42,0.25)]">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
        </div>
      </div>
    </header>
  );
}
