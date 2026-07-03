"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/routing";
import { AccountSidebar } from "@/components/account/sidebar";
import { useAuth } from "@/lib/auth/use-auth";

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isLoading, isAuthenticated, isDashboard } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace("/login?redirect=/account");
      return;
    }

    if (isDashboard) {
      router.replace("/dashboard");
    }
  }, [isLoading, isAuthenticated, isDashboard, router]);

  if (isLoading) {
    return <AuthSpinner />;
  }

  if (!isAuthenticated || isDashboard) {
    return <AuthSpinner />;
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-8 lg:flex-row">
      <AccountSidebar />
      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}

function AuthSpinner() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}
