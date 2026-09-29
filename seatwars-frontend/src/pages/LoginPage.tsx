import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Bus, LogIn, ShieldCheck, Ticket, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/client";
import { Field, Input } from "../components/ui/Form";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";

export function LoginPage() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to={from} replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim() || !password) return setError("ENTER YOUR EMAIL AND PASSWORD.");
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-panel">
        <div className="starfield" />
        <div className="hero-glow" />
        <div style={{ position: "relative" }}>
          <div className="brand">
            <span className="brand-glyph"><Bus /></span>
            <span className="brand-word">SEATWARS</span>
          </div>
          <h2>YOUR NEXT TRIP IS ONE SEAT AWAY<span className="red">.</span></h2>
          <p className="lead">Log in to scan trips, claim seats on the live schematic and manage your bookings.</p>
          <div className="auth-points">
            <span className="auth-point"><Zap /> Instant booking confirmation</span>
            <span className="auth-point"><Ticket /> Every ticket in one log</span>
            <span className="auth-point"><ShieldCheck /> JWT-secured sign-in</span>
          </div>
        </div>
        <p className="mono" style={{ position: "relative", color: "#6f6f6f", margin: 0, fontSize: "0.62rem" }}>
          DEMO ADMIN // ADMIN@PASARA.COM / ADMIN123
        </p>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-form">
          <span className="kicker">ACCESS TERMINAL</span>
          <h1 className="mt-1">WELCOME BACK</h1>
          <p className="sub">Authenticate to continue.</p>
          {error && <Alert kind="error">{error}</Alert>}
          <form onSubmit={submit} noValidate>
            <Field label="Email" htmlFor="login-email">
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Field>
            <Field label="Password" htmlFor="login-password">
              <Input
                id="login-password"
                type="password"
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
            </Field>
            <Button type="submit" block size="lg" loading={loading}>
              <LogIn /> Log in
            </Button>
          </form>
          <p className="auth-alt">
            New to SeatWars? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
