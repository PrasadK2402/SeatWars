import { api } from "./axios";
import type { Route, CreateRouteRequest } from "../types";

export const getRoutes = async (): Promise<Route[]> => {
  const res = await api.get<Route[]>("/routes");
  return res.data;
};

export const getRouteById = async (id: number): Promise<Route> => {
  const res = await api.get<Route>(`/routes/${id}`);
  return res.data;
};

export const createRoute = async (data: CreateRouteRequest): Promise<Route> => {
  const res = await api.post<Route>("/routes", data);
  return res.data;
};
