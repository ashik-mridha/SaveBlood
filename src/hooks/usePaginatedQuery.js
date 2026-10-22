"use client";

import { useCallback, useState } from "react";
import { useFetch } from "./useFetch";

/**
 * Server-driven list state: page, filters and sort live here, the API does the work.
 *
 * fetcher(params) must resolve to { items, total, page, pages }.
 * Changing a filter, the sort or `extraParams` (e.g. a debounced search term) returns to page 1.
 */
export function usePaginatedQuery(
  fetcher,
  { initialFilters = {}, extraParams = {}, limit = 10, initialSort = "newest", enabled = true } = {}
) {
  const [filters, setFiltersState] = useState(initialFilters);
  const [sort, setSortState] = useState(initialSort);
  const [pageState, setPageState] = useState({ page: 1, signature: "" });

  // Any change to what is being queried invalidates the current page number.
  const signature = JSON.stringify([filters, sort, extraParams]);
  const page = pageState.signature === signature ? pageState.page : 1;

  const params = { ...filters, ...extraParams, sort, page, limit };
  const { data, error, loading, reload } = useFetch(() => fetcher(params), [params], { enabled });

  const setPage = useCallback((next) => setPageState({ page: next, signature }), [signature]);
  const setFilters = useCallback((next) => setFiltersState((prev) => ({ ...prev, ...next })), []);
  const setSort = useCallback((next) => setSortState(next), []);

  return {
    items: data?.items ?? [],
    total: data?.total ?? 0,
    pages: data?.pages ?? 1,
    page,
    sort,
    filters,
    loading,
    error,
    setPage,
    setSort,
    setFilters,
    reload,
  };
}
