import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Ticket, XCircle } from "lucide-react";
import { cancelBooking, getMyBookings } from "../api/bookings";
import { getTripById } from "../api/trips";
import { getErrorMessage } from "../api/client";
import type { BookingResponse, Trip } from "../types";
import { useToast } from "../context/ToastContext";
import { CardPad } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingBlock } from "../components/ui/Spinner";
import { ConfirmDialog } from "../components/ui/ConfirmDialog";
import { bookingRef, formatDate, formatDateTime, formatTime, titleCase } from "../utils/format";

export function MyBookingsPage() {
  const { notify } = useToast();
  const [bookings, setBookings] = useState<BookingResponse[]>([]);
  const [trips, setTrips] = useState<Record<number, Trip>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState<BookingResponse | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const list = await getMyBookings();
      setBookings(list);
      const ids = [...new Set(list.map((b) => b.tripId))];
      const entries = await Promise.all(
        ids.map(async (id) => {
          try {
            const t = await getTripById(id);
            return [id, t] as const;
          } catch {
            return null;
          }
        })
      );
      const map: Record<number, Trip> = {};
      entries.forEach((e) => {
        if (e) map[e[0]] = e[1];
      });
      setTrips(map);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const confirmCancel = async () => {
    if (!cancelling) return;
    try {
      const updated = await cancelBooking(cancelling.bookingId);
      setBookings((prev) => prev.map((b) => (b.bookingId === updated.bookingId ? updated : b)));
      setCancelling(null);
      notify("success", "BOOKING CANCELLED — SEAT RELEASED BACK.");
    } catch (e) {
      notify("error", getErrorMessage(e));
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="container"><LoadingBlock label="LOADING MANIFEST" /></div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        <span className="kicker">PASSENGER LOG</span>
        <h1 className="results-route">MY BOOKINGS<span style={{ color: "var(--red)" }}>.</span></h1>
        <div className="results-meta" style={{ marginBottom: 30 }}>
          {bookings.length} RECORD{bookings.length === 1 ? "" : "S"} // NEWEST FIRST
        </div>

        {error && <Alert kind="error">{error}</Alert>}

        {bookings.length === 0 && !error ? (
          <CardPad>
            <EmptyState
              icon={Ticket}
              title="LOG EMPTY"
              description="No bookings on record. Run a scan and claim your seat."
              action={<Link to="/" className="btn btn-primary">Scan trips</Link>}
            />
          </CardPad>
        ) : (
          <div className="grid" style={{ gap: 14 }}>
            {bookings.map((b) => {
              const trip = trips[b.tripId];
              const cancelled = b.status === "CANCELLED";
              return (
                <div className="console" key={b.bookingId}>
                  <div className="console-head">
                    <span className="console-title">REF // <b className="font-dot" style={{ fontSize: "0.9rem", letterSpacing: "0.04em" }}>{bookingRef(b.bookingId)}</b></span>
                    <Badge variant={cancelled ? "danger" : "success"}>{b.status}</Badge>
                  </div>
                  <div className="console-body">
                    <div className="between" style={{ alignItems: "flex-start", flexWrap: "wrap" }}>
                      <div>
                        <div className="font-dot" style={{ fontSize: "1.5rem", marginBottom: 10, lineHeight: 1.1 }}>
                          {trip
                            ? `${titleCase(trip.source)} → ${titleCase(trip.destination)}`
                            : `TRIP #${b.tripId}`}
                        </div>
                        <div className="mono" style={{ color: "var(--muted)", display: "flex", flexWrap: "wrap", gap: "6px 18px" }}>
                          {trip && (
                            <span className="row" style={{ gap: 6 }}>
                              <CalendarDays size={13} />
                              {formatDate(trip.travelDate)} · {formatTime(trip.departureTime)}
                            </span>
                          )}
                          <span>SEAT <strong style={{ color: "var(--red)", fontSize: "0.85rem" }}>{b.seatNumber}</strong></span>
                          <span>{b.passengerName} · {b.passengerAge} · {b.passengerGender}</span>
                        </div>
                        <div className="mono faint mt-1" style={{ fontSize: "0.62rem" }}>
                          LOGGED {formatDateTime(b.createdAt)}
                        </div>
                      </div>
                      {!cancelled && (
                        <Button variant="danger" size="sm" onClick={() => setCancelling(b)}>
                          <XCircle size={15} /> Cancel
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <ConfirmDialog
          open={cancelling !== null}
          onClose={() => setCancelling(null)}
          onConfirm={confirmCancel}
          title="Cancel this booking?"
          message={`This will cancel ${cancelling ? bookingRef(cancelling.bookingId) : ""} (seat ${cancelling?.seatNumber}) and release the seat back into the pool. This can't be undone.`}
          confirmLabel="Yes, cancel booking"
        />
      </div>
    </div>
  );
}
