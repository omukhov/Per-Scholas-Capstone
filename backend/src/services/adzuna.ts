import axios from "axios";
import { RawAdzunaJob } from "../types/api.js";

const adzuna = axios.create({
  baseURL: "https://api.adzuna.com/v1/api/jobs/us",
  timeout: 10000,
});

const discoverJuniorJobsFromAdzuna = async (): Promise<RawAdzunaJob[]> => {
  const allJobs: RawAdzunaJob[] = [];
  const maxPages = 5;

  for (let page = 1; page <= maxPages; page++) {
    try {
      const response = await adzuna.get(`/search/${page}`, {
        params: {
          app_id: process.env.ADZUNA_APP_ID,
          app_key: process.env.ADZUNA_APP_KEY,
          category: "it-jobs",
          what_exclude: "nurse nursing clinical driver sales recruiter",
          results_per_page: 50,
          sort_by: "date",
          max_days_old: 7,
        },
      });

      const results: RawAdzunaJob[] = response.data.results || [];
      allJobs.push(...results);

      if (results.length < 50) break;
    } catch (error) {
      console.error(
        `Adzuna page ${page} failed:`,
        error instanceof Error ? error.message : error,
      );
      break;
    }
  }

  return allJobs;
};

export default discoverJuniorJobsFromAdzuna;
