import { useEffect, useState } from "react";
import { getBuses } from "../../api/buses";
import { getRoutes } from "../../api/routes";
import { getTrips } from "../../api/trips";
import { Card } from "../../components/ui/Card";
import { Spinner } from "../../components/ui/Spinner";
import { Bus, MapPinned, Route } from "lucide-react";

export function AdminDashboardPage() {
  const [stats, setStats] = useState({ buses: 0, routes: 0, trips: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getBuses().catch(() => []), getRoutes().catch(() => []), getTrips().catch(() => [])]).then(([b, r, t]) => {
      setStats({ buses: b.length, routes: r.length, trips: t.length });
      setLoading(false);
    });
  }, []);

  if (loading) return <Spinner label="Loading dashboard..." />;

  const cards = [
    { label: "Buses", value: stats.buses, icon: Bus, color: "text-indigo-600 bg-indigo-50" },
    { label: "Routes", value: stats.routes, icon: MapPinned, color: "text-emerald-600 bg-emerald-50" },
    { label: "Trips", value: stats.trips, icon: Route, color: "text-amber-600 bg-amber-50" },
  ];

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900">Dashboard</h2>
      <p className="mt-1 text-sm text-slate-500">Overview of your bus booking system.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <Card key={label} className="p-5">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${color}`}>
              <Icon size={20} />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-500">{label}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
