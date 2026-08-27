import { useEffect, useState } from "react";
import { getTrips, createTrip } from "../../api/trips";
import { getBuses } from "../../api/buses";
import { getRoutes } from "../../api/routes";
import type { Trip, Bus, Route } from "../../types";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input, Select } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState, ErrorState } from "../../components/ui/EmptyState";
import { formatDate, formatTime } from "../../utils/format";
import { getErrorMessage } from "../../api/axios";

export function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ busId: "", routeId: "", travelDate: new Date().toISOString().split("T")[0], departureTime: "08:00", arrivalTime: "12:00" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [t, b, r] = await Promise.all([getTrips(), getBuses(), getRoutes()]);
      setTrips(t); setBuses(b); setRoutes(r);
    } catch (e) { setError(getErrorMessage(e)); } finally { setLoading(false); }
  };
  useEffect(() => { fetchAll(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.busId || !form.routeId || !form.travelDate || !form.departureTime || !form.arrivalTime) {
      setFormError("All fields are required"); return;
    }
    setSubmitting(true);
    try {
      await createTrip({
        busId: Number(form.busId),
        routeId: Number(form.routeId),
        travelDate: form.travelDate,
        departureTime: form.departureTime.length === 5 ? form.departureTime + ":00" : form.departureTime,
        arrivalTime: form.arrivalTime.length === 5 ? form.arrivalTime + ":00" : form.arrivalTime,
      });
      await fetchAll();
    } catch (err) { setFormError(getErrorMessage(err)); } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Trips</h2>

      <Card>
        <CardHeader><h3 className="font-semibold">Create Trip</h3></CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Select label="Bus" value={form.busId} onChange={(e) => setForm({ ...form, busId: e.target.value })} required>
              <option value="">Select Bus</option>
              {buses.map((b) => <option key={b.id} value={b.id}>{b.busNumber} - {b.operatorName} ({b.busType})</option>)}
            </Select>
            <Select label="Route" value={form.routeId} onChange={(e) => setForm({ ...form, routeId: e.target.value })} required>
              <option value="">Select Route</option>
              {routes.map((r) => <option key={r.id} value={r.id}>{r.source} → {r.destination}</option>)}
            </Select>
            <Input label="Travel Date" type="date" value={form.travelDate} onChange={(e) => setForm({ ...form, travelDate: e.target.value })} required />
            <Input label="Departure" type="time" value={form.departureTime} onChange={(e) => setForm({ ...form, departureTime: e.target.value })} required />
            <Input label="Arrival" type="time" value={form.arrivalTime} onChange={(e) => setForm({ ...form, arrivalTime: e.target.value })} required />
            <div className="sm:col-span-2">
              <Button type="submit" loading={submitting}>Create Trip</Button>
              {formError && <p className="mt-2 text-sm text-red-600">{formError}</p>}
            </div>
          </form>
        </CardBody>
      </Card>

      {loading ? <Spinner label="Loading trips..." /> : error ? <ErrorState message={error} onRetry={fetchAll} /> : trips.length === 0 ? <EmptyState title="No trips found" description="Create your first trip above." /> : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">Route</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Departure</th>
                <th className="px-4 py-3 text-left">Arrival</th>
                <th className="px-4 py-3 text-left">Bus</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {trips.map((t) => (
                <tr key={t.id}>
                  <td className="px-4 py-3 font-medium">{t.source} → {t.destination}</td>
                  <td className="px-4 py-3">{formatDate(t.travelDate)}</td>
                  <td className="px-4 py-3">{formatTime(t.departureTime)}</td>
                  <td className="px-4 py-3">{formatTime(t.arrivalTime)}</td>
                  <td className="px-4 py-3">#{t.busId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
