import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBookings, cancelBooking } from "../../api/bookings";
import { getTripById } from "../../api/trips";
import type { BookingResponse, Trip } from "../../types";
import { getErrorMessage } from "../../api/axios";
import { Card, CardBody } from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState, ErrorState } from "../../components/ui/EmptyState";
import { Button } from "../../components/ui/Button";
import { formatDate, formatTime } from "../../utils/format";
import { Ticket } from "lucide-react";

export function MyBookingsPage() {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [trips, setTrips] = useState<Record<number, Trip | null>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyBookings();
      setBookings(data);

      const uniqueTripIds = [...new Set(data.map((b) => b.tripId))];
      const results = await Promise.all(
        uniqueTripIds.map(async (tripId) => {
          try {
            return [tripId, await getTripById(tripId)] as const;
          } catch {
            return [tripId, null] as const;
          }
        })
      );
      setTrips(Object.fromEntries(results));
    } catch (e) {
      const status = (e as { response?: { status?: number } }).response?.status;
      if (status === 401 || status === 403) {
        navigate("/login", { state: { from: "/my-bookings" } });
        return;
      }
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async (bookingId: number) => {
    if (!window.confirm("Are you sure you want to cancel this booking? The seat will be released.")) {
      return;
    }
    setCancellingId(bookingId);
    try {
      const updated = await cancelBooking(bookingId);
      setBookings((prev) => prev.map((b) => (b.bookingId === bookingId ? updated : b)));
    } catch (e) {
      const msg = getErrorMessage(e);
      if (msg.toLowerCase().includes("already cancelled")) {
        // refresh list to reflect actual server state
        await fetchBookings();
        return;
      }
      setError(msg);
    } finally {
      setCancellingId(null);
    }
  };

  if (loading) {
    return <div className="mx-auto max-w-5xl px-4 py-6"><Spinner label="Loading your bookings..." /></div>;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-bold text-slate-900">My Bookings</h2>
        <Button variant="outline" size="sm" onClick={() => navigate("/search")}>
          Book a new seat
        </Button>
      </div>

      {error && <ErrorState message={error} onRetry={fetchBookings} />}

      {!error && bookings.length === 0 && (
        <EmptyState
          title="No bookings yet"
          description="You haven't booked any seats. Search for a trip and book your first seat."
          action={<Button onClick={() => navigate("/search")}>Search Trips</Button>}
        />
      )}

      {!error && bookings.length > 0 && (
        <div className="space-y-3">
          {bookings.map((b) => {
            const trip = trips[b.tripId];
            const isCancelled = b.status === "CANCELLED";
            return (
              <Card key={b.bookingId} className={isCancelled ? "opacity-70" : ""}>
                <CardBody>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <Ticket size={18} className={isCancelled ? "text-slate-400" : "text-indigo-600"} />
                        <span className="font-mono text-sm font-semibold text-slate-900">#{b.bookingId}</span>
                        {isCancelled ? (
                          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-semibold text-red-700">CANCELLED</span>
                        ) : (
                          <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">CONFIRMED</span>
                        )}
                      </div>

                      {trip ? (
                        <p className="mt-2 text-sm font-medium text-slate-900">
                          {trip.source} → {trip.destination}
                        </p>
                      ) : (
                        <p className="mt-2 text-sm text-slate-500">Trip #{b.tripId}</p>
                      )}

                      {trip && (
                        <p className="text-sm text-slate-500">
                          {formatDate(trip.travelDate)} • {formatTime(trip.departureTime)} → {formatTime(trip.arrivalTime)} • Bus #{trip.busId}
                        </p>
                      )}

                      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-500">
                        <span>Seat: <span className="font-medium text-slate-700">{b.seatNumber}</span></span>
                        <span>Passenger: <span className="font-medium text-slate-700">{b.passengerName}</span></span>
                        <span>{b.passengerAge}, {b.passengerGender}</span>
                        <span>Booked: {new Date(b.createdAt).toLocaleString()}</span>
                      </div>
                    </div>

                    {!isCancelled && (
                      <div className="shrink-0">
                        <Button
                          variant="outline"
                          size="sm"
                          className="!border-red-200 !text-red-600 hover:!bg-red-50"
                          loading={cancellingId === b.bookingId}
                          onClick={() => handleCancel(b.bookingId)}
                        >
                          Cancel Booking
                        </Button>
                      </div>
                    )}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
