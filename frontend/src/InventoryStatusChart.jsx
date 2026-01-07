import React from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#2238c5ff", "#ca44efff"]; // New Jobs, Resolved

const TicketStatusChart = ({ ticketCount = 0, resolvedTickets = 0 }) => {
  const data = [
    { name: "New Jobs", value: ticketCount },
    { name: "Resolved", value: resolvedTickets },
  ];

  // Prevent empty pie issue
  const hasData = ticketCount > 0 || resolvedTickets > 0;

  return (
    <div style={{ width: "100%", height: 260 }}>
      <ResponsiveContainer width="100%" height={260}>
        {hasData ? (
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        ) : (
          <p style={{ textAlign: "center", marginTop: 100 }}>
            No ticket data available
          </p>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default TicketStatusChart;
