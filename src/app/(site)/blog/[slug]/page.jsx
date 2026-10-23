"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, Clock } from "lucide-react";
import { api } from "@/lib/api";
import { formatDate } from "@/lib/utils";
import { getDefaultBlog } from "@/lib/defaults/blogs";
import { useFetch } from "@/hooks/useFetch";
import BlogCard from "@/components/blog/BlogCard";
import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

export default function BlogPostPage() {
  const { slug } = useParams();
  const { data: post, error, loading } = useFetch(
    () =>
      api.getBlog(slug).catch((err) => {
        const fallback = getDefaultBlog(slug);
        if (fallback) return fallback;
        throw err;
      }),
    [slug]
  );

  if (error) {
    return (
      <div className="container-page section">
        <EmptyState
          title={error.status === 404 ? "Article not found" : "Article could not be loaded"}
          description={error.status === 404 ? "This article may have been moved or removed." : error.message}
          action={<Button href="/blog">Back to blog</Button>}
        />
      </div>
    );
  }

  if (loading || !post) {
    return (
      <div className="container-page section max-w-3xl" role="status" aria-label="Loading article">
        <Skeleton className="mb-4 h-5 w-32" />
        <Skeleton className="mb-6 h-12 w-full" />
        <Skeleton className="mb-8 aspect-[16/9] w-full" />
        <Skeleton className="mb-3 h-5 w-full" />
        <Skeleton className="mb-3 h-5 w-full" />
        <Skeleton className="h-5 w-2/3" />
      </div>
    );
  }

  return (
    <div className="container-page section">
      <article className="mx-auto max-w-3xl">
        <Link href="/blog" className="focus-ring mb-6 inline-flex items-center gap-2 rounded text-sm font-semibold text-brand-600 hover:underline">
          <ArrowLeft className="size-4" aria-hidden="true" />
          All articles
        </Link>
        <Badge tone="red">{post.category}</Badge>
        <h1 className="mt-4 text-3xl font-extrabold leading-tight tracking-tight text-ink md:text-4xl">{post.title}</h1>
        <p className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted">
          <span className="font-semibold text-ink">{post.author}</span>
          <span>{formatDate(post.publishedAt)}</span>
          <span className="inline-flex items-center gap-1">
            <Clock className="size-4" aria-hidden="true" />
            {post.readTime} min read
          </span>
        </p>

        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-2xl bg-brand-100 dark:bg-brand-900/30">
          <Image src={post.coverImage} alt="" fill priority sizes="(min-width: 768px) 768px, 100vw" className="object-cover" />
        </div>

        <p className="mt-8 text-lg font-medium leading-relaxed text-ink">{post.excerpt}</p>
        <div className="mt-6 flex flex-col gap-5 text-base leading-8 text-muted">
          {post.content.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>

        {post.tags?.length > 0 && (
          <ul className="mt-8 flex flex-wrap gap-2 border-t border-line pt-6" aria-label="Tags">
            {post.tags.map((tag) => (
              <li key={tag}>
                <Badge>#{tag}</Badge>
              </li>
            ))}
          </ul>
        )}
      </article>

      {post.related?.length > 0 && (
        <section className="mt-16" aria-labelledby="related-heading">
          <h2 id="related-heading" className="mb-6 text-2xl font-bold tracking-tight text-ink">
            Related articles
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {post.related.map((item) => (
              <BlogCard key={item._id} post={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
