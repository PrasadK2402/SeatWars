import type { CSSProperties, ReactNode } from "react";

export function Card({
  children,
  className = "",
  hover,
  style,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={`card${hover ? " card-hover" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}

export function CardPad({
  children,
  className = "",
  hover,
  style,
}: {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: CSSProperties;
}) {
  return (
    <div className={`card card-pad${hover ? " card-hover" : ""} ${className}`} style={style}>
      {children}
    </div>
  );
}
