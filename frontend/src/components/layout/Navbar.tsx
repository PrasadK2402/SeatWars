import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bus, LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white">
            <Bus size={18} />
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">Seatwars</span>
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
          {isAuthenticated ? (
            <>
              <NavLink
                to="/my-bookings"
                className={({ isActive }) =>
                  `rounded-lg px-3 py-2 text-sm font-medium transition ${isActive ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"}`
                }
              >
                My Bookings
              </NavLink>
              <span className="hidden sm:inline text-sm font-medium text-slate-700">
                Hi, {user?.name}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut size={16} /> Logout
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
