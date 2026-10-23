"use client";

import { api } from "@/lib/api";
import { useAuth } from "@/providers/AuthProvider";
import { usePaginatedQuery } from "@/hooks/usePaginatedQuery";
import { Card } from "@/components/ui/Card";
import PageHeader from "@/components/dashboard/PageHeader";
import RequestsTable, { toSortProps } from "@/components/dashboard/RequestsTable";

const fetchDonations = (params) => api.getRequests({ ...params, scope: "donated" });

export default function DonationsPage() {
  const { user } = useAuth();
  const query = usePaginatedQuery(fetchDonations, { limit: 10 });

  return (
    <div>
      <PageHeader title="My donations" description="Requests you have offered to donate blood for." />
      <Card>
        <RequestsTable
          user={user}
          rows={query.items}
          loading={query.loading}
          readOnly
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
