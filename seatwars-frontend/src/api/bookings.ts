import { api } from "./client";
import type { BookingRequest, BookingResponse } from "../types";

export const createBooking = async (data: BookingRequest): Promise<BookingResponse> => {
  const res = await api.post<BookingResponse>("/bookings", data);
  return res.data;
};

export const getMyBookings = async (): Promise<BookingResponse[]> => {
  const res = await api.get<BookingResponse[]>("/bookings/my-bookings");
  return res.data;
};

export const cancelBooking = async (bookingId: number): Promise<BookingResponse> => {
  const res = await api.post<BookingResponse>(`/bookings/${bookingId}/cancel`);
  return res.data;
};
