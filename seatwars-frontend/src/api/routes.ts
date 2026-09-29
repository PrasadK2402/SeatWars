import { api } from "./client";
import type { CreateRouteRequest, Route } from "../types";

/** GET /routes is public; write operations need ADMIN. */
export const getRoutes = async (): Promise<Route[]> => {
  const res = await api.get<Route[]>("/routes");
  return res.data;
};

export const createRoute = async (data: CreateRouteRequest): Promise<Route> => {
  const res = await api.post<Route>("/routes", data);
  return res.data;
};

export const updateRoute = async (id: number, data: CreateRouteRequest): Promise<Route> => {
  const res = await api.put<Route>(`/routes/${id}`, data);
  return res.data;
};

export const deleteRoute = async (id: number): Promise<void> => {
  await api.delete(`/routes/${id}`);
};
