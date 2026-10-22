"use client";

import { Quote, Star } from "lucide-react";
import { api } from "@/lib/api";
import { useFetch } from "@/hooks/useFetch";
import SectionHeading from "@/components/common/SectionHeading";
import Avatar from "@/components/ui/Avatar";
import { Skeleton } from "@/components/ui/Skeleton";

export default function Testimonials() {
  const { data, error } = useFetch(() => api.getTestimonials(), []);
  if (error) return null;

  return (
    <section className="section bg-surface" aria-labelledby="stories-title">
      <div className="container-page">
        <SectionHeading eyebrow="Lives touched" title={<span id="stories-title">Stories from our community</span>} description="Donors, volunteers and families on what a timely donation meant to them." />
        <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {!data
            ? Array.from({ length: 3 }, (_, i) => (
                <li key={i}>
                  <Skeleton className="h-52 w-full rounded-2xl" />
                </li>
              ))
            : data.items.slice(0, 6).map((item) => (
                <li key={item._id} className="flex min-w-0 flex-col gap-4 rounded-2xl border border-line bg-surface-muted p-6">
                  <Quote className="size-7 text-brand-500" aria-hidden="true" />
                  <p className="flex-1 leading-relaxed text-ink">{item.quote}</p>
                  <div className="flex flex-wrap items-center gap-3 border-t border-line pt-4">
                    <Avatar name={item.name} size={44} />
                    <div className="min-w-0">
                      <p className="truncate font-bold text-ink">{item.name}</p>
                      <p className="truncate text-xs text-muted">{item.role}</p>
                    </div>
                    <p className="ml-auto flex gap-0.5 text-amber-500" aria-label={`${item.rating} out of 5 stars`}>
                      {Array.from({ length: item.rating }, (_, i) => (
                        <Star key={i} className="size-4 fill-current" aria-hidden="true" />
                      ))}
                    </p>
                  </div>
                </li>
              ))}
        </ul>
      </div>
    </section>
  );
}
