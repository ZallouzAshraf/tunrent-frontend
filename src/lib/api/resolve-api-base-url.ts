/**
 * Browser API base URL — always same-origin proxy unless explicitly bypassed.
 * @see docs/AUTH.md
 */
export function resolveClientApiBaseUrl(): string {
  const useDirect =
    process.env.NEXT_PUBLIC_USE_DIRECT_API === "true" &&
    process.env.NEXT_PUBLIC_API_URL?.trim();

  if (useDirect) {
    return process.env.NEXT_PUBLIC_API_URL!.trim().replace(/\/$/, "");
  }

  return "/api/backend";
}

/** Resolved at module load for diagnostics (visible in browser devtools via network URL). */
export const CLIENT_API_BASE_URL = resolveClientApiBaseUrl();
