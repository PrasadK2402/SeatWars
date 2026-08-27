import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getBuses, createBus, updateBus, deleteBus } from "../../api/buses";
import type { Bus } from "../../types";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState, ErrorState } from "../../components/ui/EmptyState";
import { getErrorMessage } from "../../api/axios";

export function BusesPage() {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ busNumber: "", operatorName: "", busType: "AC", totalSeats: 40 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetch = async () => {
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

  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.busNumber || !form.operatorName || !form.busType || form.totalSeats < 1) {
      setFormError("All fields are required and seats must be >=1");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await updateBus(editingId, form);
      } else {
        await createBus(form);
      }
      setForm({ busNumber: "", operatorName: "", busType: "AC", totalSeats: 40 });
      setEditingId(null);
      await fetch();
    } catch (e) {
      setFormError(getErrorMessage(e));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this bus?")) return;
    try {
      await deleteBus(id);
      await fetch();
    } catch (e) {
      alert(getErrorMessage(e));
    }
  };

  const startEdit = (b: Bus) => {
    setEditingId(b.id);
    setForm({ busNumber: b.busNumber, operatorName: b.operatorName, busType: b.busType, totalSeats: b.totalSeats });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Buses</h2>

      <Card>
        <CardHeader>
          <h3 className="font-semibold text-slate-900">{editingId ? "Edit Bus" : "Create Bus"}</h3>
        </CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2">
            <Input label="Bus Number" value={form.busNumber} onChange={(e) => setForm({ ...form, busNumber: e.target.value })} placeholder="MH12 AB 1234" required />
            <Input label="Operator Name" value={form.operatorName} onChange={(e) => setForm({ ...form, operatorName: e.target.value })} placeholder="ABC Travels" required />
            <Input label="Bus Type" value={form.busType} onChange={(e) => setForm({ ...form, busType: e.target.value })} placeholder="AC / NON-AC / SLEEPER" required />
            <Input label="Total Seats" type="number" min={1} value={String(form.totalSeats)} onChange={(e) => setForm({ ...form, totalSeats: parseInt(e.target.value) || 0 })} required />
            <div className="sm:col-span-2 flex gap-2">
              <Button type="submit" loading={submitting}>{editingId ? "Update Bus" : "Create Bus"}</Button>
              {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setForm({ busNumber: "", operatorName: "", busType: "AC", totalSeats: 40 }); }}>Cancel</Button>}
            </div>
            {formError && <p className="sm:col-span-2 text-sm text-red-600">{formError}</p>}
          </form>
        </CardBody>
      </Card>

      {loading ? <Spinner label="Loading buses..." /> : error ? <ErrorState message={error} onRetry={fetch} /> : buses.length === 0 ? <EmptyState title="No buses found" description="Create your first bus above." /> : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-3 text-left">Bus Number</th>
                <th className="px-4 py-3 text-left">Operator</th>
                <th className="px-4 py-3 text-left">Type</th>
                <th className="px-4 py-3 text-left">Seats</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {buses.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{b.busNumber}</td>
                  <td className="px-4 py-3">{b.operatorName}</td>
                  <td className="px-4 py-3">{b.busType}</td>
                  <td className="px-4 py-3">{b.totalSeats}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <Link to={`/admin/buses/${b.id}/seats`} className="text-indigo-600 hover:underline text-xs font-medium">Seats</Link>
                      <button onClick={() => startEdit(b)} className="text-slate-600 hover:text-slate-900 text-xs font-medium">Edit</button>
                      <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:text-red-700 text-xs font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
