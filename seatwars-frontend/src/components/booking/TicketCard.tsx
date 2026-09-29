import { CheckCircle2 } from "lucide-react";
import type { BookingResponse, Trip } from "../../types";
import { bookingRef, formatDate, formatDateTime, formatTime, titleCase } from "../../utils/format";
import { Badge } from "../ui/Badge";

export function TicketCard({ booking, trip }: { booking: BookingResponse; trip?: Trip | null }) {
  return (
    <div className="ticket">
      <div className="ticket-glow" />
      <div className="ticket-head">
        <div>
          <span className="ticket-ok">
            <CheckCircle2 /> Booking confirmed
          </span>
          <h2>
            BOARDING<br />PASS<span style={{ color: "var(--red)" }}>.</span>
          </h2>
          <div className="mono" style={{ color: "#8d8d8d", marginTop: 10 }}>
            ISSUED {formatDateTime(booking.createdAt)}
          </div>
        </div>
        <div className="ticket-ref">{bookingRef(booking.bookingId)}</div>
      </div>

      {trip && (
        <div className="ticket-route">
          <div>
            <div className="t-route-time">{formatTime(trip.departureTime)}</div>
            <div className="t-route-place">{titleCase(trip.source)}</div>
          </div>
          <div className="trip-line" style={{ maxWidth: 150 }}>
            <span className="trip-bar" />
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="t-route-time">{formatTime(trip.arrivalTime)}</div>
            <div className="t-route-place">{titleCase(trip.destination)}</div>
          </div>
        </div>
      )}

      <div className="ticket-divider" />

      <div className="ticket-grid">
        <div className="ticket-field">
          <div className="k">Passenger</div>
          <div className="v">{booking.passengerName}</div>
        </div>
        <div className="ticket-field">
          <div className="k">Seat</div>
          <div className="v font-dot" style={{ fontSize: "1.4rem", color: "var(--red)" }}>{booking.seatNumber}</div>
        </div>
        <div className="ticket-field">
          <div className="k">Status</div>
          <div className="v">
            <Badge variant={booking.status === "CONFIRMED" ? "success" : "danger"}>
              {booking.status}
            </Badge>
          </div>
        </div>
        {trip && (
          <div className="ticket-field">
            <div className="k">Travel date</div>
            <div className="v">{formatDate(trip.travelDate)}</div>
          </div>
        )}
        <div className="ticket-field">
          <div className="k">Age</div>
          <div className="v">{booking.passengerAge}</div>
        </div>
        <div className="ticket-field">
          <div className="k">Gender</div>
          <div className="v">{booking.passengerGender}</div>
        </div>
      </div>

      <div className="ticket-foot">
        Show this reference at boarding. Cancel free of charge from <strong style={{ color: "#e8e8e8" }}>MY BOOKINGS</strong> and the seat is released back into the pool.
      </div>
    </div>
  );
}
