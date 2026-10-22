"use client";

import { useState } from "react";
import { Card, CardBody, CardHeader, CardTitle } from "@/components/ui/Card";
import { BloodGroupBar, StatusPie, TimeLine } from "@/components/charts";
import { cn } from "@/lib/utils";

const ranges = [
  { key: "daily", label: "7 days" },
  { key: "weekly", label: "4 weeks" },
  { key: "monthly", label: "6 months" },
];

/** Bar (blood groups) + Line (over time) + Pie (status) from a stats payload. */
export default function ChartsGrid({ stats }) {
  const [range, setRange] = useState("monthly");

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Requests by blood group</CardTitle>
        </CardHeader>
        <CardBody>
          <BloodGroupBar data={stats.byBloodGroup} />
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex-row flex-wrap items-center justify-between gap-3">
          <CardTitle>Requests over time</CardTitle>
          <div role="group" aria-label="Time range" className="flex rounded-xl border border-line p-1">
            {ranges.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setRange(item.key)}
                aria-pressed={range === item.key}
                className={cn(
                  "focus-ring rounded-lg px-3 py-1 text-xs font-semibold",
                  range === item.key ? "bg-brand-600 text-white" : "text-muted hover:text-ink"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardBody>
          <TimeLine data={stats.charts[range]} />
        </CardBody>
      </Card>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Status split</CardTitle>
        </CardHeader>
        <CardBody>
          <StatusPie data={stats.byStatus} />
        </CardBody>
      </Card>
    </div>
  );
}
