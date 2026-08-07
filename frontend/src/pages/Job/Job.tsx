import { useEffect, useState } from "react";
import type { IJob, IJobCoordinates } from "../../types/pages";
import { getJobById } from "../../api/api";
import styles from "./Job.module.css";
import { useLoading } from "../../context/LoadingContext";
import { useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import JobMap from "../../components/JobMap/JobMap";

const Job = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<IJob | null>(null);
  const [coordinates, setCoordinates] = useState<IJobCoordinates | null>(null);

  const { startLoading, stopLoading } = useLoading();

  useEffect(() => {
    if (!id) {
      return;
    }

    const fetchJob = async (): Promise<void> => {
      try {
        startLoading();
        const response = await getJobById(id);
        setJob(response.job);
        setCoordinates(response.coordinates);
      } catch (error) {
        console.error("Failed to load dashboard:", error);
      } finally {
        stopLoading();
      }
    };

    void fetchJob();
  }, []);

  if (!job) {
    return null;
  }

  // Clean description from html tags
  const safeDescription = DOMPurify.sanitize(
    job.description || "<p>Description is unavailable.</p>",
    {
      USE_PROFILES: {
        html: true,
      },
    },
  );

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div>
          <p className={styles.company}>{job.company_name}</p>
          <h1>{job.title}</h1>

          <div className={styles.badges}>
            <span>{job.job_level.replace(/_/g, " ")}</span>

            {job.is_remote && <span>Remote</span>}

            <span>{job.source}</span>
          </div>
        </div>

        <a
          href={job.apply_url}
          target="_blank"
          rel="noreferrer"
          className={styles.applyButton}
        >
          Apply now
        </a>
      </header>

      <div className={styles.content}>
        <main className={styles.descriptionCard}>
          <h2>Job Description</h2>

          <div
            className={styles.description}
            dangerouslySetInnerHTML={{
              __html: safeDescription,
            }}
          />
        </main>

        <aside className={styles.sidebar}>
          <section className={styles.infoCard}>
            <h2>Job Information</h2>

            <div className={styles.infoItem}>
              <span>Company</span>
              <strong>{job.company_name}</strong>
            </div>

            <div className={styles.infoItem}>
              <span>Location</span>
              <strong>{job.location}</strong>
            </div>

            <div className={styles.infoItem}>
              <span>Level</span>
              <strong>{job.job_level.replace(/_/g, " ")}</strong>
            </div>

            <div className={styles.infoItem}>
              <span>Source</span>
              <strong>{job.source}</strong>
            </div>
          </section>
        </aside>
      </div>

      <JobMap
        location={job.location}
        latitude={coordinates?.latitude}
        longitude={coordinates?.longitude}
      />
    </div>
  );
};

export default Job;
