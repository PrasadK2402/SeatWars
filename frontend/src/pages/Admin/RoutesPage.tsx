import { useEffect, useState } from "react";
import { getRoutes, createRoute } from "../../api/routes";
import type { Route } from "../../types";
import { Card, CardBody, CardHeader } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Spinner } from "../../components/ui/Spinner";
import { EmptyState, ErrorState } from "../../components/ui/EmptyState";
import { getErrorMessage } from "../../api/axios";

export function RoutesPage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ source: "", destination: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetch = async () => {
    setLoading(true);
    setError(null);
    try { setRoutes(await getRoutes()); } catch (e) { setError(getErrorMessage(e)); } finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (!form.source || !form.destination) { setFormError("Both fields required"); return; }
    setSubmitting(true);
    try {
      await createRoute(form);
      setForm({ source: "", destination: "" });
      await fetch();
    } catch (err) { setFormError(getErrorMessage(err)); } finally { setSubmitting(false); }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold text-slate-900">Routes</h2>
      <Card>
        <CardHeader><h3 className="font-semibold">Create Route</h3></CardHeader>
        <CardBody>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
            <Input label="Source" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="Pune" required />
            <Input label="Destination" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} placeholder="Mumbai" required />
            <Button type="submit" loading={submitting}>Create Route</Button>
          </form>
          {formError && <p className="mt-2 text-sm text-red-600">{formError}</p>}
        </CardBody>
      </Card>

      {loading ? <Spinner label="Loading routes..." /> : error ? <ErrorState message={error} onRetry={fetch} /> : routes.length === 0 ? <EmptyState title="No routes found" description="Create your first route above." /> : (
        <div className="grid gap-3 sm:grid-cols-2">
          {routes.map((r) => (
            <div key={r.id} className="rounded-xl border border-slate-200 bg-white px-4 py-3 flex items-center justify-between">
              <span className="font-medium text-slate-900">{r.source} → {r.destination}</span>
              <span className="text-xs text-slate-500">#{r.id}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
