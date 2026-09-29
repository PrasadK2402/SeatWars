import axios, { AxiosError } from "axios";
import { loadAuth, clearAuth } from "../auth/session";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: { "Content-Type": "application/json" },
  timeout: 15000,
});

// Attach the JWT on every request when the user is signed in.
api.interceptors.request.use(
  (config) => {
    const saved = loadAuth();
    if (saved?.token) {
      config.headers.Authorization = `Bearer ${saved.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// A 401 means the token is invalid/expired — drop the session so the
// auth guards kick the user back to the login screen.
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) clearAuth();
    return Promise.reject(error);
  }
);

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<Record<string, unknown>>;
    const data = axiosError.response?.data;
    // Backend GlobalExceptionHandler responds with { error: "..." }
    if (data && typeof data === "object") {
      if (typeof data.error === "string") return data.error;
      if (typeof data.message === "string") return data.message;
    }
    switch (axiosError.response?.status) {
      case 400:
        return "Please check your input and try again.";
      case 401:
        return "Please log in to continue.";
      case 403:
        return "You don't have permission to do that.";
      case 404:
        return "We couldn't find what you were looking for.";
      case 409:
        return "That seat was just taken. Please pick another one.";
      case 500:
        return "Something went wrong on our end. Please try again.";
    }
    if (axiosError.code === "ERR_NETWORK" || axiosError.message === "Network Error") {
      return "Can't reach the server. Make sure the backend is running.";
    }
    return axiosError.message || "Something went wrong. Please try again.";
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
}
