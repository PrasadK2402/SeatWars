import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function NotFoundPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-16 text-center">
      <h1 className="text-6xl font-bold text-slate-900">404</h1>
      <p className="mt-2 text-lg font-medium text-slate-700">Page not found</p>
      <p className="mt-1 text-sm text-slate-500">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="mt-6 inline-block">
        <Button>Back to Home</Button>
      </Link>
    </div>
  );
}
