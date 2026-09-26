import axios, { AxiosError } from "axios";
import { loadAuth, clearAuth } from "../auth/session";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor - attach JWT auth token if present
api.interceptors.request.use(
  (config) => {
    const saved = loadAuth();
    if (saved) {
      config.headers.Authorization = `Bearer ${saved.token}`;
    }
    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - central logging
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearAuth();
    }
    if (import.meta.env.DEV) {
      console.error(`[API Error]`, error.response?.status, error.response?.data);
    }
    return Promise.reject(error);
  }
);

export interface ApiError {
  message: string;
  status?: number;
  fieldErrors?: Record<string, string>;
}

export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<Record<string, unknown>>;
    const data = axiosError.response?.data;
    // Backend returns { error: "message" } via GlobalExceptionHandler
    if (data && typeof data === "object") {
      if ("error" in data && typeof data.error === "string") return data.error;
      if ("message" in data && typeof data.message === "string") return data.message;
    }
    const status = axiosError.response?.status;
    if (status === 401) return "Please log in to continue.";
    if (status === 403) return "You don't have permission to perform this action.";
    if (status === 409) return "This seat is no longer available. Please select another seat.";
    if (status === 404) return "Requested resource not found.";
    if (status === 400) return "Please check your input and try again.";
    if (status === 500) return "Server error. Please try again later.";
    if (axiosError.code === "ERR_NETWORK" || axiosError.message === "Network Error") {
      return "Unable to connect to server. Ensure backend is running on " ;
    }
    if (axiosError.response?.statusText) return axiosError.response.statusText;
    return axiosError.message || "Something went wrong. Please try again.";
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
}
