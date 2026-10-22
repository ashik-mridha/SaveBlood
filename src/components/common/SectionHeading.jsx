import { cn } from "@/lib/utils";

export default function SectionHeading({ eyebrow, title, description, align = "center", className, as: Tag = "h2" }) {
  return (
    <div className={cn("mb-10 max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-600">{eyebrow}</p>}
      <Tag className="text-3xl font-extrabold tracking-tight text-ink md:text-4xl">{title}</Tag>
      {description && <p className="mt-3 text-base leading-relaxed text-muted">{description}</p>}
    </div>
  );
}
