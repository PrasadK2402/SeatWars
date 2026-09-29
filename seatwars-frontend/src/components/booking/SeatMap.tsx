import { useMemo } from "react";
import { LifeBuoy } from "lucide-react";
import type { TripSeat } from "../../types";

/** Sort seats in natural numeric order, e.g. A1, A2 … A10. */
function sortSeats(seats: TripSeat[]): TripSeat[] {
  return [...seats].sort((a, b) =>
    a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true })
  );
}

export function SeatMap({
  seats,
  selectedId,
  onSelect,
}: {
  seats: TripSeat[];
  selectedId: number | null;
  onSelect: (seat: TripSeat) => void;
}) {
  const rows = useMemo(() => {
    const sorted = sortSeats(seats);
    const out: TripSeat[][] = [];
    for (let i = 0; i < sorted.length; i += 4) out.push(sorted.slice(i, i + 4));
    return out;
  }, [seats]);

  const available = seats.filter((s) => s.status === "AVAILABLE").length;

  if (seats.length === 0) {
    return <p className="muted mono">NO SEATS CONFIGURED FOR THIS TRIP.</p>;
  }

  return (
    <div className="seatmap">
      <div className="console-head">
        <span className="console-title">
          SEAT SCHEMATIC // <b>{seats.length} UNITS</b>
        </span>
        <span className="console-status">
          <span className={`status-dot${available === 0 ? " warn" : ""}`} />
          {available} FREE
        </span>
      </div>
      <div className="seatmap-body">
        <div className="seat-legend">
          <span className="legend-item"><span className="legend-swatch" /> Available</span>
          <span className="legend-item"><span className="legend-swatch sel" /> Selected</span>
          <span className="legend-item"><span className="legend-swatch bkd" /> Booked</span>
        </div>

        <div className="deck" role="group" aria-label="Seat map">
          <div className="deck-front">
            <span className="wheel" title="Driver">
              <LifeBuoy />
            </span>
            <span className="badge badge-neutral">FRONT</span>
          </div>

          <div className="seat-rows">
            {rows.map((row, ri) => (
              <div className="seat-row" key={ri}>
                {row.slice(0, 2).map((seat) => (
                  <SeatButton key={seat.id} seat={seat} selected={selectedId === seat.id} onSelect={onSelect} />
                ))}
                {row.length < 2 && <span />}
                {row.length < 2 && <span />}
                <span className="seat-aisle" aria-hidden="true">···</span>
                {row.slice(2, 4).map((seat) => (
                  <SeatButton key={seat.id} seat={seat} selected={selectedId === seat.id} onSelect={onSelect} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SeatButton({
  seat,
  selected,
  onSelect,
}: {
  seat: TripSeat;
  selected: boolean;
  onSelect: (s: TripSeat) => void;
}) {
  const booked = seat.status === "BOOKED";
  return (
    <button
      type="button"
      className={`seat${selected ? " selected" : ""}${booked ? " booked" : ""}`}
      disabled={booked}
      aria-pressed={selected}
      aria-label={`Seat ${seat.seatNumber}, ${seat.seatType}, ${booked ? "booked" : "available"}`}
      title={`${seat.seatNumber} · ${seat.seatType}`}
      onClick={() => onSelect(seat)}
    >
      {seat.seatNumber}
    </button>
  );
}
