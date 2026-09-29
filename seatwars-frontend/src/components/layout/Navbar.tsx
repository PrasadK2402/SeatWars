import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Bus, LayoutDashboard, LogOut, Menu, Moon, Sun, Ticket, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";

export function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [userOpen, setUserOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setUserOpen(false);
    navigate("/");
  };

  const initial = user?.name?.trim()?.[0]?.toUpperCase() ?? "U";

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="SeatWars home">
          <span className="brand-glyph"><Bus /></span>
          <span className="brand-word">SEATWARS</span>
        </Link>

        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            <Bus /> Book
          </NavLink>
          <NavLink to="/my-bookings" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
            <Ticket /> My bookings
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`}>
              <LayoutDashboard /> Control deck
            </NavLink>
          )}
        </nav>

        <div className="header-spacer" />

        <button
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
          title={theme === "light" ? "Dark mode" : "Light mode"}
        >
          {theme === "light" ? <Moon /> : <Sun />}
        </button>

        {isAuthenticated ? (
          <div style={{ position: "relative" }}>
            <button className="user-chip" onClick={() => setUserOpen((o) => !o)} aria-haspopup="menu" aria-expanded={userOpen}>
              <span className="user-avatar">{initial}</span>
              <span className="hide-sm">{user?.name?.split(" ")[0]}</span>
            </button>
            {userOpen && (
              <>
                <div style={{ position: "fixed", inset: 0, zIndex: 1 }} onClick={() => setUserOpen(false)} />
                <div className="user-menu" role="menu">
                  <div className="user-menu-head">
                    <div style={{ fontWeight: 700, fontSize: "0.92rem" }}>{user?.name}</div>
                    <div className="muted small mono" style={{ marginTop: 4 }}>{user?.email}</div>
                  </div>
                  <Link to="/my-bookings" className="nav-link" style={{ width: "100%" }} onClick={() => setUserOpen(false)}>
                    <Ticket size={16} /> My bookings
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" className="nav-link" style={{ width: "100%" }} onClick={() => setUserOpen(false)}>
                      <LayoutDashboard size={16} /> Control deck
                    </Link>
                  )}
                  <button className="nav-link" style={{ width: "100%", color: "var(--danger)" }} onClick={handleLogout}>
                    <LogOut size={16} /> Log out
                  </button>
                </div>
              </>
            )}
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary btn-sm hide-sm">Log in</Link>
        )}

        <button className="icon-btn mobile-menu-btn" onClick={() => setMobileOpen((o) => !o)} aria-label="Menu">
          {mobileOpen ? <X /> : <Menu />}
        </button>
      </div>
      {mobileOpen && (
        <div className="mobile-menu">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} onClick={() => setMobileOpen(false)}>
            <Bus size={16} /> Book
          </NavLink>
          <NavLink to="/my-bookings" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} onClick={() => setMobileOpen(false)}>
            <Ticket size={16} /> My bookings
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin" className={({ isActive }) => `nav-link${isActive ? " active" : ""}`} onClick={() => setMobileOpen(false)}>
              <LayoutDashboard size={16} /> Control deck
            </NavLink>
          )}
          {!isAuthenticated && (
            <Link to="/login" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>Log in</Link>
          )}
        </div>
      )}
    </header>
  );
}
