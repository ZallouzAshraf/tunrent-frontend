"use client";

import { useEffect } from "react";
import { apiClient } from "@/lib/api/client";
import { LOGGED_IN_COOKIE } from "@/lib/auth/constants";
import {
  registerTokenChangeHandler,
  setGlobalAccessToken,
  useAuthContext,
} from "@/lib/auth/auth-context";

export function useSessionBootstrap() {
  const { setAccessToken, setIsBootstrapping } = useAuthContext();

  useEffect(() => {
    return registerTokenChangeHandler(setAccessToken);
  }, [setAccessToken]);

  useEffect(() => {
    let cancelled = false;

    async function bootstrap() {
      const hasLoggedInFlag = document.cookie
        .split(";")
        .some((c) => c.trim().startsWith(`${LOGGED_IN_COOKIE}=1`));

      if (!hasLoggedInFlag) {
        if (!cancelled) {
          setAccessToken(null);
          setGlobalAccessToken(null);
          setIsBootstrapping(false);
        }
        return;
      }

      try {
        const res = await apiClient.post<{
          access_token: string;
        }>("/auth/refresh");
        if (!cancelled) {
          setAccessToken(res.data.access_token);
          setGlobalAccessToken(res.data.access_token);
        }
      } catch {
        if (!cancelled) {
          setAccessToken(null);
          setGlobalAccessToken(null);
        }
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    }

    bootstrap();
    return () => {
      cancelled = true;
    };
  }, [setAccessToken, setIsBootstrapping]);
}
