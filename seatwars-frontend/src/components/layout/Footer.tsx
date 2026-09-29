import { Link } from "react-router-dom";
import { Bus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

export function Footer() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <div className="brand">
              <span className="brand-glyph"><Bus /></span>
              <span className="brand-word">SEATWARS</span>
            </div>
            <p className="about">
              Mission control for bus travel. Live seat schematics,
              instant confirmation and free cancellation on every trip.
            </p>
            <p className="footer-fact mt-3">SYS.STATUS // OPERATIONAL</p>
          </div>
          <div>
            <h4>Book</h4>
            <ul>
              <li><Link to="/">SEARCH TRIPS</Link></li>
              {isAuthenticated && <li><Link to="/my-bookings">MY BOOKINGS</Link></li>}
              {!isAuthenticated && (
                <>
                  <li><Link to="/login">LOG IN</Link></li>
                  <li><Link to="/register">SIGN UP</Link></li>
                </>
              )}
            </ul>
          </div>
          <div>
            <h4>Control</h4>
            <ul>
              {isAdmin ? (
                <>
                  <li><Link to="/admin">DASHBOARD</Link></li>
                  <li><Link to="/admin/buses">BUSES</Link></li>
                  <li><Link to="/admin/routes">ROUTES</Link></li>
                  <li><Link to="/admin/trips">TRIPS</Link></li>
                </>
              ) : (
                <li><Link to="/login">ADMIN SIGN IN</Link></li>
              )}
            </ul>
          </div>
          <div>
            <h4>Specs</h4>
            <ul>
              <li><span className="footer-fact">LIVE SEAT MAPS</span></li>
              <li><span className="footer-fact">INSTANT CONFIRMATION</span></li>
              <li><span className="footer-fact">FREE CANCELLATION</span></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} SEATWARS // ALL ROUTES RESERVED</span>
          <span>TERMINAL BUILD // V1.0</span>
        </div>
      </div>
    </footer>
  );
}
