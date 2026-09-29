import { useEffect, useState } from "react";
import { ArrowRight, Pencil, Plus, Trash2 } from "lucide-react";
import { createRoute, deleteRoute, getRoutes, updateRoute } from "../../api/routes";
import { getErrorMessage } from "../../api/client";
import type { CreateRouteRequest, Route } from "../../types";
import { useToast } from "../../context/ToastContext";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { ConfirmDialog } from "../../components/ui/ConfirmDialog";
import { Field, Input } from "../../components/ui/Form";
import { Alert } from "../../components/ui/Alert";
import { EmptyState } from "../../components/ui/EmptyState";
import { LoadingBlock } from "../../components/ui/Spinner";
import { titleCase } from "../../utils/format";

export function RoutesPage() {
  const { notify } = useToast();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Route | null>(null);
  const [form, setForm] = useState<CreateRouteRequest>({ source: "", destination: "" });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<Route | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      setRoutes(await getRoutes());
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
    setForm({ source: "", destination: "" });
    setModalOpen(true);
  };

  const openEdit = (r: Route) => {
    setEditing(r);
    setForm({ source: r.source, destination: r.destination });
    setModalOpen(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateRoute(editing.id, form);
        setRoutes((prev) => prev.map((r) => (r.id === updated.id ? updated : r)));
        notify("success", "ROUTE UPDATED.");
      } else {
        const created = await createRoute(form);
        setRoutes((prev) => [created, ...prev]);
        notify("success", "ROUTE ADDED.");
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
      await deleteRoute(deleting.id);
      setRoutes((prev) => prev.filter((r) => r.id !== deleting.id));
      setDeleting(null);
      notify("success", "ROUTE DELETED.");
    } catch (e) {
      notify("error", getErrorMessage(e));
    }
  };

  return (
    <>
      <div className="between">
        <div>
          <span className="kicker">CONTROL DECK</span>
          <h1 className="admin-title mt-1">ROUTES<span className="red">.</span></h1>
          <p className="admin-sub">The source → destination pairs your fleet serves.</p>
        </div>
        <Button onClick={openCreate}><Plus /> Add route</Button>
      </div>

      {error && <Alert kind="error">{error}</Alert>}

      {loading ? (
        <LoadingBlock />
      ) : routes.length === 0 ? (
        <EmptyState
          icon={Plus}
          title="NO ROUTES PLOTTED"
          description="Add your first route to start scheduling trips."
          action={<Button onClick={openCreate}><Plus /> Add route</Button>}
        />
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Route</th>
                <th>ID</th>
                <th style={{ textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong className="font-dot" style={{ fontSize: "1.1rem" }}>{titleCase(r.source)}</strong>
                    <ArrowRight size={14} style={{ margin: "0 10px", verticalAlign: -2, color: "var(--red)" }} />
                    <strong className="font-dot" style={{ fontSize: "1.1rem" }}>{titleCase(r.destination)}</strong>
                  </td>
                  <td className="mono muted">#{r.id}</td>
                  <td>
                    <div className="table-actions">
                      <button className="icon-btn" style={{ width: 34, height: 34 }} onClick={() => openEdit(r)} aria-label="Edit route">
                        <Pencil size={15} />
                      </button>
                      <button className="icon-btn" style={{ width: 34, height: 34, color: "var(--danger)" }} onClick={() => setDeleting(r)} aria-label="Delete route">
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? "EDIT ROUTE" : "PLOT ROUTE"}>
        <form onSubmit={save}>
          <div className="grid grid-2">
            <Field label="Source">
              <Input placeholder="e.g. Mumbai" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} required />
            </Field>
            <Field label="Destination">
              <Input placeholder="e.g. Pune" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required />
            </Field>
          </div>
          <div className="row" style={{ justifyContent: "flex-end", marginTop: 8 }}>
            <Button variant="ghost" type="button" onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="submit" loading={saving}>{editing ? "Save changes" : "Add route"}</Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={deleting !== null}
        onClose={() => setDeleting(null)}
        onConfirm={confirmDelete}
        title="Delete this route?"
        message={`${deleting ? `${titleCase(deleting.source)} → ${titleCase(deleting.destination)}` : "This route"} will be permanently removed. Trips scheduled on it may be affected.`}
        confirmLabel="Yes, delete route"
      />
    </>
  );
}
