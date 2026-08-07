import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { IJobsTimelineProps } from "../../../types/components";
import styles from "./JobsTimeline.module.css";

function JobsTimeline({ data }: IJobsTimelineProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2>Jobs Added Over Time</h2>
        <p>New jobs collected during the last 14 days</p>
      </div>

      {data.length === 0 ? (
        <p className={styles.empty}>No timeline data found</p>
      ) : (
        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                left: 0,
                bottom: 10,
              }}
            >
              <defs>
                <linearGradient id="jobsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4b5563" stopOpacity={0.5} />

                  <stop offset="95%" stopColor="#4b5563" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid
                stroke="#e5e7eb"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="date"
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

              <Tooltip />

              <Area
                type="monotone"
                dataKey="jobs"
                name="Jobs"
                stroke="#374151"
                strokeWidth={3}
                fill="url(#jobsGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default JobsTimeline;
