import Link from "next/link";
import Image from "next/image";
import { Clock } from "lucide-react";
import { formatDate } from "@/lib/utils";
import Badge from "@/components/ui/Badge";

export default function BlogCard({ post }) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-line bg-surface shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-lift">
      <Link href={`/blog/${post.slug}`} className="focus-ring relative block aspect-[16/10] overflow-hidden bg-brand-100 dark:bg-brand-900/30" tabIndex={-1} aria-hidden="true">
        <Image
          src={post.coverImage}
          alt=""
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex flex-wrap items-center gap-3 text-xs text-muted">
          <Badge tone="red">{post.category}</Badge>
          <span>{formatDate(post.publishedAt)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-3.5" aria-hidden="true" />
            {post.readTime} min read
          </span>
        </div>
        <h3 className="text-lg font-bold leading-snug tracking-tight text-ink">
          <Link href={`/blog/${post.slug}`} className="focus-ring rounded hover:text-brand-600">
            {post.title}
          </Link>
        </h3>
        <p className="text-sm leading-relaxed text-muted">{post.excerpt}</p>
        <p className="mt-auto pt-2 text-sm font-semibold text-ink">{post.author}</p>
      </div>
    </article>
  );
}
