"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import {
  DashboardMobileNav,
  DashboardSidebar,
} from "@/components/dashboard/sidebar";
import { DashboardTopbar } from "@/components/dashboard/topbar";
import { canAccessRoute } from "@/lib/constants/permissions";
import { useAuth } from "@/lib/auth/use-auth";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { isLoading, isAuthenticated, isDashboard, agencyRole } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login?redirect=/dashboard");
      return;
    }

    if (!isDashboard) {
      router.replace("/account");
      return;
    }

    if (!canAccessRoute(pathname, agencyRole ?? undefined)) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, isDashboard, pathname, agencyRole, router]);

  if (isLoading) {
    return <AuthSpinner />;
  }

  if (!isAuthenticated || !isDashboard) {
    return <AuthSpinner />;
  }

  if (!canAccessRoute(pathname, agencyRole ?? undefined)) {
    return <AuthSpinner />;
  }

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar />
        <DashboardMobileNav role={agencyRole ?? undefined} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}

function AuthSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
