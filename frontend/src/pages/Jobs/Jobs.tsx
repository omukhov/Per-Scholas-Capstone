import { useContext, useEffect, useState } from "react";
import { getJobs } from "../../api/api.ts";
import { useLoading } from "../../context/LoadingContext.jsx";
import type { Job } from "../../types/job.ts";

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
        const data = await getJobs();

        setJobs(data);
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

      {jobs.map((job: any) => (
        <article key={job._id}>
          <h2>{job.title}</h2>
          <p>{job.company_name}</p>
          <p>{job.location}</p>

          <a href={job.apply_url} target="_blank" rel="noreferrer">
            Apply
          </a>
        </article>
      ))}
    </div>
  );
}

export default Jobs;
