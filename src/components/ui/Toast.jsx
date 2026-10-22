"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";

const ToastContext = createContext(null);

const icons = { success: CheckCircle2, error: AlertTriangle, info: Info };
const tones = {
  success: "border-emerald-500/40",
  error: "border-red-500/50",
  info: "border-slate-400/50",
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((toast) => toast.id !== id)), []);

  const notify = useCallback(
    (type, message) => {
      const id = crypto.randomUUID();
      setToasts((list) => [...list.slice(-3), { id, type, message }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  const api = useMemo(
    () => ({
      success: (message) => notify("success", message),
      error: (message) => notify("error", message),
      info: (message) => notify("info", message),
    }),
    [notify]
  );

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed inset-x-4 bottom-4 z-[80] flex flex-col items-end gap-2 sm:inset-x-auto sm:right-4" aria-live="polite">
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <div
              key={toast.id}
              role="status"
              className={cn(
                "pointer-events-auto flex w-full max-w-sm items-start gap-3 rounded-xl border bg-surface p-4 text-sm text-ink shadow-xl",
                tones[toast.type]
              )}
            >
              <Icon className={cn("mt-0.5 size-5 shrink-0", toast.type === "success" ? "text-emerald-600" : toast.type === "error" ? "text-red-600" : "text-slate-500")} aria-hidden="true" />
              <p className="flex-1 font-medium">{toast.message}</p>
              <button type="button" onClick={() => dismiss(toast.id)} aria-label="Dismiss notification" className="focus-ring rounded text-muted hover:text-ink">
                <X className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
