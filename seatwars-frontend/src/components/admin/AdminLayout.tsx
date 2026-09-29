import { Link, NavLink, Outlet } from "react-router-dom";
import { ArrowLeft, Bus, CalendarDays, LayoutDashboard, Route } from "lucide-react";

const LINKS = [
  { to: "/admin", end: true, label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/buses", label: "Buses", icon: Bus },
  { to: "/admin/routes", label: "Routes", icon: Route },
  { to: "/admin/trips", label: "Trips", icon: CalendarDays },
];

export function AdminLayout() {
  return (
    <div className="admin-shell">
      <aside className="admin-side" aria-label="Admin navigation">
        <div className="mono" style={{ padding: "6px 14px 14px", color: "var(--faint)", fontSize: "0.62rem" }}>
          CONTROL DECK
        </div>
        {LINKS.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) => `admin-link${isActive ? " active" : ""}`}
          >
            <Icon /> {label}
          </NavLink>
        ))}
        <div style={{ flex: 1 }} />
        <Link to="/" className="admin-link">
          <ArrowLeft /> Back to site
        </Link>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
