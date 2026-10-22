import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function pageWindow(page, pages) {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const items = new Set([1, pages, page, page - 1, page + 1]);
  const sorted = [...items].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  return sorted.flatMap((n, i) => (i > 0 && n - sorted[i - 1] > 1 ? ["gap-" + n, n] : [n]));
}

export default function Pagination({ page, pages, onChange, className }) {
  if (pages <= 1) return null;

  const base = "focus-ring inline-flex h-10 min-w-10 items-center justify-center rounded-xl border px-3 text-sm font-semibold transition-colors";

  return (
    <nav aria-label="Pagination" className={cn("flex flex-wrap items-center justify-center gap-2", className)}>
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="Previous page"
        className={cn(base, "border-line bg-surface text-ink hover:border-brand-500 disabled:opacity-40")}
      >
        <ChevronLeft className="size-4" />
      </button>
      {pageWindow(page, pages).map((item) =>
        typeof item === "string" ? (
          <span key={item} className="px-1 text-muted" aria-hidden="true">
            …
          </span>
        ) : (
          <button
            key={item}
            type="button"
            onClick={() => onChange(item)}
            aria-current={item === page ? "page" : undefined}
            className={cn(
              base,
              item === page ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-surface text-ink hover:border-brand-500"
            )}
          >
            {item}
          </button>
        )
      )}
      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= pages}
        aria-label="Next page"
        className={cn(base, "border-line bg-surface text-ink hover:border-brand-500 disabled:opacity-40")}
      >
        <ChevronRight className="size-4" />
      </button>
    </nav>
  );
}
