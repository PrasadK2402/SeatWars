import { api } from "./axios";
import type { Seat, CreateSeatRequest } from "../types";

export const getSeatsByBus = async (busId: number): Promise<Seat[]> => {
  const res = await api.get<Seat[]>(`/buses/${busId}/seats`);
  return res.data;
};

export const createSeat = async (busId: number, data: CreateSeatRequest): Promise<Seat> => {
  const res = await api.post<Seat>(`/buses/${busId}/seats`, data);
  return res.data;
};
