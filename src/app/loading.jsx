import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center" role="status" aria-label="Loading">
      <Loader2 className="size-9 animate-spin text-brand-600" />
    </div>
  );
}
