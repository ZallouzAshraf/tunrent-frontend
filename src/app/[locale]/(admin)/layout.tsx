"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { AdminMobileNav, AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminTopbar } from "@/components/admin/admin-topbar";
import { useAuth } from "@/lib/auth/use-auth";
import { RoleGlobal } from "@/types";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoading, isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login?redirect=/admin");
      return;
    }

    if (user?.roleGlobal !== RoleGlobal.SUPER_ADMIN) {
      router.replace("/");
    }
  }, [isLoading, isAuthenticated, user?.roleGlobal, router]);

  if (isLoading || !isAuthenticated || user?.roleGlobal !== RoleGlobal.SUPER_ADMIN) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6f9]">
        <div className="h-10 w-10 animate-spin rounded-full border-[3px] border-[#1e3a5f]/20 border-t-[#1e3a5f]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9]">
      <AdminSidebar />
      <div className="flex min-h-screen flex-col lg:pl-[17.5rem]">
        <AdminTopbar />
        <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:py-8 lg:pb-8">
          {children}
        </main>
        <AdminMobileNav />
      </div>
    </div>
  );
}
