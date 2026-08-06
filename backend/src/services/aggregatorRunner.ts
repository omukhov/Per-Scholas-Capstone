import discoverJobsFromAdzuna from "./api/adzuna.js";
import discoverJobsFromJooble from "./api/jooble.js";
import discoverJobsFromMuse from "./api/muse.js";
import fetchGithubInternships from "./api/internships.js";
import fetchGithubNewGrad from "./api/newGrad.js";
import { Job } from "../models/Job.js";
import {
  normalizeAdzuna,
  normalizeJooble,
  normalizeMuse,
} from "../utils/normalize.js";
import type { IUnifiedJobInput } from "../types/services.js";
import { isUnifiedJob } from "../utils/typeGuards.js";

const runFullDiscovery = async (): Promise<void> => {
  console.log("[Discovery] Starting job discovery...");

  try {
    /*
     * Adzuna, Jooble and Muse return raw jobs.
     * GitHub parsers already return unified jobs.
     */
    const [rawAdzuna, rawJooble, rawMuse, githubInternships, githubNewGrad] =
      await Promise.all([
        discoverJobsFromAdzuna(),
        discoverJobsFromJooble(),
        discoverJobsFromMuse(),
        fetchGithubInternships(),
        fetchGithubNewGrad(),
      ]);

    const adzunaJobs = rawAdzuna.map(normalizeAdzuna).filter(isUnifiedJob);

    const joobleJobs = rawJooble.map(normalizeJooble).filter(isUnifiedJob);

    const museJobs = rawMuse.map(normalizeMuse).filter(isUnifiedJob);

    const unifiedJobs: IUnifiedJobInput[] = [
      ...adzunaJobs,
      ...joobleJobs,
      ...museJobs,
      ...githubInternships,
      ...githubNewGrad,
    ];

    console.log(
      `[Discovery] Received:
      Adzuna: ${adzunaJobs.length}
      Jooble: ${joobleJobs.length}
      The Muse: ${museJobs.length}
      GitHub internships: ${githubInternships.length}
      GitHub new grad: ${githubNewGrad.length}`,
    );

    if (unifiedJobs.length === 0) {
      console.log("[Discovery] No jobs found.");
      return;
    }

    const currentDate = new Date();

    const operations = unifiedJobs.map((job) => ({
      updateOne: {
        filter: {
          source: job.source,
          source_job_id: job.source_job_id,
        },
        update: {
          $set: {
            ...job,
            status: job.status ?? "active",
            last_seen_at: currentDate,
          },
          $setOnInsert: {
            created_at: currentDate,
          },
        },
        upsert: true,
      },
    }));

    const result = await Job.bulkWrite(operations, {
      ordered: false,
    });

    console.log(
      `[Discovery] Finished:
      Found: ${unifiedJobs.length}
      Added: ${result.upsertedCount}
      Updated: ${result.modifiedCount}`,
    );
  } catch (error: unknown) {
    console.error(
      "[Discovery] Failed:",
      error instanceof Error ? error.message : error,
    );
  }
};

export default runFullDiscovery;
