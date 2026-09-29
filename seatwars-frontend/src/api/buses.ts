import { api } from "./client";
import type { Bus, CreateBusRequest } from "../types";

/** Admin endpoints */
export const getBuses = async (): Promise<Bus[]> => {
  const res = await api.get<Bus[]>("/buses");
  return res.data;
};

export const getBusById = async (id: number): Promise<Bus> => {
  const res = await api.get<Bus>(`/buses/${id}`);
  return res.data;
};

export const createBus = async (data: CreateBusRequest): Promise<Bus> => {
  const res = await api.post<Bus>("/buses", data);
  return res.data;
};

export const updateBus = async (id: number, data: CreateBusRequest): Promise<Bus> => {
  const res = await api.put<Bus>(`/buses/${id}`, data);
  return res.data;
};

export const deleteBus = async (id: number): Promise<void> => {
  await api.delete(`/buses/${id}`);
};
