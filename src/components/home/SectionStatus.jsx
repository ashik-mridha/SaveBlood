import { AlertTriangle, Inbox } from "lucide-react";
import Button from "@/components/ui/Button";

/**
 * Shared loading / error / empty handling for data-driven home sections.
 * The section heading always renders; this fills the body.
 */
export default function SectionStatus({ loading, error, empty, onRetry, emptyTitle, emptyText, skeleton, children }) {
  if (loading) return skeleton;

  if (error) {
    return (
      <div role="alert" className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
        <AlertTriangle className="size-9 text-amber-500" aria-hidden="true" />
        <h3 className="text-lg font-bold text-ink">We could not load this section</h3>
        <p className="max-w-md text-sm text-muted">{error.message}</p>
        <Button variant="outline" onClick={onRetry}>
          Try again
        </Button>
      </div>
    );
  }

  if (empty) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-surface px-6 py-12 text-center">
        <Inbox className="size-9 text-muted" aria-hidden="true" />
        <h3 className="text-lg font-bold text-ink">{emptyTitle}</h3>
        <p className="max-w-md text-sm text-muted">{emptyText}</p>
      </div>
    );
  }

  return children;
}
