import { useEffect, useState } from "react";
import { getJobs } from "../../api/api.ts";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadJobs() {
      try {
        const data = await getJobs(1);

        setJobs(data.jobs);
        setTotalJobs(data.pagination.totalJobs);
      } catch (error) {
        setError("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    }

    loadJobs();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }
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
