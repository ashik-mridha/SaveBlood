import { cn } from "@/lib/utils";

export function Skeleton({ className }) {
  return <div aria-hidden="true" className={cn("animate-pulse rounded-lg bg-slate-200 dark:bg-slate-700/60", className)} />;
}

export function CardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card" role="status" aria-label="Loading">
      <Skeleton className="aspect-[16/10] w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="mt-auto flex flex-col gap-2 pt-3">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-11 w-full rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5, columns = 5 }) {
  return (
    <div className="flex flex-col gap-3 p-5" role="status" aria-label="Loading">
      {Array.from({ length: rows }, (_, row) => (
        <div key={row} className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {Array.from({ length: columns }, (_, col) => (
            <Skeleton key={col} className="h-6" />
          ))}
        </div>
      ))}
    </div>
  );
}
