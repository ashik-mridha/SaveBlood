"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { loadFaqs } from "@/lib/content";
import { cn } from "@/lib/utils";
import { useFetch } from "@/hooks/useFetch";
import SectionHeading from "@/components/common/SectionHeading";
import { Skeleton } from "@/components/ui/Skeleton";
import SectionStatus from "./SectionStatus";

export default function Faq() {
  const { data, loading } = useFetch(loadFaqs, []);
  const [openId, setOpenId] = useState(null);
  const items = data?.items ?? [];

  return (
    <section className="section bg-surface" aria-labelledby="faq-title">
      <div className="container-page max-w-3xl">
        <SectionHeading eyebrow="Questions" title={<span id="faq-title">Frequently asked questions</span>} description="Straight answers about eligibility, safety and how the platform works." />
        <SectionStatus
          loading={loading && !data}
          skeleton={
            <div className="flex flex-col gap-3" role="status" aria-label="Loading questions">
              {Array.from({ length: 5 }, (_, i) => (
                <Skeleton key={i} className="h-14 w-full rounded-xl" />
              ))}
            </div>
          }
        >
          <div className="flex flex-col gap-3">
            {items.map((item) => {
              const open = openId === item._id;
              return (
                <div key={item._id} className="rounded-xl border border-line bg-surface-muted">
                  <h3>
                    <button
                      type="button"
                      onClick={() => setOpenId(open ? null : item._id)}
                      aria-expanded={open}
                      aria-controls={`faq-${item._id}`}
                      className="focus-ring flex w-full items-center justify-between gap-4 rounded-xl px-5 py-4 text-left font-semibold text-ink"
                    >
                      {item.question}
                      <ChevronDown className={cn("size-5 shrink-0 text-brand-600 transition-transform", open && "rotate-180")} aria-hidden="true" />
                    </button>
                  </h3>
                  <div id={`faq-${item._id}`} role="region" hidden={!open} className="px-5 pb-5 text-sm leading-relaxed text-muted">
                    {item.answer}
                  </div>
                </div>
              );
            })}
          </div>
        </SectionStatus>
      </div>
    </section>
  );
}
