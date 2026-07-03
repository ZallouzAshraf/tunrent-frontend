"use client";

import { useSessionBootstrap } from "@/lib/auth/use-session-bootstrap";
import { useAuthContext } from "@/lib/auth/auth-context";

function AuthSpinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
    </div>
  );
}

export function SessionBootstrap({ children }: { children: React.ReactNode }) {
  useSessionBootstrap();
  const { isBootstrapping } = useAuthContext();

  if (isBootstrapping) {
    return <AuthSpinner />;
  }

  return children;
}
