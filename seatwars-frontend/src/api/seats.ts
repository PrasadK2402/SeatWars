import { api } from "./client";
import type { CreateSeatRequest, Seat } from "../types";

/** Admin endpoints */
export const getBusSeats = async (busId: number): Promise<Seat[]> => {
  const res = await api.get<Seat[]>(`/buses/${busId}/seats`);
  return res.data;
};

export const createSeat = async (busId: number, data: CreateSeatRequest): Promise<Seat> => {
  const res = await api.post<Seat>(`/buses/${busId}/seats`, data);
  return res.data;
};
