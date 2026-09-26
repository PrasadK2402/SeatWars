import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login as loginApi } from "../../api/auth";
import { useAuth } from "../../hooks/useAuth";
import { getErrorMessage } from "../../api/axios";
import { Card, CardBody } from "../../components/ui/Card";
import { Input } from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import { Bus } from "lucide-react";

export function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const from = (location.state as { from?: string } | null)?.from;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await loginApi({ email, password });
      login(res);
      if (res.role === "ADMIN") {
        navigate("/admin", { replace: true });
      } else {
        navigate(from || "/search", { replace: true });
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <div className="mb-6 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white">
          <Bus size={24} />
        </span>
        <h2 className="mt-4 text-2xl font-bold text-slate-900">Welcome back</h2>
        <p className="mt-1 text-sm text-slate-500">Sign in to continue to Seatwars</p>
      </div>

      <Card>
        <CardBody>
          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
            <Button type="submit" className="w-full" loading={loading}>
              Sign In
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Don't have an account?{" "}
            <Link to="/register" className="font-medium text-indigo-600 hover:underline">
              Register
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
