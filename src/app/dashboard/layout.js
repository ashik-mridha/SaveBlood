"use client";

import ProtectedRoute from "@/components/common/ProtectedRoute";
import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-[calc(100vh-4rem)] flex-col lg:flex-row">
        <Sidebar />
        <div className="min-w-0 flex-1 p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </ProtectedRoute>
  );
}
