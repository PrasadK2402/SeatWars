import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRoutes } from "../../api/routes";
import type { Route } from "../../types";
import { SearchForm } from "../../components/booking/SearchForm";
import { Card, CardBody } from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Spinner";
import { ErrorState } from "../../components/ui/EmptyState";
import { Bus, ShieldCheck, Clock } from "lucide-react";

export function HomePage() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getRoutes()
      .then(setRoutes)
      .catch((e) => setError((e as Error).message || "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (data: { source: string; destination: string; travelDate: string }) => {
    const params = new URLSearchParams(data as Record<string, string>);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-b from-indigo-600 to-indigo-700 text-white">
        <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Find your bus. Book your seat.</h1>
            <p className="mt-3 text-indigo-100">Search across routes, pick your seat, and travel with confidence.</p>
          </div>

          <Card className="mx-auto mt-8 max-w-4xl !bg-white !text-slate-900">
            <CardBody>
              {loading ? (
                <Spinner label="Loading routes..." />
              ) : error ? (
                <ErrorState message={error} onRetry={() => window.location.reload()} />
              ) : (
                <SearchForm routes={routes} onSearch={handleSearch} />
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Features */}
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="p-5">
            <Bus className="text-indigo-600" size={24} />
            <h3 className="mt-3 font-semibold text-slate-900">Real-time availability</h3>
            <p className="mt-1 text-sm text-slate-500">Seats come directly from the backend. No mocks, no stale data.</p>
          </Card>
          <Card className="p-5">
            <ShieldCheck className="text-emerald-600" size={24} />
            <h3 className="mt-3 font-semibold text-slate-900">Secure booking</h3>
            <p className="mt-1 text-sm text-slate-500">Race-condition safe — backend validates every seat at confirmation.</p>
          </Card>
          <Card className="p-5">
            <Clock className="text-amber-600" size={24} />
            <h3 className="mt-3 font-semibold text-slate-900">Manage trips</h3>
            <p className="mt-1 text-sm text-slate-500">Admin can manage buses, routes and trips in one place.</p>
          </Card>
        </div>
      </div>
    </div>
  );
}
