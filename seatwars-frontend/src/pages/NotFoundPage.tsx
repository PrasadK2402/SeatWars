import { Link } from "react-router-dom";
import { Home } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="page">
      <div className="container">
        <div className="nf-wrap">
          <div className="nf-code">404</div>
          <h1 className="font-dot" style={{ fontSize: "2rem", margin: "18px 0 10px" }}>SIGNAL LOST.</h1>
          <p className="muted" style={{ margin: "0 0 30px" }}>This route doesn't exist on our network.</p>
          <Link to="/" className="btn btn-primary btn-lg">
            <Home /> Back to base
          </Link>
        </div>
      </div>
    </div>
  );
}
