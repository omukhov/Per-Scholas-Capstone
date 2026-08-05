import axios, { AxiosResponse } from "axios";
import { RawJoobleJob } from "../types/api.js";

const api = axios.create({
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    Accept: "application/json, text/plain, */*",
    "Accept-Language": "en-US,en;q=0.9",
  },
});

const discoverJuniorJobsFromJooble = async (): Promise<RawJoobleJob[]> => {
  const allJobs: RawJoobleJob[] = [];
  const maxPages = 5;

  for (let page = 1; page <= maxPages; page++) {
    try {
      const response = await api.post<{ jobs?: RawJoobleJob[] }>(
        `https://jooble.org/api/${process.env.JOOBLE_API_KEY}`,
        {
          keywords: '"Software Engineer" OR "Software Developer"',
          location: "USA",
          page: String(page),
        },
      );

      const jobs: RawJoobleJob[] = response.data.jobs || [];
      allJobs.push(...jobs);
      if (jobs.length < 20) break;
    } catch (error) {
      console.error(
        `Jooble page ${page} failed:`,
        error instanceof Error ? error.message : error,
      );
      break;
    }
  }

  return allJobs;
};

export default discoverJuniorJobsFromJooble;
