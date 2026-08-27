// Types mirroring backend DTOs exactly

export interface Bus {
  id: number;
  busNumber: string;
  operatorName: string;
  busType: string;
  totalSeats: number;
}

export interface CreateBusRequest {
  busNumber: string;
  busType: string;
  operatorName: string;
  totalSeats: number;
}

export interface Seat {
  id: number;
  seatNumber: string;
  seatType: string;
}

export interface CreateSeatRequest {
  seatNumber: string;
  seatType: string;
}

export interface Route {
  id: number;
  source: string;
  destination: string;
}

export interface CreateRouteRequest {
  source: string;
  destination: string;
}

export interface Trip {
  id: number;
  busId: number;
  routeId: number;
  source: string;
  destination: string;
  travelDate: string; // YYYY-MM-DD (LocalDate)
  departureTime: string; // HH:mm:ss or HH:mm
  arrivalTime: string;
}

export interface CreateTripRequest {
  busId: number;
  routeId: number;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
}

export interface TripSearchRequest {
  source: string;
  destination: string;
  travelDate: string;
}

export type TripSeatStatus = "AVAILABLE" | "BOOKED";
export type BookingStatus = "CONFIRMED" | "CANCELLED";

export interface TripSeat {
  id: number; // TripSeat id - this is tripSeatId for booking!
  seatId: number;
  seatNumber: string;
  seatType: string;
  status: TripSeatStatus;
}

export interface BookingRequest {
  tripId: number;
  tripSeatId: number;
  passengerName: string;
  passengerAge: number;
  passengerGender: string;
}

export interface BookingResponse {
  bookingId: number;
  tripId: number;
  tripSeatId: number;
  seatNumber: string;
  passengerName: string;
  passengerAge: number;
  passengerGender: string;
  status: BookingStatus;
  createdAt: string;
}
