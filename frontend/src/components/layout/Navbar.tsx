import { Link, NavLink } from "react-router-dom";
import { Bus, LayoutDashboard } from "lucide-react";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Bus size={18} />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">SeatWars</span>
          <span className="hidden sm:inline text-xs font-medium text-slate-500 ml-1">Bus Booking</span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`
            }
          >
            Search
          </NavLink>
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-100"}`
            }
          >
            <LayoutDashboard size={16} /> Admin
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
