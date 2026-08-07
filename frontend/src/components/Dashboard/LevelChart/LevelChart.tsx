import {
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from "recharts";

import type { PieSectorShapeProps } from "recharts";
import type { ILevelChartProps } from "../../../types/components";

import styles from "./LevelChart.module.css";

const COLORS = ["#111827", "#6b7280", "#d1d5db"];

const CustomSector = (props: PieSectorShapeProps) => {
  const color = COLORS[props.index % COLORS.length];

  return <Sector {...props} fill={color} />;
};

function LevelChart({ data }: ILevelChartProps) {
  return (
    <section className={styles.card}>
      <div className={styles.header}>
        <h2>Jobs by Level</h2>
        <p>Distribution of jobs by experience level</p>
      </div>

      {data.length === 0 ? (
        <p className={styles.empty}>No job level data found</p>
      ) : (
        <div className={styles.chart}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                innerRadius={65}
                outerRadius={105}
                paddingAngle={3}
                shape={CustomSector}
              />

              <Tooltip />
              <Legend verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  );
}

export default LevelChart;
