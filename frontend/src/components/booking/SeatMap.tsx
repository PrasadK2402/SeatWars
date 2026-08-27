import type { TripSeat } from "../../types";

export function SeatMap({ seats, selectedId, onSelect }: { seats: TripSeat[]; selectedId: number | null; onSelect: (s: TripSeat) => void }) {
  if (seats.length === 0) return <p className="text-sm text-slate-500">No seats configured for this trip.</p>;

  // Sort seats by seatNumber for stable layout
  const sorted = [...seats].sort((a, b) => a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true }));

  return (
    <div>
      <div className="mb-4 flex items-center gap-4 text-xs">
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-white border border-slate-300" /> Available</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-indigo-600" /> Selected</span>
        <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded bg-slate-200" /> Booked</span>
      </div>

      {/* Bus container */}
      <div className="mx-auto max-w-sm rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between text-xs font-medium text-slate-500">
          <span className="rounded bg-slate-100 px-2 py-1">DRIVER</span>
          <span className="text-slate-400">Front →</span>
        </div>

        <div className="grid grid-cols-4 gap-3">
          {sorted.map((seat) => {
            const isBooked = seat.status === "BOOKED";
            const isSelected = selectedId === seat.id;
            return (
              <button
                key={seat.id}
                disabled={isBooked}
                onClick={() => !isBooked && onSelect(seat)}
                className={`flex h-12 flex-col items-center justify-center rounded-lg border text-xs font-semibold transition
                  ${isBooked ? "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed" : ""}
                  ${isSelected ? "bg-indigo-600 border-indigo-600 text-white shadow" : ""}
                  ${!isBooked && !isSelected ? "bg-white border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700" : ""}
                `}
                title={`${seat.seatNumber} - ${seat.seatType} - ${seat.status}`}
              >
                <span>{seat.seatNumber}</span>
                <span className="text-[10px] opacity-70">{seat.seatType}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
