import { NavLink, Outlet } from "react-router-dom";
import { LayoutDashboard, Bus, MapPinned, Route as RouteIcon } from "lucide-react";

const links = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/buses", label: "Buses", icon: Bus },
  { to: "/admin/routes", label: "Routes", icon: MapPinned },
  { to: "/admin/trips", label: "Trips", icon: RouteIcon },
];

export function AdminLayout() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full lg:w-56 shrink-0">
          <div className="rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
            <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Admin</p>
            <nav className="space-y-1">
              {links.map(({ to, label, icon: Icon, end }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`
                  }
                >
                  <Icon size={16} /> {label}
                </NavLink>
              ))}
            </nav>
          </div>
        </aside>
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
