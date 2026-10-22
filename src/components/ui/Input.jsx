"use client";

import { useId, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

const control =
  "focus-ring w-full rounded-xl border bg-surface px-4 text-sm text-ink placeholder:text-slate-400 transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const borderFor = (error) =>
  error ? "border-red-500" : "border-line hover:border-slate-400 dark:hover:border-slate-500";

/** Label + control + hint/error wrapper. Children receive the generated id through render props. */
export function Field({ label, error, hint, required, className, children }) {
  const id = useId();
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-ink">
          {label}
          {required && <span className="ml-0.5 text-brand-600" aria-hidden="true">*</span>}
        </label>
      )}
      {children({ id, "aria-invalid": error ? true : undefined, "aria-describedby": describedBy })}
      {error ? (
        <p id={`${id}-error`} role="alert" className="text-xs font-medium text-red-600 dark:text-red-400">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-hint`} className="text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ label, error, hint, className, required, type = "text", ...props }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <Field label={label} error={error} hint={hint} required={required} className={className}>
      {(aria) => (
        <div className="relative">
          <input
            {...aria}
            {...props}
            required={required}
            type={isPassword && visible ? "text" : type}
            className={cn(control, "h-11", borderFor(error), isPassword && "pr-11")}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? "Hide password" : "Show password"}
              className="focus-ring absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-slate-500 hover:text-brand-600"
            >
              {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          )}
        </div>
      )}
    </Field>
  );
}

export function Textarea({ label, error, hint, className, required, rows = 4, ...props }) {
  return (
    <Field label={label} error={error} hint={hint} required={required} className={className}>
      {(aria) => (
        <textarea
          {...aria}
          {...props}
          required={required}
          rows={rows}
          className={cn(control, "resize-y py-3", borderFor(error))}
        />
      )}
    </Field>
  );
}

export function Select({ label, error, hint, className, required, options = [], placeholder, ...props }) {
  return (
    <Field label={label} error={error} hint={hint} required={required} className={className}>
      {(aria) => (
        <select {...aria} {...props} required={required} className={cn(control, "h-11 appearance-none bg-[length:1rem] bg-[right_0.75rem_center] bg-no-repeat pr-10", borderFor(error))} style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")" }}>
          {placeholder !== undefined && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      )}
    </Field>
  );
}
