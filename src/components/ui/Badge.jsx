import { cn } from "@/lib/utils";

const tones = {
  red: "bg-red-100 text-red-800 dark:bg-red-950/60 dark:text-red-200",
  amber: "bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-200",
  green: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-200",
  slate: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200",
  solid: "bg-brand-600 text-white",
};

export default function Badge({ tone = "slate", className, children, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold leading-none",
        tones[tone],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
