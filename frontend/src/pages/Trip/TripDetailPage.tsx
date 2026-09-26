import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { getTripById, getTripSeats } from "../../api/trips";
import { createBooking } from "../../api/bookings";
import type { Trip, TripSeat } from "../../types";
import { useAuth } from "../../hooks/useAuth";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState, ErrorState } from "../../components/ui/EmptyState";
import { SeatMap } from "../../components/booking/SeatMap";
import { PassengerForm } from "../../components/booking/PassengerForm";
import { formatDate, formatTime } from "../../utils/format";
import { getErrorMessage } from "../../api/axios";
import { ArrowLeft, Bus } from "lucide-react";

export function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const id = Number(tripId);

  const [trip, setTrip] = useState<Trip | null>(null);
  const [seats, setSeats] = useState<TripSeat[]>([]);
  const [selected, setSelected] = useState<TripSeat | null>(null);
  const [loadingTrip, setLoadingTrip] = useState(true);
  const [loadingSeats, setLoadingSeats] = useState(true);
  const [errorTrip, setErrorTrip] = useState<string | null>(null);
  const [errorSeats, setErrorSeats] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const fetchTrip = async () => {
    setLoadingTrip(true);
    setErrorTrip(null);
    try {
      const t = await getTripById(id);
      setTrip(t);
    } catch (e) {
      setErrorTrip(getErrorMessage(e));
    } finally {
      setLoadingTrip(false);
    }
  };

  const fetchSeats = async () => {
    setLoadingSeats(true);
    setErrorSeats(null);
    try {
      const s = await getTripSeats(id);
      setSeats(s);
    } catch (e) {
      setErrorSeats(getErrorMessage(e));
    } finally {
      setLoadingSeats(false);
    }
  };

  useEffect(() => {
    if (!id) return;
    fetchTrip();
    fetchSeats();
  }, [id]);

  const handleBooking = async (data: { passengerName: string; passengerAge: number; passengerGender: string }) => {
    if (!selected || !trip) return;
    setBookingError(null);
    setBookingLoading(true);
    try {
      const res = await createBooking({
        tripId: trip.id,
        tripSeatId: selected.id,
        passengerName: data.passengerName,
        passengerAge: data.passengerAge,
        passengerGender: data.passengerGender,
      });
      // persist confirmation in sessionStorage
      sessionStorage.setItem("bookingConfirmation", JSON.stringify(res));
      sessionStorage.setItem("bookingTrip", JSON.stringify(trip));
      navigate("/booking/confirmation");
    } catch (e) {
      const status = axios.isAxiosError(e) ? e.response?.status : undefined;
      if (status === 401 || status === 403) {
        navigate("/login", { state: { from: location.pathname } });
        return;
      }
      const msg = getErrorMessage(e);
      setBookingError(msg);
      // If seat conflict, refresh seats
      if (msg.toLowerCase().includes("seat") || msg.toLowerCase().includes("available")) {
        setSelected(null);
        fetchSeats();
      }
    } finally {
      setBookingLoading(false);
    }
  };

  if (loadingTrip) return <div className="mx-auto max-w-5xl px-4 py-6"><Spinner label="Loading trip..." /></div>;
  if (errorTrip) return <div className="mx-auto max-w-5xl px-4 py-6"><ErrorState message={errorTrip} onRetry={fetchTrip} /></div>;
  if (!trip) return <div className="mx-auto max-w-5xl px-4 py-6"><EmptyState title="Trip not found" /></div>;

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <button onClick={() => navigate(-1)} className="mb-4 flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900">
        <ArrowLeft size={16} /> Back
      </button>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Bus size={18} /> {trip.source} → {trip.destination}
              </h2>
              <p className="text-sm text-slate-500">{formatDate(trip.travelDate)} • {formatTime(trip.departureTime)} → {formatTime(trip.arrivalTime)} • Bus #{trip.busId}</p>
            </div>
          </div>
        </CardHeader>
        <CardBody>
          {loadingSeats ? (
            <Spinner label="Loading seats..." />
          ) : errorSeats ? (
            <ErrorState message={errorSeats} onRetry={fetchSeats} />
          ) : seats.length === 0 ? (
            <EmptyState title="No seats configured" description="This trip has no seats yet." />
          ) : (
            <div className="grid gap-8 lg:grid-cols-2">
              <div>
                <h3 className="mb-3 font-medium text-slate-900">Select Seat</h3>
                <SeatMap seats={seats} selectedId={selected?.id ?? null} onSelect={setSelected} />
                {selected && (
                  <div className="mt-4 rounded-lg bg-indigo-50 border border-indigo-200 px-4 py-3 text-sm">
                    Selected: <span className="font-semibold">{selected.seatNumber}</span> ({selected.seatType})
                  </div>
                )}
              </div>

              <div>
                <h3 className="mb-3 font-medium text-slate-900">Passenger Details</h3>
                {!isAuthenticated ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-4 text-center">
                    <p className="text-sm text-slate-600">Please log in to book this seat.</p>
                    <Link
                      to="/login"
                      state={{ from: location.pathname }}
                      className="mt-3 inline-block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
                    >
                      Login to Book
                    </Link>
                  </div>
                ) : !selected ? (
                  <p className="text-sm text-slate-500">Please select a seat to continue.</p>
                ) : (
                  <>
                    {bookingError && <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{bookingError}</div>}
                    <PassengerForm onSubmit={handleBooking} loading={bookingLoading} disabled={!selected} />
                  </>
                )}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
