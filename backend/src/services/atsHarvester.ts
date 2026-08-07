import { Company } from "../models/Company.js";
import { Job } from "../models/Job.js";
import fetchAshbyJobs from "./api/ashby.js";
import fetchGreenhouseJobs from "./api/greenhouse.js";
import fetchLeverJobs from "./api/lever.js";
import {
  normalizeAshby,
  normalizeGreenhouse,
  normalizeLever,
} from "../utils/normalize.js";
import type { ICompany, JobStatus } from "../types/models.js";
import type { IUnifiedJobInput } from "../types/services.js";
import { isUnifiedJob } from "../utils/typeGuards.js";

const ALLOWED_ATS = ["greenhouse", "lever", "ashby"] as const;
const BATCH_SIZE = 100;

const harvestGreenhouse = async (
  company: ICompany,
): Promise<IUnifiedJobInput[]> => {
  const rawJobs = await fetchGreenhouseJobs(company);

  return rawJobs
    .map((rawJob) => normalizeGreenhouse(rawJob, company))
    .filter(isUnifiedJob);
};

const harvestLever = async (company: ICompany): Promise<IUnifiedJobInput[]> => {
  const rawJobs = await fetchLeverJobs(company);

  return rawJobs
    .map((rawJob) => normalizeLever(rawJob, company))
    .filter(isUnifiedJob);
};

const harvestAshby = async (company: ICompany): Promise<IUnifiedJobInput[]> => {
  const rawJobs = await fetchAshbyJobs(company);

  return rawJobs
    .map((rawJob) => normalizeAshby(rawJob, company))
    .filter(isUnifiedJob);
};

const atsHarvesters = {
  greenhouse: harvestGreenhouse,
  lever: harvestLever,
  ashby: harvestAshby,
};

// Get info from companies (ats, slug) and uses for getting jobs from
// (Greenhouse, Lever, Ashby)
export const runAtsHarvester = async (): Promise<void> => {
  console.log("[Harvester] Starting Direct ATS Job Scraping...");

  try {
    const companies = await Company.find({
      ats_type: {
        $in: ALLOWED_ATS,
      },
      active: true,
    })
      .sort({
        last_scraped_at: 1,
      })
      .limit(BATCH_SIZE);

    if (companies.length === 0) {
      console.log("[ATS Harvester] No active ATS companies found.");
      return;
    }

    let totalJobsFound = 0;
    let totalJobsAdded = 0;
    let totalJobsUpdated = 0;

    for (const company of companies) {
      const harvester =
        atsHarvesters[company.ats_type as keyof typeof atsHarvesters];
      if (!harvester) {
        continue;
      }

      try {
        const jobs = await harvester(company);

        if (jobs.length > 0) {
          const currentDate = new Date();

          const operations = jobs.map((job) => {
            const status: JobStatus = job.status ?? "active";

            return {
              updateOne: {
                filter: {
                  source: job.source,
                  source_job_id: job.source_job_id,
                },
                update: {
                  $set: {
                    ...job,
                    status,
                    last_seen_at: currentDate,
                  },
                  $setOnInsert: {
                    created_at: currentDate,
                  },
                },
                upsert: true,
              },
            };
          });

          const result = await Job.bulkWrite(operations, {
            ordered: false,
          });

          totalJobsFound += jobs.length;
          totalJobsAdded += result.upsertedCount;
          totalJobsUpdated += result.modifiedCount;
        }

        company.last_scraped_at = new Date();
        await company.save();

        console.log(
          `[ATS Harvester] ${company.name} (${company.ats_type}): ${jobs.length} jobs.`,
        );
      } catch (error: unknown) {
        /*
         * An error in one company must not stop
         * processing other companies.
         */
        console.error(
          `[ATS Harvester] ${company.name} failed:`,
          error instanceof Error ? error.message : error,
        );
      }
    }

    console.log(
      `[ATS Harvester] Finished:
      Found: ${totalJobsFound}
      Added: ${totalJobsAdded}
      Updated: ${totalJobsUpdated}`,
    );
  } catch (error: unknown) {
    console.error(
      "[ATS Harvester] Failed:",
      error instanceof Error ? error.message : error,
    );
  }
};

export default runAtsHarvester;
