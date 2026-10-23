"use client";

import { Download } from "lucide-react";
import { api } from "@/lib/api";
import { useFetch } from "@/hooks/useFetch";
import { formatCurrency, formatPlace, formatStatus } from "@/lib/utils";
import ProtectedRoute from "@/components/common/ProtectedRoute";
import Button from "@/components/ui/Button";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { Skeleton } from "@/components/ui/Skeleton";
import { BloodGroupBar, StatusPie, TimeLine } from "@/components/charts";
import PageHeader from "@/components/dashboard/PageHeader";

function buildCsv(stats) {
  const rows = [
    ["Section", "Label", "Value"],
    ["Totals", "Users", stats.totalUsers],
    ["Totals", "Donors", stats.totalDonors],
    ["Totals", "Volunteers", stats.totalVolunteers],
    ["Totals", "Requests", stats.totalRequests],
    ["Totals", "Funds (USD)", stats.totalFunds],
    ...stats.byStatus.map((row) => ["Requests by status", formatStatus(row.label), row.count]),
    ...stats.byBloodGroup.map((row) => ["Requests by blood group", row.label, row.count]),
    ...stats.topDistricts.map((row) => ["Top districts", formatPlace(row.label), row.count]),
    ...stats.charts.monthly.map((row) => ["Requests per month", row.label, row.count]),
  ];
  return rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")).join("\n");
}

function downloadCsv(stats) {
  const url = URL.createObjectURL(new Blob([buildCsv(stats)], { type: "text/csv;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `saveblood-report-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

function ReportsContent() {
  const { data: stats, error } = useFetch(api.getAdminStats, []);

  const districts = stats?.topDistricts.map((row) => ({ ...row, label: formatPlace(row.label) })) || [];

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Reports"
        description="Request volume, blood-group demand and funding at a glance."
        action={
          <Button variant="outline" disabled={!stats} onClick={() => downloadCsv(stats)}>
            <Download className="size-4" aria-hidden="true" />
            Download CSV
          </Button>
        }
      />

      {error && <p role="alert" className="text-sm font-medium text-red-700 dark:text-red-300">{error.message}</p>}

      {!stats ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-80" />
          ))}
        </div>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {[
              ["Registered users", stats.totalUsers],
              ["Total requests", stats.totalRequests],
              ["Completed requests", stats.doneRequests],
              ["Funds raised", formatCurrency(stats.totalFunds)],
            ].map(([label, value]) => (
              <Card key={label} className="p-5">
                <p className="text-sm font-medium text-muted">{label}</p>
                <p className="mt-1 text-2xl font-extrabold text-ink">{value}</p>
              </Card>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Top districts by requests</CardTitle>
              </CardHeader>
              <CardBody>{districts.length ? <BloodGroupBar data={districts} color="#f59e0b" /> : <p className="py-10 text-center text-sm text-muted">No district data yet.</p>}</CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Status split</CardTitle>
              </CardHeader>
              <CardBody>
                <StatusPie data={stats.byStatus} />
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Requests per month</CardTitle>
              </CardHeader>
              <CardBody>
                <TimeLine data={stats.charts.monthly} />
              </CardBody>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Demand by blood group</CardTitle>
              </CardHeader>
              <CardBody>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-line text-left text-xs uppercase text-muted">
                      <th scope="col" className="py-2">Blood group</th>
                      <th scope="col" className="py-2 text-right">Requests</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.byBloodGroup.map((row) => (
                      <tr key={row.label} className="border-b border-line last:border-0">
                        <td className="py-2 font-semibold">{row.label}</td>
                        <td className="py-2 text-right">{row.count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardBody>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminReportsPage() {
  return (
    <ProtectedRoute roles={["admin"]}>
      <ReportsContent />
    </ProtectedRoute>
  );
}
