"use client";

import { CheckCircle2, Clock, Loader, ListChecks, Wallet } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency } from "@/lib/utils";
import Overview from "@/components/dashboard/Overview";

const cards = [
  { label: "All requests", icon: ListChecks, value: (s) => s.totalRequests },
  { label: "Pending", icon: Clock, value: (s) => s.pendingRequests },
  { label: "In progress", icon: Loader, value: (s) => s.inProgressRequests },
  { label: "Completed", icon: CheckCircle2, value: (s) => s.doneRequests },
  { label: "Funds raised", icon: Wallet, value: (s) => formatCurrency(s.totalFunds) },
];

export default function VolunteerOverviewPage() {
  return (
    <Overview
      title="Volunteer dashboard"
      description="Coordinate open requests and keep families updated."
      fetchStats={api.getVolunteerStats}
      cards={cards}
      tableTitle="Latest requests"
    />
  );
}
