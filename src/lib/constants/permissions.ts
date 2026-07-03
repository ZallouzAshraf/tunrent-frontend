import { AgencyUserRole } from "@/types";

export const ROUTE_PERMISSIONS: Record<string, AgencyUserRole[]> = {
  "/dashboard/team": [AgencyUserRole.OWNER],
  "/dashboard/settings/agency": [AgencyUserRole.OWNER],
  "/dashboard/settings/billing": [AgencyUserRole.OWNER],
  "/dashboard/stats": [AgencyUserRole.OWNER, AgencyUserRole.MANAGER],
};

export function canAccessRoute(
  path: string,
  role: AgencyUserRole | undefined,
): boolean {
  const matched = Object.entries(ROUTE_PERMISSIONS).find(([route]) =>
    path.startsWith(route),
  );
  if (!matched) return true;
  if (!role) return false;
  return matched[1].includes(role);
}

export function canManageCars(role: AgencyUserRole | undefined) {
  return role === AgencyUserRole.OWNER || role === AgencyUserRole.MANAGER;
}

export function canManageTeam(role: AgencyUserRole | undefined) {
  return role === AgencyUserRole.OWNER;
}
