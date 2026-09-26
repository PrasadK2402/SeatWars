import { createContext } from "react";
import type { AuthResponse } from "../types";
import type { AuthUser } from "../auth/session";

export interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (response: AuthResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
