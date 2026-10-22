import { Card } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StatCard({ icon: Icon, label, value, loading }) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-300">
        <Icon className="size-6" aria-hidden="true" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium text-muted">{label}</p>
        {loading ? <Skeleton className="mt-1 h-7 w-16" /> : <p className="truncate text-2xl font-extrabold text-ink">{value}</p>}
      </div>
    </Card>
  );
}
