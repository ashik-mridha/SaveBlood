import { Inbox } from "lucide-react";

export default function EmptyState({ title, description, action, icon: Icon = Inbox }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line bg-surface px-6 py-14 text-center">
      <Icon className="size-10 text-muted" aria-hidden="true" />
      <h3 className="text-lg font-bold text-ink">{title}</h3>
      {description && <p className="max-w-md text-sm text-muted">{description}</p>}
      {action}
    </div>
  );
}
