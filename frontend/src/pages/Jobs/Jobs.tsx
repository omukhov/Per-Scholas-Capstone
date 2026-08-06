import { useEffect, useState } from "react";
import { getJobs } from "../../api/api.ts";
import { useLoading } from "../../context/LoadingContext.jsx";
import type { Job } from "../../types/pages.ts";
import { columns } from "../../data/Companies.tsx";
import DataTable from "../../components/DataTable/DataTable.tsx";

function Jobs() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [totalJobs, setTotalJobs] = useState<number>(0);
  const [error, setError] = useState<string | null | unknown>(null);
  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    async function loadJobs(): Promise<void> {
      try {
        startLoading();
        setError(null);
        const data = await getJobs(1);

        setJobs(data.jobs);
        setTotalJobs(data.pagination.totalJobs);
      } catch (error: unknown) {
        stopLoading();
        setError(error);
        console.error("Failed to load jobs:", error);

        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Unknown error occurred");
        }
      } finally {
        stopLoading();
      }
    }

    loadJobs();
  }, []);

  return (
    <div>
      <h1>Job Market</h1>

      <p>Total jobs: {totalJobs}</p>

      <DataTable
        columns={columns}
        data={jobs}
        getRowKey={(job: Job) => job._id}
        emptyMessage="No jobs found"
      />
    </div>
  );
}

export default Jobs;
