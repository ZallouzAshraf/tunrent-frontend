"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api/client";
import { useAuthContext } from "@/lib/auth/auth-context";
import type { AgencyUserRole, User } from "@/types";

export interface MeResponse {
  user: User;
  agencyId?: string;
  agencyRole?: AgencyUserRole;
}

export function useCurrentUser() {
  const { accessToken } = useAuthContext();

  return useQuery({
    queryKey: ["me"],
    queryFn: () => apiClient.get<MeResponse>("/auth/me").then((r) => r.data),
    enabled: !!accessToken,
    staleTime: 5 * 60_000,
    retry: false,
  });
}
