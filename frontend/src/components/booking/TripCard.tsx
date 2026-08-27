import { Clock, Calendar, ArrowRight } from "lucide-react";
import type { Trip } from "../../types";
import { formatDate, formatTime } from "../../utils/format";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";

export function TripCard({ trip, onSelect }: { trip: Trip; onSelect: () => void }) {
  return (
    <Card className="p-5 hover:shadow-md transition">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            <span>{trip.source}</span> <ArrowRight size={14} className="text-slate-400" /> <span>{trip.destination}</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {formatDate(trip.travelDate)}</span>
            <span className="flex items-center gap-1.5"><Clock size={14} /> {formatTime(trip.departureTime)} → {formatTime(trip.arrivalTime)}</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">Bus #{trip.busId} • Trip #{trip.id}</div>
        </div>
        <Button onClick={onSelect}>Select Bus</Button>
      </div>
    </Card>
  );
}
