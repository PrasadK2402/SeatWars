import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Plus } from "lucide-react";
import { getBusById } from "../../api/buses";
import { createSeat, getBusSeats } from "../../api/seats";
import { getErrorMessage } from "../../api/client";
import type { Bus, Seat } from "../../types";
import { useToast } from "../../context/ToastContext";
import { Button } from "../../components/ui/Button";
import { CardPad } from "../../components/ui/Card";
import { Field, Input } from "../../components/ui/Form";
import { Alert } from "../../components/ui/Alert";
import { LoadingBlock } from "../../components/ui/Spinner";

const SEAT_TYPES = ["Window", "Aisle", "Middle", "Sleeper Lower", "Sleeper Upper"];

export function BusSeatsPage() {
  const { busId } = useParams<{ busId: string }>();
  const { notify } = useToast();
  const id = Number(busId);

  const [bus, setBus] = useState<Bus | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [seatNumber, setSeatNumber] = useState("");
  const [seatType, setSeatType] = useState("Window");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([getBusById(id), getBusSeats(id)])
      .then(([b, s]) => {
        setBus(b);
        setSeats(s);
      })
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, [id]);

  const addSeat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!seatNumber.trim()) return;
    setAdding(true);
    try {
      const created = await createSeat(id, { seatNumber: seatNumber.trim(), seatType });
      setSeats((prev) => [...prev, created]);
      setSeatNumber("");
      notify("success", `SEAT ${created.seatNumber} ADDED.`);
    } catch (err) {
      notify("error", getErrorMessage(err));
    } finally {
      setAdding(false);
    }
  };

  const sorted = [...seats].sort((a, b) =>
    a.seatNumber.localeCompare(b.seatNumber, undefined, { numeric: true })
  );

  if (loading) return <LoadingBlock label="LOADING BUS" />;
  if (error || !bus) {
    return (
      <>
        <Alert kind="error">{error ?? "BUS NOT FOUND."}</Alert>
        <Link to="/admin/buses" className="btn btn-outline mt-2"><ArrowLeft /> Back to buses</Link>
      </>
    );
  }

  return (
    <>
      <Link to="/admin/buses" className="btn btn-ghost btn-sm" style={{ marginBottom: 14 }}>
        <ArrowLeft /> Buses
      </Link>
      <span className="kicker">CONTROL DECK</span>
      <h1 className="admin-title mt-1">SEATS · <span className="red">{bus.busNumber}</span></h1>
      <p className="admin-sub">
        {bus.operatorName} · {bus.busType} · {seats.length} of {bus.totalSeats} seats configured.
        Trips copy this layout automatically.
      </p>

      <div className="grid grid-2" style={{ alignItems: "start", gap: 24 }}>
        <CardPad>
          <h3 className="mono" style={{ margin: "0 0 18px", fontSize: "0.78rem" }}>ADD A SEAT</h3>
          <form onSubmit={addSeat}>
            <div className="grid grid-2">
              <Field label="Seat number">
                <Input placeholder="e.g. A1" value={seatNumber} onChange={(e) => setSeatNumber(e.target.value)} required />
              </Field>
              <Field label="Seat type">
                <Input list="seat-types" value={seatType} onChange={(e) => setSeatType(e.target.value)} required />
                <datalist id="seat-types">
                  {SEAT_TYPES.map((t) => <option key={t} value={t} />)}
                </datalist>
              </Field>
            </div>
            <Button type="submit" loading={adding} block><Plus /> Add seat</Button>
          </form>
          <p className="muted small mt-2" style={{ lineHeight: 1.7 }}>
            Tip: number seats in order (A1, A2, …) — the booking schematic lays them out front-to-back, 2 + 2 per row.
          </p>
        </CardPad>

        <CardPad>
          <h3 className="mono" style={{ margin: "0 0 18px", fontSize: "0.78rem" }}>LAYOUT PREVIEW // {sorted.length}</h3>
          {sorted.length === 0 ? (
            <p className="muted mono">NO SEATS YET — ADD THE FIRST ONE.</p>
          ) : (
            <div className="seat-preview-grid">
              {sorted.map((s) => (
                <div className="seat-chip" key={s.id} title={s.seatType}>{s.seatNumber}</div>
              ))}
            </div>
          )}
        </CardPad>
      </div>
    </>
  );
}
