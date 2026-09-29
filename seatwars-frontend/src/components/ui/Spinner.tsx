export function Spinner({ size = 30 }: { size?: number }) {
  return <div className="spinner" style={{ width: size, height: size }} role="status" aria-label="Loading" />;
}

export function LoadingBlock({ label = "LOADING" }: { label?: string }) {
  return (
    <div className="loading-block">
      <Spinner />
      <span>{label}</span>
    </div>
  );
}
