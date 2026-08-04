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

const discoverCompaniesFromJooble = async (): Promise<RawJoobleJob[]> => {
  try {
    const response = await api.post<{ jobs?: RawJoobleJob[] }>(
      `https://jooble.org/api/${process.env.JOOBLE_API_KEY}`,
      {
        keywords:
          '"Junior Software Engineer" OR "Entry Level Software Engineer"',
        location: "USA",
        page: "1",
      },
    );

    const jobs: RawJoobleJob[] = response.data.jobs || [];
    return jobs;
  } catch (error) {
    console.error("[Jooble API Error]:", error);
    return [];
  }
};

export default discoverCompaniesFromJooble;
