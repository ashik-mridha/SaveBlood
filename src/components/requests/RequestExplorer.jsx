"use client";

import { useState } from "react";
import { Search, SearchX, SlidersHorizontal } from "lucide-react";
import { api } from "@/lib/api";
import { bloodGroups, districts } from "@/components/geoData";
import { useDebounce } from "@/hooks/useDebounce";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import RequestCard from "@/components/common/RequestCard";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/ui/EmptyState";
import { Input, Select } from "@/components/ui/Input";
import Pagination from "@/components/ui/Pagination";
import { CardSkeleton } from "@/components/ui/Skeleton";

const PAGE_SIZE = 12;

const urgencyOptions = [
  { key: "critical", label: "Critical" },
  { key: "urgent", label: "Urgent" },
  { key: "normal", label: "Normal" },
];

const statusOptions = [
  { key: "pending", label: "Open requests" },
  { key: "inprogress", label: "Donor found" },
  { key: "done", label: "Completed" },
  { key: "all", label: "All requests" },
];

const sortOptions = [
  { key: "urgent", label: "Most urgent" },
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "soon", label: "Needed soonest" },
];

const emptyFilters = { bloodGroup: "", district: "", urgency: "", status: "pending" };

export default function RequestExplorer() {
  const [searchInput, setSearchInput] = useState("");
  const search = useDebounce(searchInput.trim(), 400);

  const { items, total, pages, page, sort, filters, loading, error, setPage, setSort, setFilters } = usePaginatedQuery(
    (params) => api.getPublicRequests(params),
    { initialFilters: emptyFilters, extraParams: { search }, limit: PAGE_SIZE, initialSort: "urgent" }
  );

  const hasActiveFilters = searchInput || Object.entries(emptyFilters).some(([key, value]) => filters[key] !== value);

  const reset = () => {
    setSearchInput("");
    setFilters(emptyFilters);
    setSort("urgent");
  };

  const goToPage = (next) => {
    setPage(next);
    document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <>
      <section className="border-b border-line bg-surface">
        <div className="container-page py-10 md:py-14">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-brand-600">Explore</p>
          <h1 className="text-3xl font-extrabold tracking-tight text-ink md:text-4xl">Blood donation requests</h1>
          <p className="mt-3 max-w-2xl text-muted">
            Patients across Bangladesh are waiting for a matching donor. Filter by blood group and district, then open a request to respond.
          </p>

          <form role="search" aria-label="Filter donation requests" onSubmit={(e) => e.preventDefault()} className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
            <div className="relative sm:col-span-2 lg:col-span-2">
              <Search className="pointer-events-none absolute bottom-3.5 left-3.5 size-4 text-muted" aria-hidden="true" />
              <Input
                label="Search"
                type="search"
                placeholder="Patient, hospital or area"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="[&_input]:pl-10"
              />
            </div>
            <Select label="Blood group" placeholder="All groups" options={bloodGroups} value={filters.bloodGroup} onChange={(e) => setFilters({ bloodGroup: e.target.value })} />
            <Select label="District" placeholder="All districts" options={districts} value={filters.district} onChange={(e) => setFilters({ district: e.target.value })} />
            <Select label="Urgency" placeholder="Any urgency" options={urgencyOptions} value={filters.urgency} onChange={(e) => setFilters({ urgency: e.target.value })} />
            <Select label="Status" options={statusOptions} value={filters.status} onChange={(e) => setFilters({ status: e.target.value })} />
          </form>
        </div>
      </section>

      <section id="results" className="container-page scroll-mt-20 py-10" aria-live="polite">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <p className="text-sm font-medium text-muted">
            {loading ? "Loading requests…" : `${total} ${total === 1 ? "request" : "requests"} found`}
          </p>
          <div className="flex items-center gap-3">
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={reset}>
                Clear filters
              </Button>
            )}
            <label className="flex items-center gap-2 text-sm font-semibold text-ink">
              <SlidersHorizontal className="size-4 text-brand-600" aria-hidden="true" />
              Sort by
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="focus-ring h-10 rounded-xl border border-line bg-surface px-3 text-sm font-medium"
              >
                {sortOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {error ? (
          <EmptyState title="We could not load requests" description={error.message} action={<Button onClick={() => setFilters({})}>Try again</Button>} />
        ) : loading && !items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }, (_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title="No requests match these filters"
            description="Try another blood group or district, or clear the filters to see every open request."
            action={<Button onClick={reset}>Clear filters</Button>}
          />
        ) : (
          <div className={`grid gap-6 transition-opacity sm:grid-cols-2 xl:grid-cols-4 ${loading ? "opacity-60" : ""}`}>
            {items.map((request, i) => (
              <RequestCard key={request._id} request={request} priority={i < 4} />
            ))}
          </div>
        )}

        <Pagination page={page} pages={pages} onChange={goToPage} className="mt-10" />
      </section>
    </>
  );
}
