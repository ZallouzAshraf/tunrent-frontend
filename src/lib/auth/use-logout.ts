"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/routing";
import { authApi } from "@/lib/api";
import { setAgencyId } from "@/lib/api/client";
import { useAuthContext } from "@/lib/auth/auth-context";
import { clearClientSession } from "@/lib/auth/session";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { setAccessToken } = useAuthContext();

  return async () => {
    try {
      await authApi.logout();
    } catch {
      /* clear client state even if API fails */
    }
    clearClientSession(setAccessToken);
    setAgencyId(null);
    queryClient.clear();
    router.push("/login");
  };
}
