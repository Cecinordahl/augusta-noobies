import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface HcpDataPoint {
  year: number;
  hcpPercentage: number;
}

interface HcpLineChartProps {
  data: HcpDataPoint[];
}

export function HcpLineChart({ data }: HcpLineChartProps) {
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 0, left: 0 }}>
          <CartesianGrid stroke="#0e3a2b22" vertical={false} />
          <XAxis dataKey="year" stroke="#0e3a2b" fontSize={12} />
          <YAxis stroke="#0e3a2b" fontSize={12} unit="%" />
          <Tooltip formatter={(value) => [`${value}%`, "HCP"]} />
          <Line
            type="monotone"
            dataKey="hcpPercentage"
            stroke="#c8a25a"
            strokeWidth={3}
            dot={{ r: 4, fill: "#0e3a2b" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
