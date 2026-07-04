"use client";

import { useEffect } from "react";
import { setAgencyId } from "@/lib/api/client";
import { useAuthContext } from "@/lib/auth/auth-context";
import { useCurrentUser } from "@/lib/auth/use-current-user";

import { RoleGlobal } from "@/types";

export function useAuth() {
  const { accessToken, isBootstrapping } = useAuthContext();
  const { data: me, isLoading: isLoadingUser } = useCurrentUser();

  useEffect(() => {
    setAgencyId(me?.agencyId ?? null);
  }, [me?.agencyId]);

  return {
    accessToken,
    isBootstrapping,
    isLoading: isBootstrapping || (!!accessToken && isLoadingUser),
    isAuthenticated: !!accessToken,
    user: me?.user ?? null,
    agencyId: me?.agencyId ?? null,
    agencyRole: me?.agencyRole ?? null,
    isDashboard: !!me?.agencyId,
    isSuperAdmin: me?.user?.roleGlobal === RoleGlobal.SUPER_ADMIN,
  };
}
