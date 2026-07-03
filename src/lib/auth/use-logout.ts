"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "@/i18n/routing";
import { authApi } from "@/lib/api";
import { setAgencyId } from "@/lib/api/client";
import {
  setGlobalAccessToken,
  useAuthContext,
} from "@/lib/auth/auth-context";

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
    setAccessToken(null);
    setGlobalAccessToken(null);
    setAgencyId(null);
    queryClient.clear();
    router.push("/login");
  };
}
