import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getSeatsByBus, createSeat } from "../../api/seats";
import { getBusById } from "../../api/buses";
import type { Seat, Bus } from "../../types";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState, ErrorState } from "../../components/ui/EmptyState";
import { getErrorMessage } from "../../api/axios";

export function BusSeatsPage() {
  const { busId } = useParams<{ busId: string }>();
  const id = Number(busId);
  const [bus, setBus] = useState<Bus | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ seatNumber: "", seatType: "SEATER" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try {
      const [b, s] = await Promise.all([getBusById(id), getSeatsByBus(id)]);
      setBus(b);
      setSeats(s);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.seatNumber || !form.seatType) {
      setFormError("Both fields required");
      return;
    }
    setSubmitting(true);
    try {
      await createSeat(id, form);
      setForm({ seatNumber: "", seatType: "SEATER" });
      await fetch();
    } catch (err) {
      setFormError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Link to="/admin/buses" className="text-sm text-slate-600 hover:text-slate-900">← Back to Buses</Link>
      {bus && <h2 className="text-xl font-bold text-slate-900">Seats for {bus.busNumber} ({bus.operatorName})</h2>}

      <Card>
        <CardHeader><h3 className="font-semibold">Add Seat</h3></CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
            <Input label="Seat Number" value={form.seatNumber} onChange={(e) => setForm({ ...form, seatNumber: e.target.value })} placeholder="A1" required />
            <Input label="Seat Type" value={form.seatType} onChange={(e) => setForm({ ...form, seatType: e.target.value })} placeholder="SEATER / SLEEPER / WINDOW" required />
            <Button type="submit" loading={submitting}>Add Seat</Button>
          </form>
          {formError && <p className="mt-2 text-sm text-red-600">{formError}</p>}
        </CardBody>
      </Card>

      {loading ? <Spinner label="Loading seats..." /> : error ? <ErrorState message={error} onRetry={fetch} /> : seats.length === 0 ? <EmptyState title="No seats configured" description="Add seats for this bus above." /> : (
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {seats.map((s) => (
            <div key={s.id} className="rounded-xl border border-slate-200 bg-white p-3 text-center">
              <p className="font-semibold text-slate-900">{s.seatNumber}</p>
              <p className="text-xs text-slate-500">{s.seatType}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
