import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft, Armchair, RefreshCw } from "lucide-react";
import { getTripById, getTripSeats } from "../api/trips";
import { createBooking } from "../api/bookings";
import { getErrorMessage } from "../api/client";
import type { Trip, TripSeat } from "../types";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { SeatMap } from "../components/booking/SeatMap";
import { PassengerForm } from "../components/booking/PassengerForm";
import type { PassengerDetails } from "../components/booking/PassengerForm";
import { Alert } from "../components/ui/Alert";
import { LoadingBlock } from "../components/ui/Spinner";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { formatDate, formatTime, titleCase, tripDuration } from "../utils/format";

export function TripDetailPage() {
  const { tripId } = useParams<{ tripId: string }>();
  const [searchParams] = useSearchParams();
  const preselectSeatId = Number(searchParams.get("seat")) || null;
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { notify } = useToast();
  const id = Number(tripId);

  const [trip, setTrip] = useState<Trip | null>(null);
  const [seats, setSeats] = useState<TripSeat[]>([]);
  const [selected, setSelected] = useState<TripSeat | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [bookingLoading, setBookingLoading] = useState(false);

  const loadSeats = async () => {
    try {
      const s = await getTripSeats(id);
      setSeats(s);
      setSelected((prev) =>
        prev && s.find((x) => x.id === prev.id)?.status === "BOOKED" ? null : prev
      );
    } catch (e) {
      setError(getErrorMessage(e));
    }
  };

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    Promise.all([getTripById(id), getTripSeats(id)])
      .then(([t, s]) => {
        setTrip(t);
        setSeats(s);
        if (preselectSeatId) {
          const match = s.find((x) => x.id === preselectSeatId && x.status === "AVAILABLE");
          if (match) setSelected(match);
        }
      })
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const available = seats.filter((s) => s.status === "AVAILABLE").length;

  const handleBooking = async (data: PassengerDetails) => {
    if (!selected || !trip) return;
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/trips/${trip.id}` } });
      return;
    }
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
      sessionStorage.setItem("seatwars_confirmation", JSON.stringify({ booking: res, trip }));
      navigate("/booking/success", { state: { booking: res, trip } });
    } catch (e) {
      const msg = getErrorMessage(e);
      setBookingError(msg);
      await loadSeats();
      notify("error", msg);
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container">
          <LoadingBlock label="LOADING SCHEMATIC" />
        </div>
      </div>
    );
  }

  if (error || !trip) {
    return (
      <div className="page">
        <div className="container" style={{ maxWidth: 640 }}>
          <Alert kind="error">{error ?? "TRIP NOT FOUND."}</Alert>
          <Link to="/" className="btn btn-outline mt-2">
            <ArrowLeft /> Back to search
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <Link to={`/search?from=${encodeURIComponent(trip.source)}&to=${encodeURIComponent(trip.destination)}&date=${trip.travelDate}`} className="btn btn-ghost btn-sm" style={{ marginBottom: 22 }}>
          <ArrowLeft /> All trips
        </Link>

        <div className="steps">
          <div className="step-pill done">01 · Select seat</div>
          <div className="step-pill now">02 · Passenger</div>
          <div className="step-pill">03 · Ticket</div>
        </div>

        <div className="results-head" style={{ paddingTop: 0 }}>
          <span className="kicker">TRIP // {String(trip.id).padStart(4, "0")}</span>
          <h1 className="results-route">
            {titleCase(trip.source)} <span className="arrow">→</span> {titleCase(trip.destination)}
          </h1>
          <div className="results-meta">
            {formatDate(trip.travelDate)} // {formatTime(trip.departureTime)} – {formatTime(trip.arrivalTime)} // {tripDuration(trip.departureTime, trip.arrivalTime)}
          </div>
        </div>

        <div className="booking-layout mt-3">
          <div>
            <SeatMap seats={seats} selectedId={selected?.id ?? null} onSelect={setSelected} />
            <div className="center mt-3">
              <Button variant="ghost" size="sm" onClick={loadSeats}>
                <RefreshCw size={15} /> Refresh schematic
              </Button>
            </div>
          </div>

          <div className="console">
            <div className="console-head">
              <span className="console-title">BOOKING // <b>MANIFEST</b></span>
              <Badge variant={available > 0 ? "success" : "danger"}>
                <Armchair size={12} /> {available} FREE
              </Badge>
            </div>
            <div className="console-body">
              <div className="kv"><span className="k">ROUTE</span><span className="v">{titleCase(trip.source)} → {titleCase(trip.destination)}</span></div>
              <div className="kv"><span className="k">DATE</span><span className="v">{formatDate(trip.travelDate)}</span></div>
              <div className="kv"><span className="k">DEPART</span><span className="v">{formatTime(trip.departureTime)}</span></div>
              <div className="kv">
                <span className="k">SEAT</span>
                <span className="v">
                  {selected ? (
                    <Badge variant="brand">{selected.seatNumber} · {selected.seatType}</Badge>
                  ) : (
                    <span className="muted mono">NOT SELECTED</span>
                  )}
                </span>
              </div>

              <div className="divider" />

              {bookingError && <Alert kind="error">{bookingError}</Alert>}

              {selected ? (
                <>
                  {!isAuthenticated && (
                    <Alert kind="info">
                      YOU'LL LOG IN BEFORE CONFIRMING — YOUR SEAT CHOICE IS KEPT.
                    </Alert>
                  )}
                  <PassengerForm onSubmit={handleBooking} loading={bookingLoading} />
                </>
              ) : (
                <div className="empty" style={{ padding: "30px 12px" }}>
                  <div className="empty-icon"><Armchair /></div>
                  <h3 style={{ fontSize: "1.2rem" }}>PICK A UNIT</h3>
                  <p className="small">Tap any free seat on the schematic.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
