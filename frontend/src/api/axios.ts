import axios, { AxiosError } from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000,
});

// Request interceptor - for future auth, logging in dev
api.interceptors.request.use(
  (config) => {
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
    if (status === 409) return "This seat is no longer available. Please select another seat.";
    if (status === 404) return "Requested resource not found.";
    if (status === 400) return "Please check your input and try again.";
    if (status === 500) return "Server error. Please try again later.";
    if (axiosError.code === "ERR_NETWORK" || axiosError.message === "Network Error") {
      return "Unable to connect to server. Ensure backend is running on " + (import.meta.env.VITE_API_BASE_URL || "http://localhost:8080");
    }
    if (axiosError.response?.statusText) return axiosError.response.statusText;
    return axiosError.message || "Something went wrong. Please try again.";
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred.";
}
