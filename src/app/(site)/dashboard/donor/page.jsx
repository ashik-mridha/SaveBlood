"use client";

import { CheckCircle2, Clock, HandHeart, ListChecks, Loader } from "lucide-react";
import { api } from "@/lib/api";
import Overview from "@/components/dashboard/Overview";

const cards = [
  { label: "My requests", icon: ListChecks, value: (s) => s.total },
  { label: "Pending", icon: Clock, value: (s) => s.pending },
  { label: "In progress", icon: Loader, value: (s) => s.inprogress },
  { label: "Completed", icon: CheckCircle2, value: (s) => s.done },
  { label: "Donations made", icon: HandHeart, value: (s) => s.donations },
];

export default function DonorOverviewPage() {
  return (
    <Overview
      title="My dashboard"
      description="Track the blood requests you created and the donations you made."
      fetchStats={api.getDonorStats}
      cards={cards}
      tableTitle="Recent requests"
    />
  );
}
