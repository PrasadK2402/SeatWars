import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { Bus, ShieldCheck, Ticket, UserPlus, Zap } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../api/client";
import { Field, Input } from "../components/ui/Form";
import { Button } from "../components/ui/Button";
import { Alert } from "../components/ui/Alert";

export function RegisterPage() {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/" replace />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError("PLEASE ENTER YOUR NAME.");
    if (!email.trim()) return setError("PLEASE ENTER YOUR EMAIL.");
    if (password.length < 6) return setError("PASSWORD MUST BE AT LEAST 6 CHARACTERS.");
    setLoading(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      navigate("/", { replace: true });
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
          <h2>JOIN THE<br />MANIFEST<span className="red">.</span></h2>
          <p className="lead">One account for every route — scan, book and board in seconds.</p>
          <div className="auth-points">
            <span className="auth-point"><Zap /> Instant booking confirmation</span>
            <span className="auth-point"><Ticket /> Every ticket in one log</span>
            <span className="auth-point"><ShieldCheck /> JWT-secured sign-in</span>
          </div>
        </div>
        <p className="mono" style={{ position: "relative", color: "#6f6f6f", margin: 0, fontSize: "0.62rem" }}>
          SYS.STATUS // OPERATIONAL
        </p>
      </div>

      <div className="auth-form-wrap">
        <div className="auth-form">
          <span className="kicker">NEW OPERATOR</span>
          <h1 className="mt-1">CREATE ACCOUNT</h1>
          <p className="sub">Thirty seconds, then you're boarding.</p>
          {error && <Alert kind="error">{error}</Alert>}
          <form onSubmit={submit} noValidate>
            <Field label="Full name" htmlFor="reg-name">
              <Input
                id="reg-name"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
              />
            </Field>
            <Field label="Email" htmlFor="reg-email">
              <Input
                id="reg-email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </Field>
            <Field label="Password" htmlFor="reg-password">
              <Input
                id="reg-password"
                type="password"
                placeholder="Min. 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
              />
            </Field>
            <Button type="submit" block size="lg" loading={loading}>
              <UserPlus /> Sign up
            </Button>
          </form>
          <p className="auth-alt">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
