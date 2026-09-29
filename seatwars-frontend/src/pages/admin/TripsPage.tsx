import { useEffect, useState } from "react";
import { CalendarDays, Plus } from "lucide-react";
import { createTrip, getAllTrips } from "../../api/trips";
import { getBuses } from "../../api/buses";
import { getRoutes } from "../../api/routes";
import { getErrorMessage } from "../../api/client";
import type { Bus, CreateTripRequest, Route, Trip } from "../../types";
import { useToast } from "../../context/ToastContext";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Field, Input, Select } from "../../components/ui/Form";
import { Alert } from "../../components/ui/Alert";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingBlock } from "../../components/ui/Spinner";
import { formatDate, formatTime, titleCase, todayISO } from "../../utils/format";

export function TripsPage() {
  const { notify } = useToast();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState<CreateTripRequest>({
    busId: 0,
    routeId: 0,
    travelDate: todayISO(),
    departureTime: "08:00",
    arrivalTime: "14:00",
  });

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [t, b, r] = await Promise.all([getAllTrips(), getBuses(), getRoutes()]);
      setTrips(t);
      setBuses(b);
      setRoutes(r);
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const created = await createTrip({
        ...form,
        busId: Number(form.busId),
        routeId: Number(form.routeId),
      });
      setTrips((prev) => [created, ...prev]);
      setModalOpen(false);
      notify("success", "TRIP SCHEDULED — SEATS GENERATED AUTOMATICALLY.");
    } catch (err) {
      notify("error", getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const busName = (id: number) => buses.find((b) => b.id === id)?.busNumber ?? `#${id}`;
  const sorted = [...trips].sort((a, b) =>
    `${b.travelDate}${b.departureTime}`.localeCompare(`${a.travelDate}${a.departureTime}`)
  );

  return (
    <>
      <div className="between">
        <div>
          <span className="kicker">CONTROL DECK</span>
          <h1 className="admin-title mt-1">TRIPS<span className="red">.</span></h1>
          <p className="admin-sub">Schedule a bus on a route — per-trip seats generate automatically.</p>
        </div>
        <Button onClick={() => setModalOpen(true)} disabled={buses.length === 0 || routes.length === 0}>
          <Plus /> Schedule trip
        </Button>
      </div>

      {error && <Alert kind="error">{error}</Alert>}
      {!loading && (buses.length === 0 || routes.length === 0) && (
        <Alert kind="info">
          ADD AT LEAST ONE BUS (WITH SEATS) AND ONE ROUTE BEFORE SCHEDULING TRIPS.
        </Alert>
      )}

      {loading ? (
        <LoadingBlock />
      ) : trips.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="NO TRIPS SCHEDULED"
          description="Schedule your first trip to open it up for bookings."
          action={
            buses.length > 0 && routes.length > 0 ? (
              <Button onClick={() => setModalOpen(true)}><Plus /> Schedule trip</Button>
            ) : undefined
          }
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Route</th>
                <th>Date</th>
                <th>Departure</th>
                <th>Arrival</th>
                <th>Bus</th>
              </tr>
            </thead>
            <tbody>
              {sorted.map((t) => (
                <tr key={t.id}>
                  <td>
                    <strong className="font-dot" style={{ fontSize: "1.05rem" }}>{titleCase(t.source)} → {titleCase(t.destination)}</strong>
                  </td>
                  <td className="mono" style={{ fontSize: "0.72rem" }}>{formatDate(t.travelDate)}</td>
                  <td className="font-dot" style={{ fontSize: "1.1rem" }}>{formatTime(t.departureTime)}</td>
                  <td className="font-dot" style={{ fontSize: "1.1rem" }}>{formatTime(t.arrivalTime)}</td>
                  <td className="muted mono" style={{ fontSize: "0.72rem" }}>{busName(t.busId)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="SCHEDULE TRIP">
        <form onSubmit={save}>
          <div className="grid grid-2">
            <Field label="Bus">
              <Select
                value={form.busId || ""}
                onChange={(e) => setForm({ ...form, busId: Number(e.target.value) })}
                required
              >
                <option value="" disabled>Select bus</option>
                {buses.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.busNumber} · {b.operatorName}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Route">
              <Select
                value={form.routeId || ""}
                onChange={(e) => setForm({ ...form, routeId: Number(e.target.value) })}
                required
              >
                <option value="" disabled>Select route</option>
                {routes.map((r) => (
                  <option key={r.id} value={r.id}>
                    {titleCase(r.source)} → {titleCase(r.destination)}
                  </option>
                ))}
              </Select>
            </Field>
          </div>
          <Field label="Travel date">
            <Input
              type="date"
              min={todayISO()}
              value={form.travelDate}
              onChange={(e) => setForm({ ...form, travelDate: e.target.value })}
              required
            />
          </Field>
          <div className="grid grid-2">
            <Field label="Departure time">
              <Input
                type="time"
                value={form.departureTime}
                onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
                required
              />
            </Field>
            <Field label="Arrival time">
              <Input
                type="time"
                value={form.arrivalTime}
                onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
                required
              />
            </Field>
          </div>
          <div className="row" style={{ justifyContent: "flex-end", marginTop: 8 }}>
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>Schedule trip</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
