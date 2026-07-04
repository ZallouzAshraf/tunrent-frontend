import { RoleGlobal } from "@/types";

export interface PostLoginContext {
  roleGlobal?: string;
  agencyId?: string | null;
  redirectTo?: string | null;
}

/** Default landing route after authentication. */
export function resolvePostLoginPath({
  roleGlobal,
  agencyId,
  redirectTo,
}: PostLoginContext): string {
  const redirect = redirectTo?.trim();
  if (redirect && redirect.startsWith("/") && !redirect.startsWith("//")) {
    return redirect;
  }

  if (roleGlobal === RoleGlobal.SUPER_ADMIN) {
    return "/admin";
  }

  if (agencyId) {
    return "/dashboard";
  }

  return "/account";
}
