import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import type { BookingResponse, Trip } from "../../types";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { CheckCircle } from "lucide-react";
import { formatDate, formatTime } from "../../utils/format";

export function ConfirmationPage() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState<BookingResponse | null>(null);
  const [trip, setTrip] = useState<Trip | null>(null);

  useEffect(() => {
    const b = sessionStorage.getItem("bookingConfirmation");
    const t = sessionStorage.getItem("bookingTrip");
    if (b) setBooking(JSON.parse(b));
    if (t) setTrip(JSON.parse(t));
    if (!b) {
      // no booking, redirect home after a tick
    }
  }, []);

  if (!booking) {
    return (
      <div className="mx-auto max-w-xl px-4 py-12 text-center">
        <p className="text-slate-600">No booking found.</p>
        <Link to="/" className="mt-4 inline-block text-indigo-600 hover:underline">Back to Home</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8">
      <Card>
        <CardBody>
          <div className="text-center">
            <CheckCircle size={48} className="mx-auto text-emerald-500" />
            <h2 className="mt-3 text-xl font-bold text-slate-900">Booking Confirmed</h2>
            <p className="mt-1 text-sm text-slate-500">Your seat has been reserved successfully.</p>
          </div>

          <div className="mt-6 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Booking ID</span><span className="font-mono font-semibold">#{booking.bookingId}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Passenger</span><span className="font-medium">{booking.passengerName} ({booking.passengerAge}, {booking.passengerGender})</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Seat</span><span className="font-medium">{booking.seatNumber}</span></div>
            {trip && (
              <>
                <div className="flex justify-between"><span className="text-slate-500">Route</span><span className="font-medium">{trip.source} → {trip.destination}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Travel Date</span><span className="font-medium">{formatDate(trip.travelDate)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Departure</span><span className="font-medium">{formatTime(trip.departureTime)}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Arrival</span><span className="font-medium">{formatTime(trip.arrivalTime)}</span></div>
              </>
            )}
            <div className="flex justify-between"><span className="text-slate-500">Status</span><span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700">{booking.status}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Booked At</span><span className="font-medium">{new Date(booking.createdAt).toLocaleString()}</span></div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button className="flex-1" onClick={() => navigate("/")}>Back to Home</Button>
            <Button variant="outline" className="flex-1" onClick={() => navigate("/search")}>Search Again</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
