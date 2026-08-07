import axios from "axios";
import { IRawJoobleJob, IJoobleSearchResponse } from "../../types/api.js";

const jooble = axios.create({
  baseURL: "https://jooble.org/api",
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
  },
});

const SEARCH_QUERIES = [
  "Junior Software Engineer",
  "Entry Level Software Engineer",
  "New Grad Software Engineer",
];

const MAX_PAGES_PER_QUERY = 2;
const RESULTS_PER_PAGE = 20;

// Get data from Jooble API
const discoverJobsFromJooble = async (): Promise<IRawJoobleJob[]> => {
  const apiKey = process.env.JOOBLE_API_KEY;

  if (!apiKey) {
    console.error("[Jooble] JOOBLE_API_KEY is missing");

    return [];
  }

  const jobsById = new Map<string, IRawJoobleJob>();

  for (const query of SEARCH_QUERIES) {
    for (let page = 1; page <= MAX_PAGES_PER_QUERY; page++) {
      try {
        const response = await jooble.post<IJoobleSearchResponse>(
          `/${apiKey}`,
          {
            keywords: query,
            location: "USA",
            page: String(page),
            ResultOnPage: RESULTS_PER_PAGE,
            companysearch: "false",
          },
        );

        const jobs = response.data.jobs ?? [];

        for (const job of jobs) {
          const uniqueId = job.id ? String(job.id) : job.link;

          jobsById.set(uniqueId, job);
        }

        if (jobs.length < RESULTS_PER_PAGE) {
          break;
        }
      } catch (error: unknown) {
        console.error(
          `[Jooble] Query "${query}", ` + `page ${page} failed:`,
          error instanceof Error ? error.message : error,
        );

        break;
      }
    }
  }

  const uniqueJobs = [...jobsById.values()];

  console.log(`[Jooble] Collected ` + `${uniqueJobs.length} unique jobs`);

  return uniqueJobs;
};

export default discoverJobsFromJooble;
