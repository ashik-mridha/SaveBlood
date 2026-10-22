import { cn } from "@/lib/utils";

export function Card({ className, as: Tag = "div", ...props }) {
  return (
    <Tag
      className={cn("rounded-2xl border border-line bg-surface shadow-card", className)}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col gap-1 border-b border-line p-5", className)} {...props} />;
}

export function CardBody({ className, ...props }) {
  return <div className={cn("p-5", className)} {...props} />;
}

export function CardTitle({ as: Tag = "h3", className, ...props }) {
  return <Tag className={cn("text-lg font-bold tracking-tight text-ink", className)} {...props} />;
}
