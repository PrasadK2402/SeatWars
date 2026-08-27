import { api } from "./axios";
import type { Bus, CreateBusRequest } from "../types";

export const getBuses = async (): Promise<Bus[]> => {
  const res = await api.get<Bus[]>("/api/buses");
  return res.data;
};

export const getBusById = async (id: number): Promise<Bus> => {
  const res = await api.get<Bus>(`/api/buses/${id}`);
  return res.data;
};

export const createBus = async (data: CreateBusRequest): Promise<Bus> => {
  const res = await api.post<Bus>("/api/buses", data);
  return res.data;
};

export const updateBus = async (id: number, data: CreateBusRequest): Promise<Bus> => {
  const res = await api.put<Bus>(`/api/buses/${id}`, data);
  return res.data;
};

export const deleteBus = async (id: number): Promise<void> => {
  await api.delete(`/api/buses/${id}`);
};
