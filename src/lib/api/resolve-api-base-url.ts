/**
 * Browser / client axios: prod uses same-origin proxy; dev calls Nest directly.
 * Server components use BACKEND_URL via server.ts (not this helper).
 */
export function resolveClientApiBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (explicit) {
    return explicit.replace(/\/$/, "");
  }

  if (process.env.NODE_ENV === "production") {
    return "/api/backend";
  }

  return "http://localhost:3000";
}
