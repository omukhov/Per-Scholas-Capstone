import axios from "axios";
import { IRawMuseJob, IMuseSearchResponse } from "../../types/api.js";

const muse = axios.create({
  baseURL: "https://www.themuse.com/api/public",
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    Accept: "application/json",
  },
});

const JOB_LEVELS = ["Entry Level", "Internship"] as const;

const MAX_PAGES_PER_LEVEL = 2;
const RESULTS_PER_PAGE = 20;

const discoverJobsFromMuse = async (): Promise<IRawMuseJob[]> => {
  const jobsById = new Map<string, IRawMuseJob>();

  for (const level of JOB_LEVELS) {
    for (let page = 0; page <= MAX_PAGES_PER_LEVEL; page++) {
      try {
        const response = await muse.get<IMuseSearchResponse>("/jobs", {
          params: {
            category: "Software Engineering",
            page,
            level,
          },
        });

        const jobs = response.data.results ?? [];

        for (const job of jobs) {
          jobsById.set(String(job.id), job);
        }

        const pageCount = response.data.page_count ?? 0;

        const isLastPage = pageCount > 0 && page >= pageCount - 1;

        if (jobs.length < RESULTS_PER_PAGE || isLastPage) {
          break;
        }
      } catch (error: unknown) {
        console.error(
          `[The Muse] Level "${level}", ` + `page ${page} failed:`,
          error instanceof Error ? error.message : error,
        );

        break;
      }
    }
  }

  const uniqueJobs = [...jobsById.values()];

  console.log(`[The Muse] Collected ` + `${uniqueJobs.length} unique jobs`);

  return uniqueJobs;
};

export default discoverJobsFromMuse;
