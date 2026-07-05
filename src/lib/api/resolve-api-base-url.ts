/**
 * Browser axios always uses the same-origin proxy so auth cookies land on the
 * frontend host (localhost:3001 in dev, vercel.app in prod).
 * Server components use BACKEND_URL via server.ts (not this helper).
 *
 * Set NEXT_PUBLIC_USE_DIRECT_API=true + NEXT_PUBLIC_API_URL only to bypass the
 * proxy (cookies will not work across origins).
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
