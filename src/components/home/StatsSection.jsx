"use client";

import { Banknote, HeartHandshake, MapPinned, Users } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/utils";
import { useFetch } from "@/hooks/useFetch";
import { Skeleton } from "@/components/ui/Skeleton";

export default function StatsSection() {
  const { data, error } = useFetch(() => api.getPublicStats(), []);

  const items = [
    { label: "Registered donors", value: data && formatNumber(data.totalDonors), icon: Users },
    { label: "Donations completed", value: data && formatNumber(data.fulfilledRequests), icon: HeartHandshake },
    { label: "Districts covered", value: data && formatNumber(data.districtsCovered), icon: MapPinned },
    { label: "Funds raised", value: data && formatCurrency(data.totalFunds), icon: Banknote },
  ];

  return (
    <section aria-label="SaveBlood in numbers" className="border-b border-line bg-surface">
      <div className="container-page grid grid-cols-2 gap-6 py-10 lg:grid-cols-4">
        {items.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex min-w-0 items-center gap-3 sm:gap-4">
            <span className="hidden size-12 shrink-0 items-center sm:flex justify-center rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-900/30">
              <Icon className="size-6" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              {error ? (
                <p className="text-2xl font-extrabold">—</p>
              ) : value ? (
                <p className="truncate text-xl font-extrabold tracking-tight text-ink sm:text-2xl md:text-3xl">{value}</p>
              ) : (
                <Skeleton className="h-8 w-20" />
              )}
              <p className="text-sm text-muted">{label}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
