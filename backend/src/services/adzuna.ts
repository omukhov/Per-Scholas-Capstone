import axios from "axios";
import { RawAdzunaJob } from "../types/api.js";

const adzuna = axios.create({
  baseURL: "https://api.adzuna.com/v1/api/jobs/us",
  timeout: 10000,
});

const discoverCompaniesFromAdzuna = async (
  maxPages = 5,
): Promise<RawAdzunaJob[]> => {
  const allJobs: RawAdzunaJob[] = [];

  for (let page = 1; page <= maxPages; page++) {
    try {
      const response = await adzuna.get(`/search/${page}`, {
        params: {
          app_id: process.env.ADZUNA_APP_ID,
          app_key: process.env.ADZUNA_APP_KEY,
          category: "it-jobs",
          what_or:
            "software engineer developer frontend web fullstack java javascript react node",
          what_exclude:
            "senior sr lead staff principal manager director architect nurse nursing clinical driver sales recruiter",
          results_per_page: 50,
          sort_by: "date",
          max_days_old: 7,
        },
      });

      const results: RawAdzunaJob[] = response.data.results || [];
      allJobs.push(...results);

      if (results.length < 50) break;
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  return allJobs;
};

export default discoverCompaniesFromAdzuna;
