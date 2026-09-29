import { Link, Navigate, useLocation } from "react-router-dom";
import { Home, Printer, Ticket } from "lucide-react";
import type { BookingResponse, Trip } from "../types";
import { TicketCard } from "../components/booking/TicketCard";
import { Button } from "../components/ui/Button";

interface ConfirmationState {
  booking: BookingResponse;
  trip: Trip | null;
}

function readConfirmation(state: unknown): ConfirmationState | null {
  if (state && typeof state === "object" && "booking" in state) {
    return state as ConfirmationState;
  }
  try {
    const raw = sessionStorage.getItem("seatwars_confirmation");
    if (raw) return JSON.parse(raw) as ConfirmationState;
  } catch {
    /* ignore */
  }
  return null;
}

export function BookingSuccessPage() {
  const location = useLocation();
  const confirmation = readConfirmation(location.state);

  if (!confirmation) {
    return <Navigate to="/my-bookings" replace />;
  }

  return (
    <div className="page">
      <div className="container">
        <div className="steps no-print" style={{ maxWidth: 760, margin: "0 auto 34px" }}>
          <div className="step-pill done">01 · Select seat</div>
          <div className="step-pill done">02 · Passenger</div>
          <div className="step-pill now">03 · Ticket</div>
        </div>

        <TicketCard booking={confirmation.booking} trip={confirmation.trip} />

        <div className="row no-print" style={{ justifyContent: "center", marginTop: 34 }}>
          <Button variant="outline" onClick={() => window.print()}>
            <Printer /> Print ticket
          </Button>
          <Link to="/my-bookings" className="btn btn-ghost">
            <Ticket /> My bookings
          </Link>
          <Link to="/" className="btn btn-primary">
            <Home /> Book another
          </Link>
        </div>
      </div>
    </div>
  );
}
