import axios from "axios";
import { IRawAdzunaJob, IAdzunaSearchResponse } from "../../types/api.js";

const adzuna = axios.create({
  baseURL: "https://api.adzuna.com/v1/api/jobs/us",
  timeout: 10000,
});

const SEARCH_QUERIES = [
  "junior software engineer",
  "entry level software engineer",
  "new grad software engineer",
  "software engineer intern",
  "junior frontend developer",
  "entry level web developer",
];

const MAX_PAGES_PER_QUERY = 1;
const RESULTS_PER_PAGE = 50;

// Get data from Adzuna api
const discoverJobsFromAdzuna = async (): Promise<IRawAdzunaJob[]> => {
  // Empty collection <key type: value type>
  const jobsById = new Map<string, IRawAdzunaJob>();

  for (const query of SEARCH_QUERIES) {
    for (let page = 1; page <= MAX_PAGES_PER_QUERY; page++) {
      try {
        const response = await adzuna.get<IAdzunaSearchResponse>(
          `/search/${page}`,
          {
            params: {
              app_id: process.env.ADZUNA_APP_ID,
              app_key: process.env.ADZUNA_APP_KEY,
              category: "it-jobs",
              what: query,
              what_exclude:
                "senior OR sr OR lead OR staff OR principal OR manager OR director OR architect OR head OR vp OR vice president",
              results_per_page: RESULTS_PER_PAGE,
              sort_by: "date",
              max_days_old: 7,
            },
          },
        );

        const jobs = response.data.results ?? [];

        for (const job of jobs) {
          // Set get 2 parameters (key, value)
          jobsById.set(String(job.id), job);
        }
      } catch (error: unknown) {
        console.error(
          `[Adzuna] Query "${query}", ` + `page ${page} failed:`,
          error instanceof Error ? error.message : error,
        );

        break;
      }
    }
  }

  // Created new array with only values
  const jobs = [...jobsById.values()];

  console.log(`[Adzuna] Collected ${jobs.length} ` + "unique jobs");

  return jobs;
};

export default discoverJobsFromAdzuna;
