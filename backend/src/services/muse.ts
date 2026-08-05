import axios from "axios";
import { RawMuseJob } from "../types/api.js";

const museClient = axios.create({
  baseURL: "https://www.themuse.com/api/public",
  timeout: 10000,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36",
    Accept: "application/json",
  },
});

const discoverJuniorJobsFromMuse = async (): Promise<RawMuseJob[]> => {
  const allJobs: RawMuseJob[] = [];
  const maxPages = 5;

  for (let page = 0; page <= maxPages; page++) {
    try {
      const response = await museClient.get("/jobs", {
        params: {
          category: "Software Engineering",
          page: page,
        },
      });

      const result: RawMuseJob[] = response.data.results;
      allJobs.push(...result);
      if (result.length < 20 || page >= response.data.page_count - 1) break;
    } catch (error: unknown) {
      console.error(
        `The Muse page ${page} failed:`,
        error instanceof Error ? error.message : error,
      );
      break;
    }
  }

  return allJobs;
};

export default discoverJuniorJobsFromMuse;
