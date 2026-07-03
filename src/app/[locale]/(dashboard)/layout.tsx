"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/routing";
import {
  DashboardMobileHeader,
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
    <div className="flex min-h-screen bg-[#F2F2F7]">
      <DashboardSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-5 pb-28 lg:px-8 lg:py-8 lg:pb-8">
          <div className="mb-5 lg:hidden">
            <DashboardMobileHeader />
          </div>
          {children}
        </main>
        <DashboardMobileNav role={agencyRole ?? undefined} />
      </div>
    </div>
  );
}

function AuthSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F2F2F7]">
      <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-primary/20 border-t-primary" />
    </div>
  );
}
