import type { AuthResponse, UserRole } from "../types";

const STORAGE_KEY = "seatwars_auth";

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

export interface SavedAuth {
  token: string;
  user: AuthUser;
}

export function saveAuth(response: AuthResponse): SavedAuth {
  const saved: SavedAuth = {
    token: response.token,
    user: {
      name: response.name,
      email: response.email,
      role: response.role,
    },
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  return saved;
}

export function loadAuth(): SavedAuth | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SavedAuth;
    if (!parsed.token || !parsed.user) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearAuth(): void {
  localStorage.removeItem(STORAGE_KEY);
}
