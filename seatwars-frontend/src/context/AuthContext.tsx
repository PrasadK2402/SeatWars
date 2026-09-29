import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import { login as apiLogin, register as apiRegister } from "../api/auth";
import { clearAuth, loadAuth, saveAuth } from "../auth/session";
import type { AuthUser } from "../auth/session";
import type { LoginRequest, RegisterRequest } from "../types";

interface AuthContextValue {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (data: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = useState(loadAuth);

  const login = useCallback(async (data: LoginRequest) => {
    const res = await apiLogin(data);
    setSaved(saveAuth(res));
  }, []);

  const register = useCallback(async (data: RegisterRequest) => {
    const res = await apiRegister(data);
    setSaved(saveAuth(res));
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setSaved(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user: saved?.user ?? null,
        token: saved?.token ?? null,
        isAuthenticated: !!saved,
        isAdmin: saved?.user.role === "ADMIN",
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
