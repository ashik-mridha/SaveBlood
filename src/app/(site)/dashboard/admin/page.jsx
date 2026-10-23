"use client";

import { CheckCircle2, Clock, HandHeart, ListChecks, MessageSquare, Users, Wallet } from "lucide-react";
import { api } from "@/lib/api";
import { formatCurrency, formatNumber } from "@/lib/utils";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Overview from "@/components/dashboard/Overview";

const cards = [
  { label: "Total users", icon: Users, value: (s) => formatNumber(s.totalUsers) },
  { label: "Registered donors", icon: HandHeart, value: (s) => formatNumber(s.totalDonors) },
  { label: "Total requests", icon: ListChecks, value: (s) => formatNumber(s.totalRequests) },
  { label: "Pending requests", icon: Clock, value: (s) => formatNumber(s.pendingRequests) },
  { label: "Completed requests", icon: CheckCircle2, value: (s) => formatNumber(s.doneRequests) },
  { label: "Funds raised", icon: Wallet, value: (s) => formatCurrency(s.totalFunds) },
  { label: "New messages", icon: MessageSquare, value: (s) => formatNumber(s.unreadMessages) },
];

export default function AdminOverviewPage() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <Overview
        title="Admin dashboard"
        description="Platform activity across donors, requests and funding."
        fetchStats={api.getAdminStats}
        cards={cards}
        tableTitle="Latest requests"
      />
    </ProtectedRoute>
  );
}
