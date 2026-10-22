"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { axisTick, gridStroke, tooltipStyle } from "./theme";

export default function TimeLine({ data }) {
  return (
    <div className="h-72 w-full text-muted" role="img" aria-label="Line chart of requests over time">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridStroke} vertical={false} />
          <XAxis dataKey="label" tick={axisTick} tickLine={false} axisLine={false} />
          <YAxis allowDecimals={false} tick={axisTick} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} formatter={(value) => [value, "Requests"]} />
          <Line type="monotone" dataKey="count" stroke="#dc2626" strokeWidth={3} dot={{ r: 4, fill: "#dc2626" }} activeDot={{ r: 6 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
