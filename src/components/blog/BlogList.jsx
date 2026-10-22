"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/useDebounce";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import SectionHeading from "@/components/common/SectionHeading";
import Pagination from "@/components/ui/Pagination";
import EmptyState from "@/components/ui/EmptyState";
import { CardSkeleton } from "@/components/ui/Skeleton";
import BlogCard from "./BlogCard";

export default function BlogList() {
  const [searchText, setSearchText] = useState("");
  const search = useDebounce(searchText.trim(), 400);
  const [categories, setCategories] = useState([]);

  const query = usePaginatedQuery(
    async (params) => {
      const result = await api.getBlogs({ ...params, sort: undefined });
      setCategories(result.categories || []);
      return result;
    },
    { initialFilters: { category: "all" }, extraParams: { search }, limit: 6 }
  );
  const { filters, setFilters } = query;

  const chip = (value, label) => (
    <button
      key={value}
      type="button"
      onClick={() => setFilters({ category: value })}
      aria-pressed={filters.category === value}
      className={cn(
        "focus-ring rounded-full border px-4 py-2 text-sm font-semibold transition-colors",
        filters.category === value ? "border-brand-600 bg-brand-600 text-white" : "border-line bg-surface text-ink hover:border-brand-500"
      )}
    >
      {label}
    </button>
  );

  return (
    <div className="container-page section">
      <SectionHeading
        as="h1"
        eyebrow="SaveBlood Blog"
        title="Stories and guides for donors and families"
        description="Practical, medically reviewed advice on giving blood, recovering well and helping your community."
      />

      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {chip("all", "All")}
          {categories.map((category) => chip(category, category))}
        </div>
        <div className="relative w-full md:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
          <input
            type="search"
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search articles"
            aria-label="Search articles"
            className="focus-ring h-11 w-full rounded-xl border border-line bg-surface pl-10 pr-4 text-sm text-ink placeholder:text-slate-400"
          />
        </div>
      </div>

      {query.loading && !query.items.length ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }, (_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : query.error ? (
        <EmptyState title="Articles could not be loaded" description={query.error.message} />
      ) : !query.items.length ? (
        <EmptyState title="No articles found" description="Try a different category or search term." />
      ) : (
        <div className={cn("grid gap-6 md:grid-cols-2 lg:grid-cols-3", query.loading && "opacity-60")}>
          {query.items.map((post) => (
            <BlogCard key={post._id} post={post} />
          ))}
        </div>
      )}

      <Pagination page={query.page} pages={query.pages} onChange={query.setPage} className="mt-10" />
    </div>
  );
}
