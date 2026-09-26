import { useCallback, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./auth-context";
import type { AuthContextValue } from "./auth-context";
import type { AuthResponse } from "../types";
import { clearAuth, loadAuth, saveAuth, type SavedAuth } from "../auth/session";

function getInitialAuth(): SavedAuth | null {
  return loadAuth();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<SavedAuth | null>(getInitialAuth);

  const login = useCallback((response: AuthResponse) => {
    setAuth(saveAuth(response));
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuth(null);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token: auth?.token ?? null,
      user: auth?.user ?? null,
      isAuthenticated: auth !== null,
      isAdmin: auth?.user.role === "ADMIN",
      login,
      logout,
    }),
    [auth, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
