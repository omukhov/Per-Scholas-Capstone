import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { ISourceChartProps } from "../../../types/components";
import styles from "./SourceChart.module.css";

const SourceChart = ({ data }: ISourceChartProps): React.JSX.Element | null => {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2>Jobs by Source</h2>
        <p>Number of jobs collected from each source</p>
      </div>

      {data.length === 0 ? (
        <p className={styles.empty}>No source data found</p>
      ) : (
        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 10,
                left: 0,
                bottom: 10,
              }}
            >
              <CartesianGrid
                stroke="#e5e7eb"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="name"
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={{ stroke: "#d1d5db" }}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fill: "#6b7280", fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip
                cursor={{ fill: "rgba(156, 163, 175, 0.15)" }}
                formatter={(value) => [Number(value), "Jobs"]}
              />

              <Bar
                dataKey="value"
                name="Jobs"
                fill="#4b5563"
                radius={[7, 7, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
};

export default SourceChart;
