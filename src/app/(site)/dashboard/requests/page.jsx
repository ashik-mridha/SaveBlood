"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { useDebounce } from "@/hooks/useDebounce";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { bloodGroups } from "@/components/geoData";
import { statusLabels } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { Input, Select } from "@/components/ui/Input";
import PageHeader from "@/components/dashboard/PageHeader";
import RequestsTable, { toSortProps } from "@/components/dashboard/RequestsTable";

const statusOptions = Object.entries(statusLabels).map(([key, label]) => ({ key, label }));

export default function RequestsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search);

  const query = usePaginatedQuery(api.getRequests, { extraParams: { search: debouncedSearch }, limit: 10 });
  const isDonor = user.role === "donor";

  return (
    <div>
      <PageHeader
        title={isDonor ? "My requests" : user.role === "admin" ? "Manage requests" : "All requests"}
        description="Search, filter and update donation requests."
        action={
          <Button href="/dashboard/requests/create">
            <Plus className="size-4" aria-hidden="true" />
            New request
          </Button>
        }
      />

      <Card>
        <div className="grid gap-4 border-b border-line p-5 sm:grid-cols-2 lg:grid-cols-3">
          <Input label="Search" type="search" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Recipient, hospital or address" />
          <Select
            label="Status"
            value={query.filters.status || ""}
            onChange={(event) => query.setFilters({ status: event.target.value })}
            options={statusOptions}
            placeholder="All statuses"
          />
          <Select
            label="Blood group"
            value={query.filters.bloodGroup || ""}
            onChange={(event) => query.setFilters({ bloodGroup: event.target.value })}
            options={bloodGroups}
            placeholder="All blood groups"
          />
        </div>

        <RequestsTable
          user={user}
          rows={query.items}
          loading={query.loading}
          {...toSortProps(query.sort, query.setSort)}
          page={query.page}
          pages={query.pages}
          total={query.total}
          onPageChange={query.setPage}
          onChanged={query.reload}
        />
      </Card>
    </div>
  );
}
