import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { resolveClientApiBaseUrl } from "@/lib/api/resolve-api-base-url";
import {
  getAccessToken,
  refreshAccessToken,
  storeAccessToken,
} from "@/lib/auth/session";

export const apiClient = axios.create({
  baseURL: resolveClientApiBaseUrl(),
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
  timeout: 60_000,
});

let agencyId: string | null = null;

export function setAgencyId(id: string | null) {
  agencyId = id;
}

export function getAgencyId() {
  return agencyId;
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  if (agencyId && config.url?.startsWith("/dashboard")) {
    config.headers["x-agency-id"] = agencyId;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (
      error.response?.status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/auth/login") &&
      !original.url?.includes("/auth/refresh")
    ) {
      original._retry = true;

      const newToken = await refreshAccessToken();
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      }

      storeAccessToken(null);
      if (typeof window !== "undefined") {
        window.location.assign("/login");
      }
    }

    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    if (error.code === "ECONNABORTED") {
      return "Le serveur met trop de temps à répondre. Réessayez dans un instant.";
    }
    if (!error.response) {
      return "Impossible de joindre le serveur. Vérifiez votre connexion.";
    }
    const data = error.response?.data as { message?: string | string[] };
    if (Array.isArray(data?.message)) return data.message.join(", ");
    if (data?.message) return data.message;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Une erreur est survenue";
}

export function isEmailNotVerifiedError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  const data = error.response?.data as { message?: string | string[] };
  const message = Array.isArray(data?.message)
    ? data.message.join(", ")
    : data?.message;
  return error.response?.status === 403 && message === "EMAIL_NOT_VERIFIED";
}
