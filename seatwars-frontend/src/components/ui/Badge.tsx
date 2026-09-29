import type { ReactNode } from "react";

type BadgeVariant = "success" | "danger" | "warning" | "info" | "neutral" | "brand";

export function Badge({
  variant = "neutral",
  children,
}: {
  variant?: BadgeVariant;
  children: ReactNode;
}) {
  return <span className={`badge badge-${variant}`}>{children}</span>;
}
