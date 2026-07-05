"use client";

import { useEffect } from "react";
import {
  bootstrapSession,
  storeAccessToken,
} from "@/lib/auth/session";
import {
  registerTokenChangeHandler,
  useAuthContext,
} from "@/lib/auth/auth-context";

export function useSessionBootstrap() {
  const { setAccessToken, setIsBootstrapping } = useAuthContext();

  useEffect(() => {
    return registerTokenChangeHandler(setAccessToken);
  }, [setAccessToken]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        await bootstrapSession((token) => {
          if (!cancelled) storeAccessToken(token, setAccessToken);
        });
      } finally {
        if (!cancelled) setIsBootstrapping(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [setAccessToken, setIsBootstrapping]);
}
