import { api } from "./axios";
import type { Trip, CreateTripRequest, TripSearchRequest, TripSeat } from "../types";

export const getTrips = async (): Promise<Trip[]> => {
  const res = await api.get<Trip[]>("/api/trips");
  return res.data;
};

export const getTripById = async (id: number): Promise<Trip> => {
  const res = await api.get<Trip>(`/api/trips/${id}`);
  return res.data;
};

export const createTrip = async (data: CreateTripRequest): Promise<Trip> => {
  const res = await api.post<Trip>("/api/trips", data);
  return res.data;
};

export const searchTrips = async (data: TripSearchRequest): Promise<Trip[]> => {
  const res = await api.post<Trip[]>("/api/trips/search", data);
  return res.data;
};

export const getTripSeats = async (tripId: number): Promise<TripSeat[]> => {
  const res = await api.get<TripSeat[]>(`/api/trips/${tripId}/seats`);
  return res.data;
};
