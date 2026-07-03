export function decodeJwtPayload(token: string): {
  agencyId?: string;
  agencyRole?: string;
} {
  try {
    const base64 = token.split(".")[1]?.replace(/-/g, "+").replace(/_/g, "/");
    if (!base64) return {};
    const json = atob(base64);
    const payload = JSON.parse(json);
    return {
      agencyId: payload.agencyId,
      agencyRole: payload.agencyRole,
    };
  } catch {
    return {};
  }
}
