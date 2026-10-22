import Link from "next/link";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const variants = {
  primary: "bg-brand-600 text-white hover:bg-brand-700 shadow-sm active:bg-brand-800",
  secondary: "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white",
  outline: "border border-line bg-surface text-ink hover:border-brand-500 hover:text-brand-600",
  ghost: "text-ink hover:bg-slate-100 dark:hover:bg-slate-800",
  danger: "bg-red-700 text-white hover:bg-red-800",
  soft: "bg-brand-50 text-brand-700 hover:bg-brand-100 dark:bg-brand-900/30 dark:text-brand-200 dark:hover:bg-brand-900/50",
};

const sizes = {
  sm: "h-9 px-3 text-sm gap-1.5",
  md: "h-11 px-5 text-sm gap-2",
  lg: "h-12 px-6 text-base gap-2",
  icon: "h-10 w-10 justify-center",
};

export default function Button({
  variant = "primary",
  size = "md",
  loading = false,
  href,
  className,
  children,
  disabled,
  type = "button",
  ...props
}) {
  const classes = cn(
    "focus-ring inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl font-semibold transition-colors duration-200",
    "disabled:pointer-events-none disabled:opacity-60",
    variants[variant],
    sizes[size],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
