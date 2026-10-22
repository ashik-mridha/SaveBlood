"use client";

import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { api } from "@/lib/api";
import { useFetch } from "@/hooks/useFetch";
import { Card, CardHeader, CardTitle } from "@/components/ui/Card";
import PageHeader from "./PageHeader";
import StatCard from "./StatCard";
import ChartsGrid from "./ChartsGrid";
import RequestsTable from "./RequestsTable";

/** Shared overview: stat cards, three charts and a recent-requests table. */
export default function Overview({ title, description, fetchStats, cards, tableTitle }) {
  const { user } = useAuth();
  const stats = useFetch(fetchStats, []);
  const recent = useFetch(() => api.getRequests({ limit: 5, sort: "newest" }), []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} />

      {stats.error && (
        <p role="alert" className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200">
          {stats.error.message}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <StatCard key={card.label} icon={card.icon} label={card.label} loading={!stats.data} value={stats.data ? card.value(stats.data) : ""} />
        ))}
      </div>

      {stats.data && <ChartsGrid stats={stats.data} />}

      <Card>
        <CardHeader className="flex-row items-center justify-between gap-3">
          <CardTitle>{tableTitle}</CardTitle>
          <Link href="/dashboard/requests" className="focus-ring rounded text-sm font-semibold text-brand-600 hover:underline">
            View all
          </Link>
        </CardHeader>
        <RequestsTable user={user} rows={recent.data?.items} loading={recent.loading} readOnly onChanged={recent.reload} />
      </Card>
    </div>
  );
}
