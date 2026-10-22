"use client";

import { ArrowRight } from "lucide-react";
import { api } from "@/lib/api";
import { useFetch } from "@/hooks/useFetch";
import SectionHeading from "@/components/common/SectionHeading";
import RequestCard from "@/components/common/RequestCard";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";

export default function FeaturedRequests() {
  const { data, loading, error } = useFetch(() => api.getPublicRequests({ sort: "urgent", limit: 8 }), []);

  return (
    <section className="section" aria-labelledby="featured-title">
      <div className="container-page">
        <SectionHeading
          eyebrow="Needed now"
          title={<span id="featured-title">Urgent blood requests</span>}
          description="Patients waiting for a matching donor, most urgent first. Open a request to see the hospital, date and how to respond."
        />

        {error ? (
          <EmptyState title="Requests could not be loaded" description={error.message} />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {loading && !data
              ? Array.from({ length: 4 }, (_, i) => <CardSkeleton key={i} />)
              : data.items.map((request, i) => <RequestCard key={request._id} request={request} priority={i < 4} />)}
          </div>
        )}

        <div className="mt-10 text-center">
          <Button href="/donation-requests" variant="outline" size="lg">
            Browse all requests
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>
    </section>
  );
}
