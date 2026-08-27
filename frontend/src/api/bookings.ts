import { api } from "./axios";
import type { BookingRequest, BookingResponse } from "../types";

export const createBooking = async (data: BookingRequest): Promise<BookingResponse> => {
  const res = await api.post<BookingResponse>("/api/bookings", data);
  return res.data;
};
