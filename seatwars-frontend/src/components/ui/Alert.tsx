import type { ReactNode } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";

type AlertKind = "error" | "success" | "info" | "warning";

const ICONS = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
  warning: TriangleAlert,
};

export function Alert({ kind, children }: { kind: AlertKind; children: ReactNode }) {
  const Icon = ICONS[kind];
  return (
    <div className={`alert alert-${kind}`} role="alert">
      <Icon />
      <div>{children}</div>
    </div>
  );
}
