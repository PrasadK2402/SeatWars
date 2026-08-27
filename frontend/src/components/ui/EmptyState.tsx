import type { ReactNode } from "react";

export function EmptyState({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50/50 px-6 py-12 text-center">
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm border border-slate-200">🚌</div>
      <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800">
      <p className="font-medium">Something went wrong</p>
      <p className="mt-1 text-red-700">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-3 text-sm font-medium underline hover:no-underline">
          Try again
        </button>
      )}
    </div>
  );
}
