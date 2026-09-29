import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Bus, CalendarDays, Route } from "lucide-react";
import { getBuses } from "../../api/buses";
import { getRoutes } from "../../api/routes";
import { getAllTrips } from "../../api/trips";
import { getErrorMessage } from "../../api/client";
import { CardPad } from "../../components/ui/Card";
import { Alert } from "../../components/ui/Alert";
import { LoadingBlock } from "../../components/ui/Spinner";
import { todayISO } from "../../utils/format";

export function DashboardPage() {
  const [stats, setStats] = useState({ buses: 0, routes: 0, trips: 0, today: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([getBuses(), getRoutes(), getAllTrips()])
      .then(([buses, routes, trips]) => {
        setStats({
          buses: buses.length,
          routes: routes.length,
          trips: trips.length,
          today: trips.filter((t) => t.travelDate === todayISO()).length,
        });
      })
      .catch((e) => setError(getErrorMessage(e)))
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { icon: Bus, label: "Buses", value: stats.buses, to: "/admin/buses" },
    { icon: Route, label: "Routes", value: stats.routes, to: "/admin/routes" },
    { icon: CalendarDays, label: "Trips scheduled", value: stats.trips, to: "/admin/trips" },
    { icon: CalendarDays, label: "Trips today", value: stats.today, to: "/admin/trips" },
  ];

  return (
    <>
      <span className="kicker">CONTROL DECK</span>
      <h1 className="admin-title mt-1">DASHBOARD<span className="red">.</span></h1>
      <p className="admin-sub">Fleet telemetry at a glance.</p>

      {error && <Alert kind="error">{error}</Alert>}

      {loading ? (
        <LoadingBlock />
      ) : (
        <>
          <div className="stat-grid-4">
            {cards.map((c) => (
              <Link key={c.label} to={c.to}>
                <CardPad hover className="stat-card">
                  <div className="stat-icon" style={{ background: "var(--panel-2)", border: "1px solid var(--line)", color: "var(--red)" }}>
                    <c.icon />
                  </div>
                  <div>
                    <div className="num">{c.value}</div>
                    <div className="lbl">{c.label}</div>
                  </div>
                </CardPad>
              </Link>
            ))}
          </div>

          <div className="grid grid-3 mt-4">
            {[
              { to: "/admin/buses", title: "MANAGE BUSES", desc: "Add buses and design each bus's seat layout." },
              { to: "/admin/routes", title: "MANAGE ROUTES", desc: "Define the source → destination pairs you serve." },
              { to: "/admin/trips", title: "SCHEDULE TRIPS", desc: "Put a bus on a route for a date — seats generate automatically." },
            ].map((a) => (
              <Link key={a.to} to={a.to}>
                <CardPad hover>
                  <div className="between">
                    <h3 className="mono" style={{ margin: 0, fontSize: "0.78rem" }}>{a.title}</h3>
                    <ArrowRight size={18} className="muted" />
                  </div>
                  <p className="muted small" style={{ margin: "12px 0 0", lineHeight: 1.7 }}>{a.desc}</p>
                </CardPad>
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
}
