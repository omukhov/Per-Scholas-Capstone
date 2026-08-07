import { useEffect, useState } from "react";
import { getDashboard } from "../../api/api";
import { useLoading } from "../../context/LoadingContext";
import type { IDashboardData } from "../../types/pages";

import StatCard from "../../components/Dashboard/StatCard/StatCard";
import SourceChart from "../../components/Dashboard/SourceChart/SourceChart";
import LevelChart from "../../components/Dashboard/LevelChart/LevelChart";
import JobsTimeline from "../../components/Dashboard/JobsTimeline/JobsTimeline";

import styles from "./Home.module.css";

function Home(): React.JSX.Element | null {
  const [dashboard, setDashboard] = useState<IDashboardData | null>(null);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    async function loadDashboard(): Promise<void> {
      try {
        startLoading();

        const data = await getDashboard();

        setDashboard(data);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        stopLoading();
      }
    }

    void loadDashboard();
  }, []);

  if (!dashboard) {
    return null;
  }

  return (
    <section>
      <div className={styles.header}>
        <h1>Job Market Dashboard</h1>
        <p>Junior and entry-level software job market overview</p>
      </div>

      <div className={styles.statsGrid}>
        <StatCard
          title="Active Jobs"
          value={dashboard.summary.totalJobs}
          description="Available opportunities"
        />

        <StatCard
          title="Hiring Companies"
          value={dashboard.summary.totalCompanies}
          description="Companies with active jobs"
        />

        <StatCard
          title="Remote Jobs"
          value={dashboard.summary.remoteJobs}
          description="Work from anywhere"
        />

        <StatCard
          title="Internships"
          value={dashboard.summary.internships}
          description="Internship opportunities"
        />
      </div>

      <div className={styles.chartsGrid}>
        <SourceChart data={dashboard.jobsBySource} />
        <LevelChart data={dashboard.jobsByLevel} />
      </div>

      <div className={styles.jobTimeline}>
        <JobsTimeline data={dashboard.jobsByDay} />
      </div>
    </section>
  );
}

export default Home;
