/**
 * TunRent auth session — single source of truth for client-side auth.
 *
 * ## Signals (intentionally two-layer)
 * - **Edge (middleware):** `tunrent_logged_in=1` cookie — fast route gate, works without JS
 * - **Client (this module):** same cookie → POST /auth/refresh → in-memory access JWT
 *
 * Middleware and bootstrap MUST agree on LOGGED_IN_COOKIE (see constants.ts).
 * Access token is NEVER stored in localStorage/sessionStorage (XSS mitigation).
 * Refresh token is httpOnly cookie `tunrent_rt` (not readable from JS).
 *
 * @see docs/AUTH.md
 */

import { apiClient } from "@/lib/api/client";
import {
  getGlobalAccessToken,
  setGlobalAccessToken,
} from "@/lib/auth/auth-context";
import { LOGGED_IN_COOKIE } from "@/lib/auth/constants";

export { LOGGED_IN_COOKIE, HOME_COOKIE } from "@/lib/auth/constants";

/** In-flight refresh lock — shared by bootstrap and 401 interceptor. */
let refreshPromise: Promise<string | null> | null = null;

export function hasLoggedInCookie(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie
    .split(";")
    .some((c) => c.trim().startsWith(`${LOGGED_IN_COOKIE}=1`));
}

export function storeAccessToken(
  token: string | null,
  setAccessToken?: (token: string | null) => void,
): void {
  setGlobalAccessToken(token);
  setAccessToken?.(token);
}

export function getAccessToken(): string | null {
  return getGlobalAccessToken();
}

/**
 * Refresh access token using httpOnly refresh cookie (sent via withCredentials).
 * Deduplicates concurrent refresh calls (multi-tab / parallel 401s).
 */
export async function refreshAccessToken(
  setAccessToken?: (token: string | null) => void,
): Promise<string | null> {
  refreshPromise ??= apiClient
    .post<{ access_token: string }>("/auth/refresh")
    .then((res) => {
      const token = res.data.access_token;
      storeAccessToken(token, setAccessToken);
      return token;
    })
    .catch(() => {
      storeAccessToken(null, setAccessToken);
      return null;
    })
    .finally(() => {
      refreshPromise = null;
    });

  return refreshPromise;
}

export async function bootstrapSession(
  setAccessToken: (token: string | null) => void,
): Promise<void> {
  if (!hasLoggedInCookie()) {
    storeAccessToken(null, setAccessToken);
    return;
  }
  await refreshAccessToken(setAccessToken);
}

export function clearClientSession(
  setAccessToken: (token: string | null) => void,
): void {
  storeAccessToken(null, setAccessToken);
}
