import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Armchair, Pencil, Plus, Trash2 } from "lucide-react";
import { createBus, deleteBus, getBuses, updateBus } from "../../api/buses";
import { getErrorMessage } from "../../api/client";
import type { Bus, CreateBusRequest } from "../../types";
import { useToast } from "../../context/ToastContext";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Field, Input } from "../../components/ui/Form";
import { Alert } from "../../components/ui/Alert";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingBlock } from "../../components/ui/Spinner";

const EMPTY: CreateBusRequest = { busNumber: "", busType: "AC Seater", operatorName: "", totalSeats: 40 };

const BUS_TYPES = ["AC Sleeper", "AC Seater", "Non-AC Seater", "Non-AC Sleeper", "Volvo Multi-Axle", "Mini Bus"];

export function BusesPage() {
  const { notify } = useToast();
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Bus | null>(null);
  const [form, setForm] = useState<CreateBusRequest>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Bus | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setBuses(await getBuses());
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openCreate = () => {
    setEditing(null);
    setForm(EMPTY);
    setModalOpen(true);
  };

  const openEdit = (bus: Bus) => {
    setEditing(bus);
    setForm({
      busNumber: bus.busNumber,
      busType: bus.busType,
      operatorName: bus.operatorName,
      totalSeats: bus.totalSeats,
    });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateBus(editing.id, form);
        setBuses((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        notify("success", "BUS UPDATED.");
      } else {
        const created = await createBus(form);
        setBuses((prev) => [created, ...prev]);
        notify("success", "BUS ADDED — NOW CONFIGURE ITS SEATS.");
      }
      setModalOpen(false);
    } catch (err) {
      notify("error", getErrorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleting) return;
    try {
      await deleteBus(deleting.id);
      setBuses((prev) => prev.filter((b) => b.id !== deleting.id));
      setDeleting(null);
      notify("success", "BUS DELETED.");
    } catch (e) {
      notify("error", getErrorMessage(e));
    }
  };

  return (
    <>
      <div className="between">
        <div>
          <span className="kicker">CONTROL DECK</span>
          <h1 className="admin-title mt-1">BUSES<span className="red">.</span></h1>
          <p className="admin-sub">Fleet registry — {buses.length} unit{buses.length === 1 ? "" : "s"}.</p>
        </div>
        <Button onClick={openCreate}><Plus /> Add bus</Button>
      </div>

      {error && <Alert kind="error">{error}</Alert>}

      {loading ? (
        <LoadingBlock />
      ) : buses.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="FLEET EMPTY"
          description="Register your first bus to start scheduling trips."
          action={<Button onClick={openCreate}><Plus /> Add bus</Button>}
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Bus number</th>
                <th>Operator</th>
                <th>Type</th>
                <th>Seats</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {buses.map((b) => (
                <tr key={b.id}>
                  <td><strong className="font-dot" style={{ fontSize: "1.05rem" }}>{b.busNumber}</strong></td>
                  <td>{b.operatorName}</td>
                  <td className="muted">{b.busType}</td>
                  <td className="mono">{b.totalSeats}</td>
                  <td>
                    <div className="table-actions">
                      <Link to={`/admin/buses/${b.id}/seats`} className="btn btn-outline btn-sm">
                        <Armchair size={15} /> Seats
                      </Link>
                      <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => openEdit(b)} aria-label={`Edit ${b.busNumber}`}>
                        <Pencil size={15} />
                      </button>
                      <button className="icon-btn" style={{ width: 34, height: 34, color: "var(--danger)" }} onClick={() => setDeleting(b)} aria-label={`Delete ${b.busNumber}`}>
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "EDIT BUS" : "REGISTER BUS"}>
        <form onSubmit={save}>
          <Field label="Bus number">
            <Input placeholder="e.g. MH-12-AB-1234" value={form.busNumber} onChange={(e) => setForm({ ...form, busNumber: e.target.value })} required />
          </Field>
          <Field label="Operator name">
            <Input placeholder="e.g. Pasara Travels" value={form.operatorName} onChange={(e) => setForm({ ...form, operatorName: e.target.value })} required />
          </Field>
          <div className="grid grid-2">
            <Field label="Bus type">
              <Input list="bus-types" value={form.busType} onChange={(e) => setForm({ ...form, busType: e.target.value })} required />
              <datalist id="bus-types">
                {BUS_TYPES.map((t) => <option key={t} value={t} />)}
              </datalist>
            </Field>
            <Field label="Total seats">
              <Input type="number" min={1} value={form.totalSeats} onChange={(e) => setForm({ ...form, totalSeats: Number(e.target.value) })} required />
            </Field>
          </div>
          <div className="row" style={{ justifyContent: "flex-end", marginTop: 8 }}>
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? "Save changes" : "Add bus"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete this bus?"
        message={`Bus ${deleting?.busNumber} and its seat layout will be permanently removed. Trips already scheduled on it may be affected.`}
        confirmLabel="Yes, delete bus"
      />
    </>
  );
}
