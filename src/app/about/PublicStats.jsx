"use client";

import { api } from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { useFetch } from "@/hooks/useFetch";

export default function PublicStats() {
  const { data, error } = useFetch(() => api.getPublicStats(), []);
  if (error) return null;

  const stats = [
    { label: "Registered donors", value: data && formatNumber(data.totalDonors) },
    { label: "Requests posted", value: data && formatNumber(data.totalRequests) },
    { label: "Donations completed", value: data && formatNumber(data.fulfilledRequests) },
    { label: "Funds contributed", value: data && formatCurrency(data.totalFunds) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <div key={stat.label} className="rounded-2xl border border-line bg-surface p-5 text-center shadow-card">
          <dd className="text-3xl font-extrabold text-brand-600">{stat.value ?? "—"}</dd>
          <dt className="mt-1 text-sm text-muted">{stat.label}</dt>
        </div>
      ))}
    </dl>
  );
}
