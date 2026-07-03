import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import {
  getGlobalAccessToken,
  setGlobalAccessToken,
} from "@/lib/auth/auth-context";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const apiClient = axios.create({
  baseURL: API_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

let agencyId: string | null = null;
let refreshPromise: Promise<string | null> | null = null;

export function setAgencyId(id: string | null) {
  agencyId = id;
}

export function getAgencyId() {
  return agencyId;
}

apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getGlobalAccessToken();
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

      refreshPromise ??= apiClient
        .post<{ access_token: string }>("/auth/refresh")
        .then((res) => {
          const token = res.data.access_token;
          setGlobalAccessToken(token);
          return token;
        })
        .catch(() => {
          setGlobalAccessToken(null);
          if (typeof window !== "undefined") {
            window.location.assign("/login");
          }
          return null;
        })
        .finally(() => {
          refreshPromise = null;
        });

      const newToken = await refreshPromise;
      if (newToken) {
        original.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(original);
      }
    }

    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as { message?: string | string[] };
    if (Array.isArray(data?.message)) return data.message.join(", ");
    if (data?.message) return data.message;
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Une erreur est survenue";
}
