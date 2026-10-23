"use client";

import { ArrowRight } from "lucide-react";
import { loadLatestBlogs } from "@/lib/content";
import { useFetch } from "@/hooks/useFetch";
import SectionHeading from "@/components/common/SectionHeading";
import BlogCard from "@/components/blog/BlogCard";
import Button from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import SectionStatus from "./SectionStatus";

export default function BlogPreview() {
  const { data, loading } = useFetch(() => loadLatestBlogs(3), []);
  const items = data?.items ?? [];

  return (
    <section className="section" aria-labelledby="blog-title">
      <div className="container-page">
        <SectionHeading eyebrow="Learn" title={<span id="blog-title">From the SaveBlood blog</span>} description="Practical guides on eligibility, recovery and organising blood drives." />
        <SectionStatus
          loading={loading && !data}
          skeleton={
            <div className="grid gap-6 md:grid-cols-3" role="status" aria-label="Loading articles">
              {Array.from({ length: 3 }, (_, i) => (
                <Skeleton key={i} className="h-80 w-full rounded-2xl" />
              ))}
            </div>
          }
        >
          <div className="grid gap-6 md:grid-cols-3">
            {items.map((post) => (
              <BlogCard key={post._id} post={post} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Button href="/blog" variant="outline" size="lg">
              Read all articles
              <ArrowRight className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </SectionStatus>
      </div>
    </section>
  );
}
