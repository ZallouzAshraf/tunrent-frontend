"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface AuthContextValue {
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
  isBootstrapping: boolean;
  setIsBootstrapping: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

let currentAccessToken: string | null = null;
let onTokenChange: ((token: string | null) => void) | null = null;

export function setGlobalAccessToken(token: string | null) {
  currentAccessToken = token;
  onTokenChange?.(token);
}

export function getGlobalAccessToken() {
  return currentAccessToken;
}

export function registerTokenChangeHandler(
  handler: (token: string | null) => void,
) {
  onTokenChange = handler;
  return () => {
    if (onTokenChange === handler) onTokenChange = null;
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(null);
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const setAccessToken = useCallback((token: string | null) => {
    currentAccessToken = token;
    setAccessTokenState(token);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        accessToken,
        setAccessToken,
        isBootstrapping,
        setIsBootstrapping,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }
  return ctx;
}
