"use client";

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { formatStatus } from "@/lib/utils";
import { statusColors, tooltipStyle } from "./theme";

export default function StatusPie({ data }) {
  const rows = data.filter((row) => row.count > 0).map((row) => ({ ...row, name: formatStatus(row.label) }));

  if (!rows.length) {
    return <p className="flex h-72 items-center justify-center text-sm text-muted">No requests to chart yet.</p>;
  }

  return (
    <div className="h-72 w-full text-ink" role="img" aria-label="Pie chart of requests by status">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={rows} dataKey="count" nameKey="name" innerRadius={55} outerRadius={90} paddingAngle={3} stroke="none">
            {rows.map((row) => (
              <Cell key={row.label} fill={statusColors[row.label]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend iconType="circle" wrapperStyle={{ fontSize: 13 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
