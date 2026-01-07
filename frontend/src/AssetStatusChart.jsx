import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const COLORS = ["#3b82f6", "#22c55e", "#fbbf24", "#ef4444"];

const AssetStatusChart = ({ total, inUse, underMaintenance, disposed }) => {
  const data = [
    { status: "Total", count: total },
    { status: "In Use", count: inUse },
    { status: "Under Maintenance", count: underMaintenance },
    { status: "Disposed", count: disposed },
  ];

  const maxValue = Math.max(...data.map(d => d.count), 1);

  return (
    <div style={{ width: "100%", height: 300 }}>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="status" />
          <YAxis allowDecimals={false} domain={[0, maxValue + 1]} />
          <Tooltip formatter={(value) => `${value} Assets`} />
          <Bar dataKey="count">
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AssetStatusChart;
