import { RoleGlobal } from "@/types";

export function decodeJwtPayload(token: string): {
  role?: string;
  agencyId?: string;
  agencyRole?: string;
} {
  try {
    const base64 = token.split(".")[1]?.replace(/-/g, "+").replace(/_/g, "/");
    if (!base64) return {};
    const json = atob(base64);
    const payload = JSON.parse(json);
    return {
      role: payload.role,
      agencyId: payload.agencyId,
      agencyRole: payload.agencyRole,
    };
  } catch {
    return {};
  }
}

export function roleFromToken(token: string): string | undefined {
  return decodeJwtPayload(token).role;
}

export function isSuperAdminRole(role?: string): boolean {
  return role === RoleGlobal.SUPER_ADMIN;
}
