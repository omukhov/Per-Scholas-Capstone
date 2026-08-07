import { useEffect, useState } from "react";
import type { IJobDetailsResponse } from "../../types/pages";
import { getJobById } from "../../api/api";
import styles from "./Job.module.css";
import { useLoading } from "../../context/LoadingContext";
import { useParams } from "react-router-dom";

const Job = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const [details, setDetails] = useState<IJobDetailsResponse | null>(null);

  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchJob = async (): Promise<void> => {
      try {
        startLoading();
        const response = await getJobById(id);
        setDetails(response);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        stopLoading();
      }
    };

    void fetchJob();
  }, []);

  if (!details) {
    return null;
  }

  const { job, coordinates } = details;

  return (
    <div className={styles.page}>
      <section className={styles.details}>
        <h1>{job.title}</h1>

        <h2>{job.company_name}</h2>

        <p>
          <strong>Location:</strong> {job.location}
        </p>

        <p>
          <strong>Level:</strong> {job.job_level}
        </p>

        <p>
          <strong>Source:</strong> {job.source}
        </p>

        <div className={styles.description}>
          <h2>Description</h2>

          <p>{job.description || "Description is unavailable."}</p>
        </div>

        <a
          href={job.apply_url}
          target="_blank"
          rel="noreferrer"
          className={styles.applyButton}
        >
          Apply for this job
        </a>
      </section>

      {/* <JobMap
        location={job.location}
        latitude={coordinates?.latitude}
        longitude={coordinates?.longitude}
      /> */}
    </div>
  );
};

export default Job;
