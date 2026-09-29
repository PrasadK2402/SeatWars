import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Armchair, ArrowRight, ChevronDown } from "lucide-react";
import type { Trip, TripSeat } from "../../types";
import { formatDate, formatTime, titleCase, tripDuration } from "../../utils/format";
import { SeatMap } from "./SeatMap";
import { Button } from "../ui/Button";

export function TripRow({
  trip,
  seats,
  seatsLoading,
  expanded,
  onToggle,
  index,
}: {
  trip: Trip;
  seats: TripSeat[] | null;
  seatsLoading: boolean;
  expanded: boolean;
  onToggle: () => void;
  index: number;
}) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<TripSeat | null>(null);

  const available = seats?.filter((s) => s.status === "AVAILABLE").length ?? null;
  const soldOut = available === 0;

  const pillClass = available === null ? "" : soldOut ? "none" : available <= 5 ? "low" : "";

  const proceed = () => {
    if (!selected) return;
    navigate(`/trips/${trip.id}?seat=${selected.id}`);
  };

  return (
    <article className={`trip-row${soldOut ? " soldout" : ""}`}>
      <div className="trip-main">
        <span className="trip-idx">{String(index + 1).padStart(3, "0")}</span>

        <div className="trip-times">
          <div>
            <div className="trip-time">{formatTime(trip.departureTime)}</div>
            <div className="trip-place">{titleCase(trip.source)}</div>
          </div>
          <div className="trip-line">
            <span className="dur">{tripDuration(trip.departureTime, trip.arrivalTime)}</span>
            <span className="trip-bar" />
            <span className="dur">{formatDate(trip.travelDate)}</span>
          </div>
          <div style={{ textAlign: "right" }}>
            <div className="trip-time">{formatTime(trip.arrivalTime)}</div>
            <div className="trip-place">{titleCase(trip.destination)}</div>
          </div>
        </div>

        <div className="trip-side">
          {seatsLoading ? (
            <span className="skeleton" style={{ width: 120, height: 32 }} />
          ) : (
            <span className={`seats-pill ${pillClass}`}>
              <Armchair />
              {soldOut ? "SOLD OUT" : `${available} LEFT`}
            </span>
          )}
          <Button
            variant={expanded ? "ghost" : "outline"}
            onClick={onToggle}
            disabled={soldOut || seatsLoading}
          >
            {expanded ? "HIDE" : "SEATS"}
            <ChevronDown size={16} style={{ transform: expanded ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
          </Button>
        </div>
      </div>

      {expanded && seats && (
        <div className="trip-expand">
          <div className="trip-expand-grid">
            <SeatMap seats={seats} selectedId={selected?.id ?? null} onSelect={setSelected} />
            <div>
              <div className="kicker" style={{ marginBottom: 10 }}>SELECT UNIT</div>
              <p className="muted small" style={{ margin: "0 0 20px", lineHeight: 1.7, fontFamily: "var(--font-mono)", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {titleCase(trip.source)} → {titleCase(trip.destination)} · {formatDate(trip.travelDate)} ·{" "}
                {formatTime(trip.departureTime)} – {formatTime(trip.arrivalTime)}
              </p>
              <div className="kv">
                <span className="k">SELECTED</span>
                <span className="v font-dot" style={{ fontSize: "1.3rem" }}>
                  {selected ? `${selected.seatNumber}` : <span className="muted">——</span>}
                </span>
              </div>
              <div className="kv">
                <span className="k">TYPE</span>
                <span className="v">{selected ? selected.seatType : <span className="muted">——</span>}</span>
              </div>
              <div className="mt-3">
                <Button onClick={proceed} disabled={!selected} size="lg" block>
                  Proceed to book <ArrowRight />
                </Button>
              </div>
              <p className="muted small mt-2" style={{ lineHeight: 1.7 }}>
                Passenger details on the next step. No payment — booking is instant.
              </p>
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
